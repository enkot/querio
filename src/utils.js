import { parse } from 'graphql'
import parseUrl from 'url-parse'
import httpStatus from 'statuses'

function ID() {
  return `${Date.now() + Math.random()}`
}

function getValue(value) {
  switch (value.kind) {
    case 'ListValue':
      return value.values.map(item => getValue(item))
    case 'Variable':
      return `$${value.name.value}`
    case 'ObjectValue':
      return JSON.stringify(
        value.fields.reduce(
          (acc, field) => ({
            ...acc,
            [field.name.value]: getValue(field.value),
          }),
          {}
        )
      )
    default:
      return value.value
  }
}

function parseArguments(arr) {
  return arr
    .filter(({ name }) => name)
    .map(({ name, value }) => ({
      name: name.value,
      value: getValue(value),
      kind: value.kind,
    }))
}

function parseFields(arr) {
  return arr.selections.map(item => parseOperation(item))
}

function getName(definition) {
  if (definition.kind === 'InlineFragment') {
    return `InlineFragment if ${definition.typeCondition.name.value}`
  } else if (definition.alias && definition.name) {
    return `${definition.alias.value}: ${definition.name.value}`
  } else if (definition.name) {
    return definition.name.value
  } else {
    return 'Anonymous'
  }
}

function parseOperation(definition) {
  return {
    kind: definition.kind,
    name: getName(definition),
    params: definition.arguments ? parseArguments(definition.arguments) : null,
    fields: definition.selectionSet
      ? parseFields(definition.selectionSet)
      : null,
  }
}

function internalParse(requestData) {
  const { definitions } = requestData
  return definitions.map(definition => ({
    name: definition.name
      ? definition.name.value
      : definition.operation || 'request',
    kind: definition.kind,
    type: definition.operation,
    operations: definition.selectionSet.selections.map(operation => ({
      ...parseOperation(operation),
      type: definition.operation || operation.kind,
    })),
  }))
}

function isContentType(entry, contentType) {
  return entry.request.headers.some(
    ({ name, value }) =>
      name.toLowerCase() === 'content-type' &&
      value.split(';')[0].toLowerCase() === contentType.toLowerCase()
  )
}

function getQueryFromParams(params = []) {
  return decodeURIComponent(params.find(param => param.name === 'query').value)
}

function parseQuery(query, variables = {}) {
  let data, rawParse

  try {
    rawParse = parse(query)
  } catch (e) {
    return Promise.resolve(
      `GraphQL Error Parsing: ${query}. Message ${e.message}. Stack: ${e.stack}`
    )
  }

  try {
    data = internalParse(rawParse)
  } catch (e) {
    return Promise.resolve(
      `Internal Error Parsing: ${query}. Message: ${e.message}. Stack: ${e.stack}`
    )
  }

  const fragments = data.filter(item => item.kind === 'FragmentDefinition')

  return {
    variables,
    fragments,
    query,
    data,
    rawParse: JSON.stringify(rawParse),
  }
}

export function isHTTP(entry) {
  return ['xhr', 'fetch'].includes(entry._resourceType)
}

export function isGraphQL(entry) {
  try {
    if (isContentType(entry, 'application/graphql')) {
      return true
    }

    if (isContentType(entry, 'application/json')) {
      const json = JSON.parse(entry.request.postData.text)
      return json.query || json[0].query
    }

    if (
      isContentType(entry, 'application/x-www-form-urlencoded') &&
      getQueryFromParams(entry.request.postData.params)
    ) {
      return true
    }
  } catch (e) {
    return false
  }
}

export function parseHTTPEntry(entry) {
  console.log(entry)
  const { url, method, postData } = entry.request
  const { origin, host, pathname, query } = parseUrl(url, true)
  const queryParams = Object.entries(query)
    .map(([name, value]) => `${name}=${value}`)
    .join('&')
  let body
  let params

  if (postData) {
    if (postData.params) {
      params = postData.params
    } else {
      try {
        body = JSON.parse(postData.text)
      } catch (e) {
        console.warn(
          `Internal Error Parsing: ${entry}. Message: ${e.message}. Stack: ${e.stack}`
        )
        return
      }
    }
  }

  return new Promise(resolve => {
    entry.getContent(responseBody => {
      let parseError
      let json

      try {
        json = JSON.parse(responseBody)
      } catch (e) {
        parseError = `Cant't parse response content`
        console.warn(
          `Internal Error Parsing: ${entry}. Message: ${e.message}. Stack: ${e.stack}`
        )
      }

      resolve(
        formatResult(
          method,
          pathname,
          entry,
          json,
          {
            origin,
            host,
            pathname,
            query,
            queryString: queryParams ? `?${queryParams}` : '',
            body,
            params,
          },
          {
            parseError,
          }
        )
      )
    })
  })
}

export function parseGQLEntry(entry) {
  const parsedQueries = []

  if (isContentType(entry, 'application/graphql')) {
    parsedQueries.push(
      parseQuery(entry.request.postData.text, entry.request.postData.variables)
    )
  } else if (isContentType(entry, 'application/x-www-form-urlencoded')) {
    parsedQueries.push(
      parseQuery(getQueryFromParams(entry.request.postData.params))
    )
  } else {
    let json

    try {
      json = JSON.parse(entry.request.postData.text)
    } catch (e) {
      console.warn(
        `Internal Error Parsing: ${entry}. Message: ${e.message}. Stack: ${e.stack}`
      )
      return
    }

    if (!Array.isArray(json)) {
      json = [json]
    }

    for (let batchItem of json) {
      const { query } = batchItem
      let { variables } = batchItem

      try {
        variables =
          typeof variables === 'string' ? JSON.parse(variables) : variables
      } catch (e) {
        console.warn(
          `Internal Error Parsing: ${entry}. Message: ${e.message}. Stack: ${e.stack}`
        )
        return
      }

      parsedQueries.push(parseQuery(query, variables))
    }
  }

  return new Promise(resolve => {
    entry.getContent(responseBody => {
      const parsedResponseBody = JSON.parse(responseBody)

      resolve(
        parsedQueries.map((parsedQuery, i) => {
          const { data, query, variables } = parsedQuery
          const { name, operations } = data[i]
          const reponseBody = Array.isArray(parsedResponseBody)
            ? parsedResponseBody[i]
            : parsedResponseBody

          return formatResult('GQL', name, entry, reponseBody, {
            operations: operations.map(item => item.name),
            query,
            variables,
          })
        })
      )
    })
  })
}

function formatResult(
  type,
  name,
  entry,
  responseBody,
  requestSpecific,
  responseSpecific = {}
) {
  const { url, postData, headers: requestHeaders } = entry.request
  const { content, headers: responseHeaders, status, _error } = entry.response
  const hasError =
    _error || status >= 400 || (type === 'GQL' && responseBody.errors)
  let statusMessage

  try {
    statusMessage = httpStatus(status)
  } catch (e) {
    console.warn(e.message)
  }

  return {
    id: ID(),
    time: entry.time,
    type,
    request: {
      url,
      headers: requestHeaders,
      mimeType: postData ? postData.mimeType : undefined,
      name,
      ...requestSpecific,
    },
    response: {
      status,
      statusMessage,
      isError: hasError,
      networkError: _error,
      headers: responseHeaders,
      mimeType: content.mimeType,
      body: responseBody,
      ...responseSpecific,
    },
  }
}
