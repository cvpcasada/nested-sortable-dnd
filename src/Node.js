import Immutable from "immutable";
import cx from "classnames";
import React, {Component} from "react";
import {DragSource} from "react-dnd";
import {TYPE, DroppedTarget, DroppableTreeViewInsertTarget} from "./InsertTarget";

const TreeViewItem = (props) => (
  props.connectDragSource(
    <div
      className={
        cx(props.classNames.node, {
          [props.classNames.nodeDragging]: props.isDragging,
          [props.classNames.nodeDropping]: props.isDropping
        }) }
      key={ props.node.id }
    >
      <div>
        { props.renderNode(props.node) }
      </div>
      {
        props.node.isCollapsed
          ? null
          :
          <div className={ props.classNames.nodeChildren }>
            { props.node.children
              ? <TreeViewItemList
              parentNode={ props.node }
              nodes={ props.node.children }
              classNames={ props.classNames }
              renderNode={ props.renderNode }
              onMoveNode={ props.onMoveNode }
            />
              : null }
          </div>
      }
    </div>
  )
);

const gatherNodeIDs = (node) =>
  Immutable.Set.of(node.id).union(node.children ? node.children.flatMap(gatherNodeIDs) : Immutable.List()).toSet();

const nodeSource = {
  beginDrag: (props, monitor, component) => ({
    node: props.node,
    allSourceIDs: gatherNodeIDs(props.node),
    parentNode: props.parentNode,
    parentChildIndex: props.parentChildIndex,
    precedingNode: props.precedingNode,
  }),
};

const collectNodeDragProps = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

export const DraggableTreeViewItem = DragSource(TYPE, nodeSource, collectNodeDragProps)(TreeViewItem);

const DroppableTreeViewItem = DroppedTarget((props) => (
  props.connectDropTarget(
    <DraggableTreeViewItem {...props} />
  )
));

const nodesWithPredecessors = (nodes) => {
  return (
    nodes
      .toIndexedSeq()
      .zipWith(
        (node, predecessor) => ({node, precedingNode: predecessor}),
        Immutable.Seq.of(null)
          .concat(nodes)
      )
  )
}


// TODO: add a mechanism to apply the CSS equivalent:
// .nodePositioningWrapper:hover {
//   /* otherwise drop targets interfere with drag start */
//   z-index: 2;
// }

export const TreeViewItemList = (props) => {
  const withPredecessors = nodesWithPredecessors(props.nodes);
  return (
    <div className={ props.classNames.nodeList }>
      {
        withPredecessors.map((node, index) =>
          <div
            key={ node.node.id }
            style={ {position: "relative"} }
            className={ props.classNames.nodePositioningWrapper }
          >
            {
              index === 0
                ? <DroppableTreeViewInsertTarget
                insertBefore={ true }
                parentNode={ props.parentNode }
                parentChildIndex={ index }
                precedingNode={ null }
                onMoveNode={ props.onMoveNode }
              />
                : null
            }

            <DroppableTreeViewInsertTarget
              insertBefore={ false }
              parentNode={ props.parentNode }
              parentChildIndex={ index + 1 }
              precedingNode={ node.node }
              onMoveNode={ props.onMoveNode }
            />
            
            {
              (node.node.children && node.node.children.size === 0) ?
                <DroppableTreeViewItem
                  parentNode={ node.node }
                  parentChildIndex={ index }
                  precedingNode={ null }
                  node={ node.node }
                  classNames={ props.classNames }
                  renderNode={ props.renderNode }
                  onMoveNode={ props.onMoveNode }
                />
                : <DraggableTreeViewItem
                parentNode={ props.parentNode }
                parentChildIndex={ index }
                precedingNode={ node.precedingNode }
                node={ node.node }
                classNames={ props.classNames }
                renderNode={ props.renderNode }
                onMoveNode={ props.onMoveNode }
              />
            }
          </div>
        )
      }
    </div>
  );

};