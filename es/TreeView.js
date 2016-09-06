import React from "react";
import { TreeViewItemList } from "./Node";

var TreeView = function TreeView(props) {
  return React.createElement(
    "div",
    { className: props.classNames.treeView },
    React.createElement(TreeViewItemList, {
      parentNode: null,
      nodes: props.rootNodes,
      renderNode: props.renderNode,
      classNames: props.classNames,
      onMoveNode: props.onMoveNode
    })
  );
};

export default TreeView;