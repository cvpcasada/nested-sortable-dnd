'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Node = require('./Node');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var TreeView = function TreeView(_ref) {
  var _ref$classNames = _ref.classNames,
      classNames = _ref$classNames === undefined ? {} : _ref$classNames,
      props = _objectWithoutProperties(_ref, ['classNames']);

  return _react2.default.createElement(
    'div',
    { className: classNames.treeView },
    _react2.default.createElement(_Node.TreeViewItemList, {
      lock: props.lock,
      parentNode: null,
      nodes: props.rootNodes,
      renderNode: props.renderNode,
      classNames: classNames,
      onMoveNode: props.onMoveNode
    })
  );
};

exports.default = TreeView;
module.exports = exports['default'];