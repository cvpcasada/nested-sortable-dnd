import cx from 'classnames';
import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { TYPE, DroppedTarget, DroppableTreeViewInsertTarget } from './InsertTarget';

var TreeViewItem = function TreeViewItem(props) {
  var _cx;

  return props.connectDragSource(React.createElement(
    'div',
    {
      className: cx(props.classNames.node, (_cx = {}, _cx[props.classNames.nodeDragging] = props.isDragging, _cx)),
      key: props.node.id
    },
    props.node.children && props.node.children.length === 0 ? React.createElement(DroppableTreeViewItemNode, {
      parentNode: props.node,
      parentChildIndex: 0,
      precedingNode: null,
      onMoveNode: props.onMoveNode,
      renderNode: props.renderNode,
      classNames: props.classNames
    }) : React.createElement(
      'div',
      null,
      props.renderNode(props.node)
    ),
    !props.node.isCollapsed && React.createElement(
      'div',
      { className: props.classNames.nodeChildren },
      props.node.children && props.node.children.length > 0 && React.createElement(TreeViewItemList, {
        parentNode: props.node,
        nodes: props.node.children ? props.node.children : [],
        classNames: props.classNames,
        renderNode: props.renderNode,
        onMoveNode: props.onMoveNode
      })
    )
  ));
};

var DroppableTreeViewItemNode = DroppedTarget(function (props) {
  return props.connectDropTarget(React.createElement(
    'div',
    {
      className: props.classNames && props.isDropping ? props.classNames.insertNodeDropping : null
    },
    props.renderNode(props.parentNode)
  ));
});

// append current node as well as children's node using flatMap
var gatherNodeIDs = function gatherNodeIDs(node) {
  var _ref;

  return [node.id].concat((_ref = []).concat.apply(_ref, (node.children || []).map(gatherNodeIDs)));
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
  },
  canDrag: function canDrag(props, monitor) {
    return !props.node.locked;
  }
};

var collectNodeDragProps = function collectNodeDragProps(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

export var DraggableTreeViewItem = DragSource(TYPE, nodeSource, collectNodeDragProps)(TreeViewItem);

var nodesWithPredecessors = function nodesWithPredecessors(nodes) {
  return nodes.map(function (node) {
    return { node: node, precedingNode: node };
  });
};

// TODO: add a mechanism to apply the CSS equivalent:
// .nodePositioningWrapper:hover {
//   /* otherwise drop targets interfere with drag start */
//   z-index: 2;
// }

export var TreeViewItemList = function TreeViewItemList(props) {
  var withPredecessors = nodesWithPredecessors(props.nodes);
  return React.createElement(
    'div',
    { className: props.classNames.nodeList },
    withPredecessors.map(function (node, index) {
      return React.createElement(
        'div',
        {
          key: node.node.id,
          style: { position: 'relative' },
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
        React.createElement(DraggableTreeViewItem, {
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