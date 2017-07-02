import { composeDown } from 'pytils'
import { emptyList, _getFirst, removeEmpty, hasTag, hasAttr, hasAttrEq, hasClassEq, getHtml, clearHtml } from './pure'
import { getAttr, getList, flatten, deduplicate, mapListWith, filterListWith, splitListWith } from './pure'

const _get = (what, value) => {
  let process
  switch (what) {
    case 'first':
      return _getFirst
    
    case 'text':
    case 'class':
      process = getAttr(what)
      break

    case 'list':
      process = getList(value)
      break

    case 'dangerouns-html':
      process = getHtml
      break

    case 'html':
      process = composeDown(
        getHtml,
        clearHtml
      )
      break

    case 'attr':
    default:
      process = getAttr(value)
  }
  return mapListWith(process)
}

export const get = (what, value) => composeDown(
  _get(what, value),
  removeEmpty,
  flatten,
  deduplicate
)

const _with = (what, key, value) => {
  let process
  switch (what) {
    case 'tag':
      return hasTag(key)

    case 'attr':
      return value
        ? hasAttrEq(key, value)
        : hasAttr(key)

    case 'class':
      return key
        ? hasClassEq(key)
        : hasAttr('class')

    case 'text':
      return hasAttr('text')

    default:
      return emptyList
  }
}

const _all = (what, key, value) => {
  return filterListWith(
    _with(what, key, value))
}

export const all = (what, key, value) => composeDown(
  _all(what, key, value),
  removeEmpty,
  deduplicate
)

export const getFirst = get('first')

const getChilds = composeDown(
  get('list', 'childs'),
  flatten,
  removeEmpty
)

export const first = (what, key, value) => composeDown(
  all(what, key, value),
  getFirst
)

export const allChilds = (what, key, value) => composeDown(
  getChilds,
  all(what, key, value)
)

export const firstChilds = (what, key, value) => composeDown(
  allChilds(what, key, value),
  getFirst
)

const recursiveBelow = (splitter, list) => {
  const split = splitter(list)
  return split.not.length <= 0
    ? split.with
    : split.with
      .concat(
        recursiveBelow(
          splitter,
          getChilds(split.not)))
}

const _allBelow = (what, key, value) => {
  const splitter = splitListWith(
    _with(what, key, value))
  return list => recursiveBelow(splitter, list)
}

export const allBelow = (what, key, value) => composeDown(
  _allBelow(what, key, value),
  removeEmpty,
  deduplicate
)

export const firstBelow = (what, key, value) => composeDown(
  allBelow(what, key, value),
  getFirst
)
