import type { DefinitionNode, FieldNode, InlineFragmentNode, OperationDefinitionNode, SelectionNode } from 'graphql'
import type { Header, Param } from 'har-format'
import { Kind, parse } from 'graphql'
import { getQuery, parseURL } from 'ufo'
import httpStatus from 'http-status'
import type { BaseEntry, Entry, GQLEntry, HAREntry, HTTPEntry } from '~/types'

class ParseResponseError extends Error {
  constructor(message = 'Cant\'t parse response content') {
    super(message)
    this.name = 'ParseResponseError'
  }
}

function ID() {
  return `${Date.now() + Math.random()}`
}

function isInlineFragment(node: SelectionNode): node is InlineFragmentNode {
  return node.kind === Kind.INLINE_FRAGMENT
}

function isField(node: SelectionNode): node is FieldNode {
  return node.kind === Kind.FIELD
}

function isContentType(request: { headers: Header[] }, contentType: string) {
  return request.headers.some(
    ({ name, value }) =>
      name.toLowerCase() === 'content-type'
      && value.split(';').at(0)?.toLowerCase() === contentType.toLowerCase(),
  )
}

function isOperationDefinition(node: DefinitionNode): node is OperationDefinitionNode {
  return node.kind === Kind.OPERATION_DEFINITION
}

function getName(node: SelectionNode): string {
  if (isInlineFragment(node) && node.typeCondition)
    return `InlineFragment if ${node.typeCondition.name.value}`

  else if (isField(node))
    return node.alias ? `${node.alias.value}: ${node.name.value}` : node.name.value

  else
    return 'Anonymous'
}

function parseOperation(definition: SelectionNode) {
  return {
    kind: definition.kind,
    name: getName(definition),
  }
}

function getQueryFromParams(params: Param[] = []) {
  const { value } = params.find(param => param.name === 'query') || {}

  return value && decodeURIComponent(value)
}

function parseQuery(query: string) {
  const { definitions } = parse(query, { noLocation: false })

  return definitions.filter(isOperationDefinition).map(definition => ({
    name: definition.name?.value,
    kind: definition.kind,
    type: definition.operation,
    operations: definition.selectionSet.selections
      .map(operation => parseOperation(operation))
      .map(operation => operation.name),
  }))
}

export function isGQLEntry(entry: Entry): entry is GQLEntry {
  return entry?.type === 'GQL'
}

export function isHTTP(entry: HAREntry) {
  return ['xhr', 'fetch', 'preflight'].includes(entry._resourceType)
}

export function isGraphQL(entry: HAREntry) {
  const { text, params } = entry.request.postData || {}

  if (isContentType(entry.request, 'application/graphql'))
    return true

  if (isContentType(entry.request, 'application/json') && text) {
    try {
      const json = JSON.parse(text)

      return !!(json.query || json.at(0).query)
    }
    catch (e) {
      return false
    }
  }

  if (
    isContentType(entry.request, 'application/x-www-form-urlencoded')
      && params
      && getQueryFromParams(params)
  )
    return true

  return false
}

export function parseHTTPEntry(entry: HAREntry): HTTPEntry {
  const { url, method, postData } = entry.request
  const { host, pathname, search: queryString } = parseURL(url)
  const { request, response, ...base } = getEntryInfo(entry)

  let body
  let params

  if (postData) {
    if (postData.params)
      params = postData.params

    else
      body = JSON.parse(postData.text)
  }
  const getResponse = () => getContent(entry)

  return {
    type: method,
    ...base,
    request: {
      ...request,
      name: pathname,
      host,
      pathname,
      queryString,
      query: getQuery(queryString),
      body,
      params,
    },
    response: {
      ...response,
      getResponse,
    },
  }
}

export function parseGQLEntry(entry: HAREntry): GQLEntry[] {
  const parsedQueries = []
  const { postData } = entry.request
  const { text, params } = postData || {}

  if (isContentType(entry.request, 'application/graphql') && text) {
    parsedQueries.push({
      data: parseQuery(text),
    })
  }
  else if (
    isContentType(entry.request, 'application/x-www-form-urlencoded')
    && params
  ) {
    const query = getQueryFromParams(params)
    if (query) {
      parsedQueries.push({
        data: parseQuery(query),
      })
    }
  }
  else if (text) {
    let json

    try {
      json = JSON.parse(text)
    }
    catch (e: any) {
      console.warn(
        `Internal Error Parsing: ${entry}. Message: ${e.message}. Stack: ${e.stack}`,
      )
      return []
    }

    if (!Array.isArray(json))
      json = [json]

    for (const batchItem of json) {
      const { query } = batchItem
      let { variables } = batchItem

      try {
        variables
          = typeof variables === 'string' ? JSON.parse(variables) : variables
      }
      catch (e: any) {
        console.warn(
          `Internal Error Parsing: ${entry}. Message: ${e.message}. Stack: ${e.stack}`,
        )
        return []
      }

      parsedQueries.push({
        query,
        data: parseQuery(query),
        variables,
      })
    }
  }

  return parsedQueries.map((parsedQuery, i) => {
    const { data, query, variables } = parsedQuery
    const { name, type, operations } = data[i]
    const { request, response, ...base } = getEntryInfo(entry)

    const getResponse = async () => {
      const body = await getContent(entry)

      return Array.isArray(body) ? body[i] : body
    }

    return {
      ...base,
      type: 'GQL',
      request: {
        ...request,
        name,
        operations,
        operationType: type,
        query,
        variables,
      },
      response: {
        ...response,
        getResponse,
      },
    }
  })
}

async function getContent(entry: HAREntry) {
  const [body] = await entry.getContent()

  if (!isContentType(entry.response, 'application/json'))
    return body

  try {
    return JSON.parse(body)
  }
  catch (e: any) {
    console.warn(
      `Internal Error Parsing: ${entry}. Message: ${e.message}. Stack: ${e.stack}`,
    )
    throw new ParseResponseError()
  }
}

function getEntryInfo(entry: HAREntry): BaseEntry {
  const { url, postData, headers: requestHeaders } = entry.request
  const { content, headers: responseHeaders, status, _error: error } = entry.response
  const isError = !!(error || status >= 400)
  const statusMessage = httpStatus[+status]
  const timestamp = new Date(entry.startedDateTime).getTime()

  return {
    id: ID(),
    time: entry.time,
    timestamp,
    request: {
      url,
      headers: requestHeaders,
      mimeType: postData?.mimeType,
    },
    response: {
      status,
      statusMessage,
      isError,
      error,
      headers: responseHeaders,
      mimeType: content.mimeType,
    },
  }
}
