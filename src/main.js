import { htmlValidator } from 'html-parse-regex'
import { recall, getHash } from 'dejavu-call'
import { isString, isObject, ifThrow } from 'pytils'
import { readQuery } from './query'

export const throwIfHtmlInvalid = htmlValidator('fx-query')

export const html = { obj: null }

const memorizeReadQuery = queryString => recall(
  'fx-query-compile',
  readQuery,
  [queryString])

const memorizeRunQuery = (htmlObj, queryString, memorize) => recall(
  `fx-query-run`,
  compileQuery(queryString, memorize),
  [htmlObj],
  `${getHash(queryString)}-${htmlObj.hash}`)

export const compileQuery = (queryString, memorize = true) => {
  ifThrow(
    !isString(queryString),
    'fx-query: queryString is a essential! and need to be a string')
  
  return memorize
    ? memorizeReadQuery(queryString)
    : readQuery(queryString)
}

export const runQuery = (htmlObj, queryString, memorize = true) => {
  throwIfHtmlInvalid(htmlObj)
  html.obj = htmlObj
  ifThrow(
    !isString(queryString),
    'fx-query: queryString is a essential! and need to be a string')
  
  return memorize
    ? memorizeRunQuery(htmlObj, queryString, memorize)
    : compileQuery(queryString, memorize)(htmlObj)
}
