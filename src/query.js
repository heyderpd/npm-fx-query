import { composeDown, toArray, path } from 'pytils'
import { getFirst, get, all, first, allChilds, firstChilds, allBelow, firstBelow } from './compositions'
import { throwIfHtmlInvalid } from './main'

const spaces = `\\s+`
const anythings = `[\\w\\W]+`
const withKeys = 'all-childs|first-childs|all-below|first-below|all|first'
const onlyKey = `${spaces}(?:\\'(${anythings}?)\\')`
const keyAndValue = `${spaces}(?:\\'(${anythings}?)\\')(?:${spaces}==${spaces}\\'(${anythings})\\')?`
const instructionParse = [
  { type: 'get(onlyType)',      regex: new RegExp(`^get${spaces}(first|text|class|dangerouns-html|html)$`, 'i') },
  { type: 'get(typeAndName)',   regex: new RegExp(`^get${spaces}(list|attr)(?:${spaces}\\'(${anythings})\\')?$`, 'i') },
  { type: 'with(onlyName)',     regex: new RegExp(`^(${withKeys})${spaces}with${spaces}(text|tag|class)(?:${onlyKey})?$`, 'i') },
  { type: 'with(nameAndValue)', regex: new RegExp(`^(${withKeys})${spaces}with${spaces}(attr)(?:${keyAndValue})?$`, 'i') }
]

const instructionErro = instruction => {
  throw `"${instruction}" not is a valid instruction`
}

const queryErro = query => {
  throw `"${query}" not is a valid query`
}

const clearAndSplit = query => {
  if (!query || typeof query !== 'string') {
    queryErro(query)
  }
  query = query
    .replace(/\n\s+\n?/gm, '\n')
    .split('\n')
    .filter(Boolean)
  if (query.length <= 0) {
    queryErro(query)
  }
  return query
}

const getResults = inst => toArray(inst.result).map(n => path(['toLowerCase'], n) && n.toLowerCase())

const createGet = (inst, typeAndName = 'onlyType') => {
  const [ type, name ] = getResults(inst)  
  if (typeAndName === 'onlyType') {
    return createGetOnlyType(inst, type)

  } else {
    !name && instructionErro(inst.instruction)
    return createGetTypeAndName(inst.instruction, type, name)
  }
}

const createGetOnlyType = (instruction, type) => {
  switch (type) {
    case 'first':
    case 'text':
    case 'class':
    case 'html':
    case 'dangerouns-html':
      return get(type)

    default:
      instructionErro(instruction)
  }
}

const createGetTypeAndName = (instruction, type, name) => {
  switch (type) {
    case 'list':
    case 'attr':
      return get(type, name)

    default:
      instructionErro(instruction)
  }
}

const createWith = (inst, nameAndValue = 'onlyName') => {
  const [ action, type, name, value ] = getResults(inst)
  if (!type) {
    instructionErro(inst.instruction)
  }
  if (nameAndValue !== 'onlyName' && !name) {
    instructionErro(inst.instruction)
  }
  switch (action) {
    case 'all':
      return all(type, name, value)

    case 'first':
      return first(type, name, value)
    
    case 'all-childs':
      return allChilds(type, name, value)
    
    case 'first-childs':
      return firstChilds(type, name, value)
    
    case 'all-below':
      return allBelow(type, name, value)
    
    case 'first-below':
      return firstBelow(type, name, value)

    default:
      instructionErro(inst.instruction)
  }
}

const readInstruction = instructionStr => {
  const instruction = instructionParse
    .map(rule => ({
      type: rule.type,
      result: rule.regex.exec(instructionStr),
      instruction: instructionStr
    }))
    .filter(n => n.result)
    .pop()
  switch (instruction && instruction.type) {
    case 'get(onlyType)':
      return createGet(instruction)
    
    case 'get(typeAndName)':
      return createGet(instruction, 'typeAndName')

    case 'with(onlyName)':
      return createWith(instruction)
    
    case 'with(nameAndValue)':
      return createWith(instruction, 'nameAndValue')

    default:
      instructionErro(instructionStr)
  }
}

const queryEngine = compiled => {
  const toAsk = composeDown(...compiled)
  return htmlObj => {
    throwIfHtmlInvalid(htmlObj)
    return toAsk(htmlObj.list)
  }
}

export const readQuery = query => {
  try {
    const compiled = clearAndSplit(query)
      .map(readInstruction)
    return queryEngine(compiled)
  } catch (erro) {
    throw `fx-query: ${erro}`
  }
}
