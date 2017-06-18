'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.firstBelow = exports.allBelow = exports.firstChilds = exports.allChilds = exports.first = exports.getFirst = exports.all = exports.get = undefined;

var _pytils = require('pytils');

var _pure = require('./pure');

var _get = function _get(what, value) {
  var process = void 0;
  switch (what) {
    case 'list':
      process = (0, _pure.getList)(value);
      break;

    case 'first':
      return _pure._getFirst;

    case 'text':
      process = (0, _pure.getAttr)('text');
      break;

    default:
      process = (0, _pure.getAttr)(value);
  }
  return (0, _pure.mapListWith)(process);
};

var get = exports.get = function get(what, value) {
  return (0, _pytils.composeInv)(_get(what, value), _pure.removeEmpty, _pure.deduplicate);
};

var _all = function _all(what, value) {
  var process = void 0;
  switch (what) {
    case 'tag':
      process = (0, _pure.hasTag)(value);
      break;

    case 'attr':
      process = (0, _pure.hasAttr)(value);
      break;

    case 'text':
      process = (0, _pure.hasAttr)('text');
      break;

    default:
      return _pure.emptyList;
  }
  return (0, _pure.filterListWith)(process);
};

var all = exports.all = function all(what, value) {
  return (0, _pytils.composeInv)(_all(what, value), _pure.removeEmpty, _pure.deduplicate);
};

var getFirst = exports.getFirst = get('first');

var getChilds = (0, _pytils.composeInv)(get('list', 'childs'), _pure.flatten, _pure.removeEmpty);

var first = exports.first = function first(what, value) {
  return (0, _pytils.composeInv)(all(what, value), getFirst);
};

var allChilds = exports.allChilds = function allChilds(what, value) {
  return (0, _pytils.composeInv)(getChilds, all(what, value));
};

var firstChilds = exports.firstChilds = function firstChilds(what, value) {
  return (0, _pytils.composeInv)(getChilds, all(what, value), getFirst);
};

var recursiveBelow = function recursiveBelow(splitter, list) {
  var split = splitter(list);
  return split.not.length <= 0 ? split.with : split.with.concat(recursiveBelow(splitter, getChilds(split.not)));
};

var _allBelow = function _allBelow(what, value) {
  var process = void 0;
  switch (what) {
    case 'tag':
      process = (0, _pure.hasTag)(value);
      break;

    case 'attr':
      process = (0, _pure.hasAttr)(value);
      break;

    case 'text':
      process = (0, _pure.hasAttr)('text');
      break;

    default:
      return _pure.emptyList;
  }
  var splitter = (0, _pure.splitListWith)(process);
  return function (list) {
    return recursiveBelow(splitter, list);
  };
};

var allBelow = exports.allBelow = function allBelow(what, value) {
  return (0, _pytils.composeInv)(_allBelow(what, value), _pure.removeEmpty, _pure.deduplicate);
};

var firstBelow = exports.firstBelow = function firstBelow(what, value) {
  return (0, _pytils.composeInv)(allBelow(what, value), getFirst);
};