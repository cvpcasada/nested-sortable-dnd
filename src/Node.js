import cx from 'classnames';
import React from 'react';
import { DragSource } from 'react-dnd';
import {
  TYPE,
  DroppedTarget,
  DroppableTreeViewInsertTarget,
} from './InsertTarget';

class TreeViewItem extends React.Component {
  render() {
    const { connectDragSource, ...props } = this.props;

    return (
      connectDragSource &&
      connectDragSource(
        <div
          className={cx(props.classNames.node || 'node', {
            [props.classNames.nodeDragging || 'nodeDragging']: props.isDragging,
          })}
          key={props.node.id}
        >
          {props.node.children ? (
            <DroppableTreeViewItemNode
              parentNode={props.node}
              parentChildIndex={0}
              precedingNode={null}
              onMoveNode={props.onMoveNode}
              renderNode={props.renderNode}
              classNames={props.classNames}
            />
          ) : (
            <div>{props.renderNode(props.node)}</div>
          )}

          {!props.node.isCollapsed && (
            <div className={props.classNames.nodeChildren}>
              {props.node.children &&
                props.node.children.length > 0 && (
                  <TreeViewItemList
                    parentNode={props.node}
                    nodes={props.node.children ? props.node.children : []}
                    classNames={props.classNames}
                    renderNode={props.renderNode}
                    onMoveNode={props.onMoveNode}
                  />
                )}
            </div>
          )}
        </div>
      )
    );
  }
}

const DroppableTreeViewItemNode = DroppedTarget(
  class extends React.Component {
    render() {
      const props = this.props;
      return props.connectDropTarget(
        <div
          className={
            props.classNames && props.isDropping
              ? props.classNames.insertNodeDropping
              : null
          }
        >
          {props.renderNode(props.parentNode)}
        </div>
      );
    }
  }
);

// append current node as well as children's node using flatMap
const gatherNodeIDs = node => [
  node.id,
  ...[].concat(...(node.children || []).map(gatherNodeIDs)),
];

const nodeSource = {
  beginDrag: (props, monitor, component) => ({
    node: props.node,
    allSourceIDs: gatherNodeIDs(props.node),
    parentNode: props.parentNode,
    parentChildIndex: props.parentChildIndex,
    precedingNode: props.precedingNode,
  }),
  canDrag: (props, monitor) => !props.node.locked,
};

const collectNodeDragProps = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

export const DraggableTreeViewItem = DragSource(
  TYPE,
  nodeSource,
  collectNodeDragProps
)(TreeViewItem);

const nodesWithPredecessors = nodes => {
  return nodes.map(node => ({ node, precedingNode: node }));
};

// TODO: add a mechanism to apply the CSS equivalent:
// .nodePositioningWrapper:hover {
//   /* otherwise drop targets interfere with drag start */
//   z-index: 2;
// }

export function TreeViewItemList(props) {
  const withPredecessors = nodesWithPredecessors(props.nodes);
  return (
    <div className={props.classNames.nodeList}>
      {withPredecessors.map((node, index) => (
        <div
          key={node.node.id}
          style={{ position: 'relative' }}
          className={props.classNames.nodePositioningWrapper}
        >
          <DroppableTreeViewInsertTarget
            classNames={props.classNames}
            insertBefore={true}
            parentNode={props.parentNode}
            parentChildIndex={index}
            precedingNode={null}
            onMoveNode={props.onMoveNode}
          />

          {index === withPredecessors.length - 1 ? (
            <DroppableTreeViewInsertTarget
              classNames={props.classNames}
              insertBefore={false}
              parentNode={props.parentNode}
              parentChildIndex={index + 1}
              precedingNode={node.node}
              onMoveNode={props.onMoveNode}
            />
          ) : null}

          <DraggableTreeViewItem
            parentNode={props.parentNode}
            parentChildIndex={index}
            precedingNode={node.precedingNode}
            node={node.node}
            classNames={props.classNames}
            renderNode={props.renderNode}
            onMoveNode={props.onMoveNode}
          />
        </div>
      ))}
    </div>
  );
}
