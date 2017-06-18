'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runQuery = exports.compileQuery = undefined;

var _htmlParseRegex = require('html-parse-regex');

var _dejavuCall = require('dejavu-call');

var _pytils = require('pytils');

var _query = require('./query');

var throwIfHtmlInvalid = (0, _htmlParseRegex.validHtml)('fx-query');

var memorizeReadQuery = function memorizeReadQuery(queryString) {
  return (0, _dejavuCall.recall)('fx-query-compile', _query.readQuery, [queryString]);
};

var memorizeRunQuery = function memorizeRunQuery(htmlObj, queryString, memorize) {
  return (0, _dejavuCall.recall)('fx-query-run', compileQuery(queryString, memorize), [htmlObj.list], (0, _dejavuCall.getHash)(queryString) + '-' + htmlObj.hash);
};

var compileQuery = exports.compileQuery = function compileQuery(queryString) {
  var memorize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  (0, _pytils.ifThrow)(!(0, _pytils.isString)(queryString), 'fx-query: queryString is a essential! and need to be a string');

  return memorize ? memorizeReadQuery(queryString) : (0, _query.readQuery)(queryString);
};

var runQuery = exports.runQuery = function runQuery(htmlObj, queryString) {
  var memorize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  throwIfHtmlInvalid(htmlObj);
  (0, _pytils.ifThrow)(!(0, _pytils.isString)(queryString), 'fx-query: queryString is a essential! and need to be a string');

  return memorize ? memorizeRunQuery(htmlObj, queryString, memorize) : compileQuery(queryString, memorize)(htmlObj.list);
};