var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Immutable from "immutable";
import cx from "classnames";
import React, { Component } from "react";
import { DragSource } from "react-dnd";
import { TYPE, DroppedTarget, DroppableTreeViewInsertTarget } from "./InsertTarget";

var TreeViewItem = function TreeViewItem(props) {
  var _cx;

  return props.connectDragSource(React.createElement(
    "div",
    {
      className: cx(props.classNames.node, (_cx = {}, _cx[props.classNames.nodeDragging] = props.isDragging, _cx)),
      key: props.node.id
    },
    React.createElement(
      "div",
      null,
      props.renderNode(props.node)
    ),
    props.node.isCollapsed ? null : React.createElement(
      "div",
      { className: props.classNames.nodeChildren },
      props.node.children ? React.createElement(TreeViewItemList, {
        parentNode: props.node,
        nodes: props.node.children,
        classNames: props.classNames,
        renderNode: props.renderNode,
        onMoveNode: props.onMoveNode
      }) : null
    )
  ));
};

var gatherNodeIDs = function gatherNodeIDs(node) {
  return Immutable.Set.of(node.id).union(node.children ? node.children.flatMap(gatherNodeIDs) : Immutable.List()).toSet();
};

var nodeSource = {
  beginDrag: function beginDrag(props, monitor, component) {
    return {
      node: props.node,
      allSourceIDs: gatherNodeIDs(props.node),
      parentNode: props.parentNode,
      parentChildIndex: props.parentChildIndex,
      precedingNode: props.precedingNode
    };
  }
};

var collectNodeDragProps = function collectNodeDragProps(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

export var DraggableTreeViewItem = DragSource(TYPE, nodeSource, collectNodeDragProps)(TreeViewItem);

var DroppableTreeViewItem = DroppedTarget(function (props) {
  return props.connectDropTarget(React.createElement(
    "div",
    { className: props.classNames && props.isDropping ? props.classNames.insertNodeDropping : null },
    React.createElement(DraggableTreeViewItem, _extends({}, props.nodeOptions, { classNames: props.classNames, onMoveNode: props.onMoveNode }))
  ));
});

var nodesWithPredecessors = function nodesWithPredecessors(nodes) {
  return nodes.toIndexedSeq().zipWith(function (node, predecessor) {
    return { node: node, precedingNode: predecessor };
  }, Immutable.Seq.of(null).concat(nodes));
};

// TODO: add a mechanism to apply the CSS equivalent:
// .nodePositioningWrapper:hover {
//   /* otherwise drop targets interfere with drag start */
//   z-index: 2;
// }

export var TreeViewItemList = function TreeViewItemList(props) {
  var withPredecessors = nodesWithPredecessors(props.nodes);
  return React.createElement(
    "div",
    { className: props.classNames.nodeList },
    withPredecessors.map(function (node, index) {
      return React.createElement(
        "div",
        {
          key: node.node.id,
          style: { position: "relative" },
          className: props.classNames.nodePositioningWrapper
        },
        index === 0 ? React.createElement(DroppableTreeViewInsertTarget, {
          classNames: props.classNames,
          insertBefore: true,
          parentNode: props.parentNode,
          parentChildIndex: index,
          precedingNode: null,
          onMoveNode: props.onMoveNode
        }) : null,
        React.createElement(DroppableTreeViewInsertTarget, {
          classNames: props.classNames,
          insertBefore: false,
          parentNode: props.parentNode,
          parentChildIndex: index + 1,
          precedingNode: node.node,
          onMoveNode: props.onMoveNode
        }),
        node.node.children && node.node.children.size === 0 ? React.createElement(DroppableTreeViewItem, {
          parentNode: node.node,
          parentChildIndex: index + 1,
          precedingNode: null,
          onMoveNode: props.onMoveNode,
          classNames: props.classNames,
          nodeOptions: {
            parentNode: props.parentNode,
            parentChildIndex: index,
            precedingNode: node.precedingNode,
            node: node.node,
            renderNode: props.renderNode
          }

        }) : React.createElement(DraggableTreeViewItem, {
          parentNode: props.parentNode,
          parentChildIndex: index,
          precedingNode: node.precedingNode,
          node: node.node,
          classNames: props.classNames,
          renderNode: props.renderNode,
          onMoveNode: props.onMoveNode
        })
      );
    })
  );
};