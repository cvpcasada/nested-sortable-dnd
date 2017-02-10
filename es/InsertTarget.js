import React from "react";
import { DropTarget } from "react-dnd";
import Styles from "./Styles";

export var TYPE = 'TreeNode';

var targetPosition = function targetPosition(props) {
  return props.insertBefore ? Styles.insertBeforeTarget : Styles.insertAfterTarget;
};

var emptyNodeChildren = function emptyNodeChildren(props) {
  if (props.emptyNodeChildrenPosition === 'Left') {
    return Styles.emptyNodeChildrenLeft;
  } else {
    return Styles.emptyNodeChildrenRight;
  }
};

var TreeViewInsertTarget = function TreeViewInsertTarget(props) {
  return props.connectDropTarget(React.createElement(
    "div",
    {
      style: Object.assign({}, props.insertBefore ? Styles.insertBeforeTarget : Styles.insertAfterTarget, props.canDrop ? Styles.insertTargetCanDrop : {}, props.isDropping ? Styles.insertTargetDropping : {})
    },
    React.createElement("div", { style: props.isDropping ? Styles.insertTargetMarkerDropping : {} })
  ));
};

var handleCanDrop = function handleCanDrop(props, monitor, item) {
  return (
    // block dropping if a prosp.node.noDrop === true
    (!props.parentNode || props.parentNode && !props.parentNode.noDrop) &&

    // cannot drop to self
    !(props.parentNode === item.parentNode && (props.parentChildIndex === item.parentChildIndex || props.parentChildIndex === item.parentChildIndex + 1)) &&

    // you cannot drop on self nodes
    !item.allSourceIDs.includes(props.parentNode ? props.parentNode.id : null)
  );
};

var handleDrop = function handleDrop(props, monitor, component, item) {
  props.onMoveNode({
    oldParentNode: item.parentNode,
    oldParentChildIndex: item.parentChildIndex,
    oldPrecedingNode: item.precedingNode,
    node: item.node,
    newParentNode: props.parentNode,
    newParentChildIndex: props.parentChildIndex,
    newPrecedingNode: props.precedingNode
  });

  return {
    parentNode: props.parentNode,
    parentChildIndex: props.parentChildIndex
  };
};

var nodeTarget = {
  drop: function drop(props, monitor, component) {
    return monitor.didDrop() ? undefined // some child already handled drop
    : handleDrop(props, monitor, component, monitor.getItem());
  },
  canDrop: function canDrop(props, monitor) {
    return handleCanDrop(props, monitor, monitor.getItem());
  }
};

var collectNodeDropProps = function collectNodeDropProps(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isDropping: monitor.isOver({ shallow: true }) && monitor.canDrop()
  };
};

export var DroppedTarget = DropTarget([TYPE], nodeTarget, collectNodeDropProps);
export var DroppableTreeViewInsertTarget = DroppedTarget(TreeViewInsertTarget);