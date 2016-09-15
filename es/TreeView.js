function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from "react";
import { TreeViewItemList } from "./Node";

var TreeView = function TreeView(_ref) {
  var _ref$allowInsertToNod = _ref.allowInsertToNode;
  var allowInsertToNode = _ref$allowInsertToNod === undefined ? true : _ref$allowInsertToNod;

  var props = _objectWithoutProperties(_ref, ["allowInsertToNode"]);

  return React.createElement(
    "div",
    { className: props.classNames.treeView },
    React.createElement(TreeViewItemList, {
      lock: props.lock,
      parentNode: null,
      nodes: props.rootNodes,
      renderNode: props.renderNode,
      classNames: props.classNames,
      onMoveNode: props.onMoveNode,
      allowInsertToNode: allowInsertToNode
    })
  );
};

export default TreeView;