import type { DefinitionNode, FieldNode, InlineFragmentNode, OperationDefinitionNode, OperationTypeNode, SelectionNode } from 'graphql'
import type { Header, Param } from 'har-format'
import { Kind, parse } from 'graphql'
import { getQuery, parseURL } from 'ufo'
import { randomUUID } from 'uncrypto'
import httpStatus from 'http-status'
import prettier from 'prettier/standalone'
import htmlParser from 'prettier/parser-html'
// @ts-expect-error - no types
import xmlParser from '@prettier/plugin-xml'
import type { BaseEntry, Entry, GQLEntry, HAREntry, HTTPEntry } from '~/types'

class ParseResponseError extends Error {
  constructor(message = 'Cant\'t parse response content') {
    super(message)
    this.name = 'ParseResponseError'
  }
}

interface ParsedQueryDefinition {
  name: string | undefined
  kind: Kind.OPERATION_DEFINITION
  type: OperationTypeNode
  operations: string[]
}

interface ParsedQuery {
  query: string
  data: ParsedQueryDefinition[]
  variables?: any
  operationName?: string
  batch?: {
    length: number
    count: number
  }
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

function isValidQuery(query: string) {
  try {
    parse(query, { noLocation: true })

    return true
  }
  catch (_) {
    return false
  }
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

function getQueryValue(name: string, params: Param[] = []) {
  const { value } = params.find(param => param.name === name) || {}

  return value && decodeURIComponent(value)
}

function parseQuery(query: string): ParsedQueryDefinition[] {
  const { definitions } = parse(query, { noLocation: true })

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

  let query: string | undefined

  if (isContentType(entry.request, 'application/json')) {
    if (entry.request.method === 'GET') {
      query = getQueryValue('query', entry.request.queryString)
    }
    else if (entry.request.method === 'POST' && text) {
      try {
        const json = JSON.parse(text)
        query = Array.isArray(json) ? json.at(0).query : json.query
      }
      catch (e) {
        return false
      }
    }
  }
  else if (isContentType(entry.request, 'application/x-www-form-urlencoded') && params) {
    query = getQueryValue('query', params)
  }

  return !!query && isValidQuery(query)
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

    else if (postData.text)
      body = JSON.parse(postData.text)
  }
  const getResponse = async () => getContent(entry)

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

function isArray(arr: any): arr is any[] {
  return Array.isArray(arr)
}

export async function parseGQLEntry(entry: HAREntry): Promise<GQLEntry | GQLEntry[]> {
  const parsedQueries: ParsedQuery[] = []
  const { postData, queryString } = entry.request

  let json: ParsedQuery | null = null

  if (
    (isContentType(entry.request, 'application/json') && entry.request.method === 'GET')
    || isContentType(entry.request, 'application/x-www-form-urlencoded')
  ) {
    const params = entry.request.method === 'GET' ? queryString : postData?.params
    const query = getQueryValue('query', params)
    const variables = getQueryValue('variables', params)
    const operationName = getQueryValue('operationName', params)

    if (query) {
      json = {
        query,
        data: parseQuery(query),
        variables,
        operationName,
      }
    }
  }
  else if (postData?.text) {
    try {
      json = JSON.parse(postData.text)
    }
    catch (e: any) {
      console.warn(
        `Internal Error Parsing: ${entry}. Message: ${e.message}. Stack: ${e.stack}`,
      )
      return []
    }
  }

  [json].flat().forEach((batchItem: any, i: number) => {
    const { query, operationName } = batchItem
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
      operationName,
      batch: isArray(json)
        ? {
            length: json.length,
            count: i + 1,
          }
        : undefined,
    })
  })

  const fullParsedQueries = await Promise.all(parsedQueries.map(async (parsedQuery, i) => {
    const { data, query, variables, operationName, batch } = parsedQuery
    const { name, type, operations } = data[0]
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
        name: operationName || name,
        operations,
        operationType: type,
        query,
        variables,
        batch,
      },
      response: {
        ...response,
        isError: response.isError || !!(await getResponse()).errors,
        getResponse,
      },
    }
  }))

  return isArray(json) ? fullParsedQueries : fullParsedQueries[0]
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
  const { url, postData, headers: requestHeaders, method } = entry.request
  const { content, headers: responseHeaders, status } = entry.response
  const isError = status >= 400 || status === 0
  const statusMessage = httpStatus[+status]
  const timestamp = new Date(entry.startedDateTime).getTime()

  return {
    id: randomUUID(),
    time: entry.time,
    timestamp,
    request: {
      url,
      headers: requestHeaders,
      mimeType: postData?.mimeType,
      method,
    },
    response: {
      status,
      statusMessage,
      isError,
      headers: responseHeaders,
      mimeType: content.mimeType,
    },
  }
}

export function formatData(data: string, mimeType: string) {
  if (['text/html', 'application/html'].includes(mimeType))
    return prettier.format(data, { semi: false, parser: 'html', plugins: [htmlParser] })
  else if (['application/xml', 'text/xml'].includes(mimeType))
    return prettier.format(data, { semi: false, parser: 'xml', plugins: [xmlParser] })
  else if (['application/json', 'text/json'].includes(mimeType))
    return JSON.stringify(data, null, 2)
  else
    return data
}
