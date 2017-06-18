import { composeInv as compose } from 'pytils'
import { getFirst, get, all, first, allChilds, firstChilds, allBelow, firstBelow } from './compositions'

const instructionParse = [
  { type: 'get', regex: /^get[\t ]+(first|list|text|class|attr)(?:[\t ]+\'([\w\W]+)\')?$/i },
  { type: 'with', regex: /^(all-childs|first-childs|all-below|first-below|all|first)[\t ]+with[\t ]+(tag|text|class|attr)(?:[\t ]+\'([\w\W]+)\')?$/i }
]

const Throw = erro => {
  throw `fx-query: ${erro}`
}

const instructionErro = instruction => {
  throw `fx-query: "${instruction}" not is a valid instruction`
}

const queryErro = query => {
  throw `fx-query: "${query}" not is a valid query`
}

const clearAndSplit = query => {
  if (!query || typeof query !== 'string') {
    queryErro(query)
  }
  query = query
    .replace(/\n\s+\n?/gm, '\n')
    .split('\n')
    .filter(n => n)
  if (query.length <= 0) {
    queryErro(query)
  }
  return query
}

const createGet = I => {
  let [ _, action, value ] = I.result
  action = action && action.toLowerCase()
  value = value && value.toLowerCase()
  switch (action) {
    case 'first':
      return getFirst

    case 'list':
      return get('list', value)

    case 'text':
    case 'class':
    case 'attr':
      return get(action, value)

    default:
      instructionErro(I.instruction)
  }
}

const createWith = I => {
  let  [ _, action, With, value ] = I.result
  action = action && action.toLowerCase()
  With = With && With.toLowerCase()
  value = value && value.toLowerCase()
  switch (action) {
    case 'all':
      return all(With, value)

    case 'first':
      return first(With, value)
    
    case 'all-childs':
      return allChilds(With, value)
    
    case 'first-childs':
      return firstChilds(With, value)
    
    case 'all-below':
      return allBelow(With, value)
    
    case 'first-below':
      return firstBelow(With, value)

    default:
      instructionErro(I.instruction)
  }
}

const readInstruction = instructionStr => {
  const instruction = instructionParse
    .map(r => ({
      type: r.type,
      result: r.regex.exec(instructionStr),
      instruction: instructionStr
    }))
    .filter(n => n.result)
    .pop()
  switch (instruction && instruction.type) {
    case 'get':
      return createGet(instruction)

    case 'with':
      return createWith(instruction)

    default:
      instructionErro(instructionStr)
  }
}

export const readQuery = query => {
  try {
    const compiled = clearAndSplit(query)
      .map(readInstruction)
    return compose(...compiled)
  } catch (erro) {
    Throw(erro)
  }
}
