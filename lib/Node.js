"use strict";

exports.__esModule = true;
exports.TreeViewItemList = exports.DraggableTreeViewItem = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _immutable = require("immutable");

var _immutable2 = _interopRequireDefault(_immutable);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDnd = require("react-dnd");

var _InsertTarget = require("./InsertTarget");

var _Styles = require("./Styles");

var _Styles2 = _interopRequireDefault(_Styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TreeViewItem = function TreeViewItem(props) {
  var _cx;

  return props.connectDragSource(_react2.default.createElement(
    "div",
    {
      className: (0, _classnames2.default)(props.classNames.node, (_cx = {}, _cx[props.classNames.nodeDragging] = props.isDragging, _cx)),
      key: props.node.id
    },
    _react2.default.createElement(
      "div",
      null,
      props.renderNode(props.node)
    ),
    props.node.isCollapsed ? null : _react2.default.createElement(
      "div",
      { className: props.classNames.nodeChildren },
      props.node.children ? _react2.default.createElement(TreeViewItemList, {
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
  return _immutable2.default.Set.of(node.id).union(node.children ? node.children.flatMap(gatherNodeIDs) : _immutable2.default.List()).toSet();
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

var DraggableTreeViewItem = exports.DraggableTreeViewItem = (0, _reactDnd.DragSource)(_InsertTarget.TYPE, nodeSource, collectNodeDragProps)(TreeViewItem);

var nodesWithPredecessors = function nodesWithPredecessors(nodes) {
  return nodes.toIndexedSeq().zipWith(function (node, predecessor) {
    return { node: node, precedingNode: predecessor };
  }, _immutable2.default.Seq.of(null).concat(nodes));
};

// TODO: add a mechanism to apply the CSS equivalent:
// .nodePositioningWrapper:hover {
//   /* otherwise drop targets interfere with drag start */
//   z-index: 2;
// }

var TreeViewItemList = exports.TreeViewItemList = function TreeViewItemList(props) {
  //console.log({nodes: props.nodes});
  var withPredecessors = nodesWithPredecessors(props.nodes);
  return _react2.default.createElement(
    "div",
    { className: props.classNames.nodeList },
    withPredecessors.map(function (node, index) {
      return _react2.default.createElement(
        "div",
        {
          key: node.node.id,
          style: { position: "relative" },
          className: props.classNames.nodePositioningWrapper
        },
        index === 0 ? _react2.default.createElement(_InsertTarget.DroppableTreeViewInsertTarget, {
          insertBefore: true,
          parentNode: props.parentNode,
          parentChildIndex: index,
          precedingNode: null,
          onMoveNode: props.onMoveNode
        }) : null,
        node.node.children && node.node.children.size === 0 ? _react2.default.createElement(
          "div",
          { style: _extends({}, _Styles2.default.insertAfterTarget, {
              background: 'none',
              display: 'flex',
              flexDirection: 'row'
            }) },
          _react2.default.createElement(_InsertTarget.DroppableTreeViewInsertTarget, {
            emptyNodeChildrenPosition: "Left",
            parentNode: props.parentNode,
            parentChildIndex: index + 1,
            precedingNode: node.node,
            onMoveNode: props.onMoveNode
          }),
          _react2.default.createElement(_InsertTarget.DroppableTreeViewInsertTarget, {
            emptyNodeChildrenPosition: "Right",
            parentNode: node.node,
            parentChildIndex: index + 1,
            precedingNode: null,
            onMoveNode: props.onMoveNode
          })
        ) : _react2.default.createElement(_InsertTarget.DroppableTreeViewInsertTarget, {
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