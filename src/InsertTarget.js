import React from 'react';
import { DropTarget } from 'react-dnd';
import cx from 'classnames';
export const TYPE = 'TreeNode';

const TreeViewInsertTarget = (
  { insertBefore, canDrop, isDropping, classNames }
) =>
  props.connectDropTarget(
    <div
      className={cx(
        insertBefore
          ? classNames.insertBeforeTarget
          : classNames.insertAfterTarget,
        canDrop && classNames.insertTargetCanDrop,
        isDropping && classNames.insertTargetDropping
      )}
    >
      <div
        className={cx(isDropping && classNames.insertTargetMarkerDropping)}
      />
    </div>
  );

const handleCanDrop = (props, monitor, item) =>
  // block dropping if a prosp.node.noDrop === true
  (!props.parentNode || props.parentNode && !props.parentNode.noDrop) &&
    // cannot drop to self
    !(props.parentNode === item.parentNode &&
      (props.parentChildIndex === item.parentChildIndex ||
        props.parentChildIndex === item.parentChildIndex + 1)) &&
    // you cannot drop on self nodes
    !item.allSourceIDs.includes(props.parentNode ? props.parentNode.id : null);

const handleDrop = (props, monitor, component, item) => {
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

const nodeTarget = {
  drop: (props, monitor, component) => monitor.didDrop()
    ? undefined
    : // some child already handled drop
      handleDrop(props, monitor, component, monitor.getItem()),
  canDrop: (props, monitor) => handleCanDrop(props, monitor, monitor.getItem())
};

const collectNodeDropProps = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  canDrop: monitor.canDrop(),
  isDropping: monitor.isOver({ shallow: true }) && monitor.canDrop()
});

export const DroppedTarget = DropTarget(
  [TYPE],
  nodeTarget,
  collectNodeDropProps
);
export const DroppableTreeViewInsertTarget = DroppedTarget(
  TreeViewInsertTarget
);
