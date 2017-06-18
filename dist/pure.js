'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitListWith = exports.filterListWith = exports.mapListWith = exports.deduplicate = exports.flatten = exports.getList = exports.getAttr = exports.hasAttr = exports.removeEmpty = exports.filterWith = exports.hasTag = exports._getFirst = exports.nothing = exports.emptyList = undefined;

var _pytils = require('pytils');

var emptyList = exports.emptyList = function emptyList() {
  return [];
};

var nothing = exports.nothing = function nothing() {
  return undefined;
};

var _getFirst = exports._getFirst = function _getFirst(list) {
  return (0, _pytils.isArray)(list) ? list[0] : undefined;
};

var hasTag = exports.hasTag = function hasTag(name) {
  return function (node) {
    return node.tag === name;
  };
};

var filterWith = exports.filterWith = function filterWith(list, With) {
  return list && list.filter ? list.filter(With) : list;
};

var removeEmpty = exports.removeEmpty = function removeEmpty(list) {
  return filterWith(list, Boolean);
};

var hasAttr = exports.hasAttr = function hasAttr(key) {
  var _getAttr = getAttr(key);
  return function (node) {
    return !!_getAttr(node);
  };
};

var getAttr = exports.getAttr = function getAttr(key) {
  switch (key) {
    case 'text':
      return function (node) {
        return node && node.text ? node.text : undefined;
      };

    case 'class':
      return function (node) {
        var Class = (0, _pytils.path)(['attrs', 'class'], node);
        return Class ? Class : undefined;
      };

    default:
      return key ? function (node) {
        return node && node.attrs ? node.attrs[key] : undefined;
      } : nothing;
  }
};

var getList = exports.getList = function getList(direction) {
  return function (node) {
    return node.link && node.link[direction] ? node.link[direction] : [];
  };
};

var flatten = exports.flatten = function flatten(Lists) {
  var flat = [];
  Lists.map(function (list) {
    return flat = flat.concat(list);
  });
  return flat;
};

var deduplicate = exports.deduplicate = function deduplicate(duplicate) {
  if (duplicate && duplicate.length && duplicate[0].uniq >= 0) {
    var uniqs = [];
    var list = [];
    duplicate.map(function (node) {
      if (uniqs.indexOf(node.uniq) < 0) {
        uniqs.push(node.uniq);
        list.push(node);
      }
    });
    return list;
  } else {
    return duplicate;
  }
};

var mapListWith = exports.mapListWith = function mapListWith(process) {
  return function (list) {
    var _list = (0, _pytils.isArray)(list) ? list : [list];
    return _list.map(process);
  };
};

var filterListWith = exports.filterListWith = function filterListWith(process) {
  return function (list) {
    var _list = (0, _pytils.isArray)(list) ? list : [list];
    return _list.filter(process);
  };
};

var splitListWith = exports.splitListWith = function splitListWith(process) {
  return function (list) {
    var _list = (0, _pytils.isArray)(list) ? list : [list];
    var With = [];
    var not = [];
    list.map(function (node) {
      return process(node) ? With.push(node) : not.push(node);
    });
    return {
      with: With,
      not: not
    };
  };
};