# fx-query
Make queries in html returned by [html-parse-regex](https://www.npmjs.com/package/html-parse-regex)

## I will help if you have any difficulty =)
Contact me by [github:heyderpd](https://github.com/heyderpd). I'll be glad to help you.

## Thanks for [npm~lucasmreis](https://www.npmjs.com/~lucasmreis)

## Important!!! Both functions are already using memorize [dejavu-call](https://www.npmjs.com/package/dejavu-call), so repeated queries will not worsen performance.


## To run query directly
Example:
```javascript
import parse from 'html-parse-regex'
import { runQuery } from 'fx-query'

const queryString = `
  all with tag 'a'
  get attr 'href'`
const html = parse(htmlString)
const links = runQuery(html, queryString) // [ www.aaa.com, www.bbb.com ]
```

## If need compile the query and execute in many files. 
Example:
```javascript
import parse from 'html-parse-regex'
import { compileQuery } from 'fx-query'

const getAllLinks = compileQuery(`
  all with tag 'a'
  get attr 'href'`)
const htmlA = parse(htmlStringA)
const htmlB = parse(htmlStringB)
const links = getAllLinks(htmlA) // [ www.aaa.com, www.bbb.com ]
const links = getAllLinks(htmlB) // [ www.ccc.com, www.ddd.com ]
```
