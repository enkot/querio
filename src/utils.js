import { parse } from 'graphql'

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

export function isGraphQL(entry) {
  // console.log(entry.request)

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

export function parseEntry(entry) {
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
      return Promise.resolve(
        `Internal Error Parsing: ${entry}. Message: ${e.message}. Stack: ${e.stack}`
      )
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
        return Promise.resolve(
          `Internal Error Parsing: ${entry}. Message: ${e.message}. Stack: ${e.stack}`
        )
      }

      parsedQueries.push(parseQuery(query, variables))
    }
  }

  return new Promise(resolve => {
    entry.getContent(responseBody => {
      const parsedResponseBody = JSON.parse(responseBody)
      const { url, postData, headers: requestHeaders } = entry.request
      const {
        content,
        headers: responseHeaders,
        httpStatus,
        _error,
      } = entry.response

      resolve(
        parsedQueries.map((parsedQuery, i) => {
          return {
            id: `${Date.now() + Math.random()}`,
            time: entry.time,
            request: {
              url,
              headers: requestHeaders,
              mimeType: postData.mimeType,
              name: parsedQuery.data[i].name,
              operations: parsedQuery.data[i].operations.map(item => item.name),
              ...parsedQuery,
            },
            response: {
              headers: responseHeaders,
              mimeType: content.mimeType,
              body: Array.isArray(parsedResponseBody)
                ? parsedResponseBody[i]
                : parsedResponseBody,
              status: httpStatus,
              error: _error,
            },
          }
        })
      )
    })
  })
}
