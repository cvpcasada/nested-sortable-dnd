'use strict';

exports.__esModule = true;
exports.TreeViewItemList = exports.DraggableTreeViewItem = undefined;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDnd = require('react-dnd');

var _InsertTarget = require('./InsertTarget');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TreeViewItem = function TreeViewItem(props) {
  var _cx;

  return props.connectDragSource(_react2.default.createElement(
    'div',
    {
      className: (0, _classnames2.default)(props.classNames.node, (_cx = {}, _cx[props.classNames.nodeDragging] = props.isDragging, _cx)),
      key: props.node.id
    },
    props.node.children && props.node.children.length === 0 ? _react2.default.createElement(DroppableTreeViewItemNode, {
      parentNode: props.node,
      parentChildIndex: 0,
      precedingNode: null,
      onMoveNode: props.onMoveNode,
      renderNode: props.renderNode,
      classNames: props.classNames
    }) : _react2.default.createElement(
      'div',
      null,
      props.renderNode(props.node)
    ),
    !props.node.isCollapsed && _react2.default.createElement(
      'div',
      { className: props.classNames.nodeChildren },
      props.node.children && props.node.children.length > 0 && _react2.default.createElement(TreeViewItemList, {
        parentNode: props.node,
        nodes: props.node.children ? props.node.children : [],
        classNames: props.classNames,
        renderNode: props.renderNode,
        onMoveNode: props.onMoveNode
      })
    )
  ));
};

var DroppableTreeViewItemNode = (0, _InsertTarget.DroppedTarget)(function (props) {
  return props.connectDropTarget(_react2.default.createElement(
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

var DraggableTreeViewItem = exports.DraggableTreeViewItem = (0, _reactDnd.DragSource)(_InsertTarget.TYPE, nodeSource, collectNodeDragProps)(TreeViewItem);

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

var TreeViewItemList = exports.TreeViewItemList = function TreeViewItemList(props) {
  var withPredecessors = nodesWithPredecessors(props.nodes);
  return _react2.default.createElement(
    'div',
    { className: props.classNames.nodeList },
    withPredecessors.map(function (node, index) {
      return _react2.default.createElement(
        'div',
        {
          key: node.node.id,
          style: { position: 'relative' },
          className: props.classNames.nodePositioningWrapper
        },
        index === 0 ? _react2.default.createElement(_InsertTarget.DroppableTreeViewInsertTarget, {
          classNames: props.classNames,
          insertBefore: true,
          parentNode: props.parentNode,
          parentChildIndex: index,
          precedingNode: null,
          onMoveNode: props.onMoveNode
        }) : null,
        _react2.default.createElement(_InsertTarget.DroppableTreeViewInsertTarget, {
          classNames: props.classNames,
          insertBefore: false,
          parentNode: props.parentNode,
          parentChildIndex: index + 1,
          precedingNode: node.node,
          onMoveNode: props.onMoveNode
        }),
        _react2.default.createElement(DraggableTreeViewItem, {
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