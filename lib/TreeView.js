'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Node = require('./Node');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TreeView = function (_React$Component) {
  _inherits(TreeView, _React$Component);

  function TreeView() {
    _classCallCheck(this, TreeView);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  TreeView.prototype.render = function render() {
    var _props = this.props,
        classNames = _props.classNames,
        props = _objectWithoutProperties(_props, ['classNames']);

    return _react2.default.createElement(
      'div',
      { className: classNames.treeView },
      _react2.default.createElement(_Node.TreeViewItemList, {
        lock: props.lock,
        parentNode: null,
        nodes: props.rootNodes,
        renderNode: props.renderNode,
        classNames: classNames,
        onMoveNode: props.onMoveNode
      })
    );
  };

  return TreeView;
}(_react2.default.Component);

exports.default = TreeView;
module.exports = exports['default'];