"use strict";

exports.__esModule = true;
exports.DebugStyles = exports.NormalStyles = undefined;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NormalStyles = exports.NormalStyles = {
  insertTarget: {
    boxSizing: "border-box",
    width: "100%",
    height: "1em",
    position: "absolute",
    zIndex: 1,
    display: "none"
  },

  insertBeforeTarget: {
    top: "-0.5em"
  },

  insertAfterTarget: {
    bottom: "-0.5em"
  },

  insertTargetCanDrop: {
    display: "flex"
  },

  insertTargetDropping: {},

  insertTargetMarkerDropping: {
    boxSizing: "border-box",
    width: "100%",
    height: "4px",
    background: "#B4B4B4",
    alignSelf: "center"
  }
};

var DebugStyles = exports.DebugStyles = {
  insertTarget: {
    opacity: 0.5
  },

  insertTargetCanDrop: {},

  insertTargetDropping: {
    opacity: 0.9
  },

  insertBeforeTarget: {
    backgroundColor: "#ffffdd"
  },

  insertAfterTarget: {
    backgroundColor: "#ffddff"
  }
};

var isDebug = false;

exports.default = {
  insertBeforeTarget: Object.assign({}, NormalStyles.insertTarget, NormalStyles.insertBeforeTarget, isDebug ? DebugStyles.insertTarget : {}, isDebug ? DebugStyles.insertBeforeTarget : {}),

  insertAfterTarget: Object.assign({}, NormalStyles.insertTarget, NormalStyles.insertAfterTarget, isDebug ? DebugStyles.insertTarget : {}, isDebug ? DebugStyles.insertAfterTarget : {}),

  insertTargetCanDrop: Object.assign({}, NormalStyles.insertTargetCanDrop, isDebug ? DebugStyles.insertTargetCanDrop : {}),

  insertTargetDropping: Object.assign({}, NormalStyles.insertTargetDropping, isDebug ? DebugStyles.insertTargetDropping : {}),

  insertTargetMarkerDropping: NormalStyles.insertTargetMarkerDropping,

  emptyNodeChildrenLeft: {
    boxSizing: "border-box",
    width: "4em"
  },

  emptyNodeChildrenRight: {
    boxSizing: "border-box",
    width: "calc(100% - 2em)"
  }
};