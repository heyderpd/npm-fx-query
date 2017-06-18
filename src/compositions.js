import { composeInv as compose } from 'pytils'
import { emptyList, _getFirst, removeEmpty, hasTag, hasAttr, getAttr, getList, flatten, deduplicate, mapListWith, filterListWith, splitListWith } from './pure'

const _get = (what, value) => {
  let process
  switch (what) {
    case 'list':
      process = getList(value)
      break
    
    case 'first':
      return _getFirst
    
    case 'text':
      process = getAttr('text')
      break

    default:
      process = getAttr(value)
  }
  return mapListWith(process)
}

export const get = (what, value) => compose(
  _get(what, value),
  removeEmpty,
  deduplicate
)

const _all = (what, value) => {
  let process
  switch (what) {
    case 'tag':
      process = hasTag(value)
      break
    
    case 'attr':
      process = hasAttr(value)
      break
    
    case 'text':
      process = hasAttr('text')
      break

    default:
      return emptyList
  }
  return filterListWith(process)
}

export const all = (what, value) => compose(
  _all(what, value),
  removeEmpty,
  deduplicate
)

export const getFirst = get('first')

const getChilds = compose(
  get('list', 'childs'),
  flatten,
  removeEmpty
)

export const first = (what, value) => compose(
  all(what, value),
  getFirst
)

export const allChilds = (what, value) => compose(
  getChilds,
  all(what, value)
)

export const firstChilds = (what, value) => compose(
  getChilds,
  all(what, value),
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

const _allBelow = (what, value) => {
  let process
  switch (what) {
    case 'tag':
      process = hasTag(value)
      break
    
    case 'attr':
      process = hasAttr(value)
      break
    
    case 'text':
      process = hasAttr('text')
      break

    default:
      return emptyList
  }
  const splitter = splitListWith(process)
  return list => recursiveBelow(splitter, list)
}

export const allBelow = (what, value) => compose(
  _allBelow(what, value),
  removeEmpty,
  deduplicate
)

export const firstBelow = (what, value) => compose(
  allBelow(what, value),
  getFirst
)
