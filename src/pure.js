import { ifThrow, isArray, isString, path } from 'pytils'
import { html } from './main'

export const emptyList = () => []

export const nothing = () => undefined

export const _getFirst = list => isArray(list) ? list[0] : undefined

export const hasTag = name => node => path(['tag'], node) === name

export const filterWith = (list, With) => path(['filter'], list) ? list.filter(With) : list

export const removeEmpty = list => isArray(list) ? filterWith(list, Boolean) : list

export const getAttr = key => {
  switch (key) {
    case 'text':
      return node => path(['text'], node)
    
    case 'class':
      return node => path(['class'], node)
    
    default:
      return key
        ? node => path(['attrs', key], node)
        : nothing
  }
}

export const everyToArray = list => isArray(list) ? list : [ list ]

export const protectArray = fx => list => isArray(list)
  ? list.map(list => fx(list))
  : fx(list)

export const hasAttr = key => {
  const _getAttr = getAttr(key)
  return node => !!_getAttr(node)
}

export const hasAttrEq = (key, value) => {
  const _getAttr = getAttr(key)
  return node => _getAttr(node) === value
}

export const getClass = getAttr('class')

export const hasClassEq = value => node => {
  const Class = getClass(node)
  return path(['indexOf'], Class) ? Class.indexOf(value) >= 0 : false
}

export const getList = direction => node =>
  node.link && node.link[direction] ? node.link[direction] : []

export const flatten = Lists => {
  if (isArray(Lists)) {
    let flat = []
    Lists.map(
      list => flat = flat.concat(list))
    return flat
  } else {
    return Lists
  }
}

export const deduplicate = duplicate => {
  if (duplicate && duplicate.length && duplicate[0].uniq >= 0) {
    const uniqs = []
    const list = []
    duplicate.map(node => {
      if (uniqs.indexOf(node.uniq) < 0) {
        uniqs.push(node.uniq)
        list.push(node)
      }
    })
    return list
  } else {
    return duplicate
  }
}

export const mapListWith = process => list => everyToArray(list).map(process)

export const filterListWith = process => list => everyToArray(list).filter(process)

export const splitListWith = process => list => everyToArray(list)
  .reduce((acc, node) => {
    process(node)
      ? acc.with.push(node)
      : acc.not.push(node)
    return acc
  }, { with: [], not: [] })

export const getHtml = protectArray(node => {
  const start = path(['start'], node)
  const end = path(['end'], node)
  if (start >= 0 && end >= start) {
    const file = path(['obj', 'file'], html)
    if (isString(file)) {
      return file.substr(start, end)
    }
  }
  return node
})

const removeScripts = /<script[\w\W]*?script>/gim

export const clearHtml = protectArray(html => html.replace(removeScripts, ''))
