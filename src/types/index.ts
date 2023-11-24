import type { OperationTypeNode } from 'graphql'
import type { Header, Param, Entry as _HAREntry } from 'har-format'
import type { QueryObject } from 'ufo'

export interface ButtonGroupItem {
  name: string
  title: string
  label?: string
}

export interface HAREntry extends _HAREntry {
  _resourceType: 'xhr' | 'fetch' | 'preflight'
  getContent: () => Promise<[string, string]>
}

interface BaseEntryRequest {
  url: string
  headers: Header[]
  preflightHeaders?: Header[]
  mimeType?: string
  method: string
}

interface BaseEntryResponse {
  status: number
  statusMessage?: string
  isError: boolean
  headers: Header[]
  preflightHeaders?: Header[]
  mimeType: string
}

export interface BaseEntry {
  id: string
  time: number
  timestamp: number
  request: BaseEntryRequest
  response: BaseEntryResponse
}

interface HTTPEntryRequest extends BaseEntryRequest {
  name: string
  host?: string
  pathname: string
  queryString: string
  query: QueryObject
  body: any
  params?: Param[]
}

interface HTTPEntryResponse extends BaseEntryResponse {
  getResponse: () => Promise<any>
}

export interface HTTPEntry extends BaseEntry {
  type: string
  request: HTTPEntryRequest
  response: HTTPEntryResponse
}

interface GQLEntryRequest extends BaseEntryRequest {
  name?: string
  operations: string[]
  operationType: OperationTypeNode
  query: any
  variables: any
  batch?: {
    length: number
    count: number
  }
}

interface GQLEntryResponse extends BaseEntryResponse {
  getResponse: () => Promise<{
    data?: any
    errors?: any[]
  }>
}

export interface GQLEntry extends BaseEntry {
  type: string
  request: GQLEntryRequest
  response: GQLEntryResponse
}

export type Entry = HTTPEntry | GQLEntry
