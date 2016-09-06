"use strict";

exports.__esModule = true;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Node = require("./Node");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TreeView = function TreeView(props) {
  return _react2.default.createElement(
    "div",
    { className: props.classNames.treeView },
    _react2.default.createElement(_Node.TreeViewItemList, {
      parentNode: null,
      nodes: props.rootNodes,
      renderNode: props.renderNode,
      classNames: props.classNames,
      onMoveNode: props.onMoveNode
    })
  );
};

exports.default = TreeView;
module.exports = exports["default"];