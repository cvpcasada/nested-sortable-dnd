"use strict";

exports.__esModule = true;
exports.DroppableTreeViewInsertTarget = exports.DroppedTarget = exports.TYPE = undefined;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDnd = require("react-dnd");

var _Styles = require("./Styles");

var _Styles2 = _interopRequireDefault(_Styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TYPE = exports.TYPE = "TreeNode";

var TreeViewInsertTarget = function TreeViewInsertTarget(props) {
  return props.connectDropTarget(_react2.default.createElement(
    "div",
    {
      style: Object.assign({}, props.insertBefore ? _Styles2.default.insertBeforeTarget : _Styles2.default.insertAfterTarget, props.canDrop ? _Styles2.default.insertTargetCanDrop : {}, props.isDropping ? _Styles2.default.insertTargetDropping : {})
    },
    _react2.default.createElement("div", {
      className: props.isDropping && props.classNames && props.classNames.insertTargetMarkerDropping,
      style: props.isDropping ? _Styles2.default.insertTargetMarkerDropping : {}
    })
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
    return monitor.didDrop() ? undefined : // some child already handled drop
    handleDrop(props, monitor, component, monitor.getItem());
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

var DroppedTarget = exports.DroppedTarget = (0, _reactDnd.DropTarget)([TYPE], nodeTarget, collectNodeDropProps);
var DroppableTreeViewInsertTarget = exports.DroppableTreeViewInsertTarget = DroppedTarget(TreeViewInsertTarget);