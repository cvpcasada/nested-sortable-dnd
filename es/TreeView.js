function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import { TreeViewItemList } from './Node';

var TreeView = function TreeView(_ref) {
  var _ref$classNames = _ref.classNames,
      classNames = _ref$classNames === undefined ? {} : _ref$classNames,
      props = _objectWithoutProperties(_ref, ['classNames']);

  return React.createElement(
    'div',
    { className: classNames.treeView },
    React.createElement(TreeViewItemList, {
      lock: props.lock,
      parentNode: null,
      nodes: props.rootNodes,
      renderNode: props.renderNode,
      classNames: classNames,
      onMoveNode: props.onMoveNode
    })
  );
};

export default TreeView;