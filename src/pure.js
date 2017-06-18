import { ifThrow, isArray, isString, path } from 'pytils'

export const emptyList = () => []

export const nothing = () => undefined

export const _getFirst = list => isArray(list) ? list[0] : undefined

export const hasTag = name => node => node.tag === name

export const filterWith = (list, With) => list && list.filter ? list.filter(With) : list

export const removeEmpty = list => filterWith(list, Boolean)

export const hasAttr = key => {
  const _getAttr = getAttr(key)
  return node => !!_getAttr(node)
}

export const getAttr = key => {
  switch (key) {
    case 'text':
      return node => node && node.text ? node.text : undefined
    
    case 'class':
      return node => {
        const Class = path(['attrs', 'class'], node)
        return Class ? Class : undefined
      }
    
    default:
      return key
        ? node => node && node.attrs ? node.attrs[key] : undefined
        : nothing
  }
}

export const getList = direction => node =>
  node.link && node.link[direction] ? node.link[direction] : []

export const flatten = Lists => {
  let flat = []
  Lists.map(list => flat = flat.concat(list))
  return flat
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

export const mapListWith = process => list => {
  const _list = isArray(list) ? list : [list]
  return _list.map(process)
}

export const filterListWith = process => list => {
  const _list = isArray(list) ? list : [list]
  return _list.filter(process)
}

export const splitListWith = process => list => {
  const _list = isArray(list) ? list : [list]
  const With = []
  const not = []
  list.map(
    node => process(node)
      ? With.push(node)
      : not.push(node))
  return {
    with: With,
    not: not
  }
}
