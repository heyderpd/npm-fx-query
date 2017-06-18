'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readQuery = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _pytils = require('pytils');

var _compositions = require('./compositions');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var instructionParse = [{ type: 'get', regex: /^get[\t ]+(first|list|text|class|attr)(?:[\t ]+\'([\w\W]+)\')?$/i }, { type: 'with', regex: /^(all-childs|first-childs|all-below|first-below|all|first)[\t ]+with[\t ]+(tag|text|class|attr)(?:[\t ]+\'([\w\W]+)\')?$/i }];

var Throw = function Throw(erro) {
  throw 'fx-query: ' + erro;
};

var instructionErro = function instructionErro(instruction) {
  throw 'fx-query: "' + instruction + '" not is a valid instruction';
};

var queryErro = function queryErro(query) {
  throw 'fx-query: "' + query + '" not is a valid query';
};

var clearAndSplit = function clearAndSplit(query) {
  if (!query || typeof query !== 'string') {
    queryErro(query);
  }
  query = query.replace(/\n\s+\n?/gm, '\n').split('\n').filter(function (n) {
    return n;
  });
  if (query.length <= 0) {
    queryErro(query);
  }
  return query;
};

var createGet = function createGet(I) {
  var _I$result = _slicedToArray(I.result, 3),
      _ = _I$result[0],
      action = _I$result[1],
      value = _I$result[2];

  action = action && action.toLowerCase();
  value = value && value.toLowerCase();
  switch (action) {
    case 'first':
      return _compositions.getFirst;

    case 'list':
      return (0, _compositions.get)('list', value);

    case 'text':
    case 'class':
    case 'attr':
      return (0, _compositions.get)(action, value);

    default:
      instructionErro(I.instruction);
  }
};

var createWith = function createWith(I) {
  var _I$result2 = _slicedToArray(I.result, 4),
      _ = _I$result2[0],
      action = _I$result2[1],
      With = _I$result2[2],
      value = _I$result2[3];

  action = action && action.toLowerCase();
  With = With && With.toLowerCase();
  value = value && value.toLowerCase();
  switch (action) {
    case 'all':
      return (0, _compositions.all)(With, value);

    case 'first':
      return (0, _compositions.first)(With, value);

    case 'all-childs':
      return (0, _compositions.allChilds)(With, value);

    case 'first-childs':
      return (0, _compositions.firstChilds)(With, value);

    case 'all-below':
      return (0, _compositions.allBelow)(With, value);

    case 'first-below':
      return (0, _compositions.firstBelow)(With, value);

    default:
      instructionErro(I.instruction);
  }
};

var readInstruction = function readInstruction(instructionStr) {
  var instruction = instructionParse.map(function (r) {
    return {
      type: r.type,
      result: r.regex.exec(instructionStr),
      instruction: instructionStr
    };
  }).filter(function (n) {
    return n.result;
  }).pop();
  switch (instruction && instruction.type) {
    case 'get':
      return createGet(instruction);

    case 'with':
      return createWith(instruction);

    default:
      instructionErro(instructionStr);
  }
};

var readQuery = exports.readQuery = function readQuery(query) {
  try {
    var compiled = clearAndSplit(query).map(readInstruction);
    return _pytils.composeInv.apply(undefined, _toConsumableArray(compiled));
  } catch (erro) {
    Throw(erro);
  }
};