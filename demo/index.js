import React, { Component } from "react";
import { render } from "react-dom";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import TreeView from "../dist/nested-dnd.es.js";

import styles from "./styles.css";

const recursivelyUpdateNode = (node, listUpdateFunc, nodeUpdateFunc) => {
  const updateChildren = node.children
    ? recursivelyUpdateList(node.children, node, listUpdateFunc, nodeUpdateFunc)
    : node.children;

  if (updateChildren !== node.children) {
    node = {
      ...node,
      children: updateChildren
    };
  }
  return nodeUpdateFunc(node);
};

const recursivelyUpdateList = (
  list,
  parentNode,
  listUpdateFunc,
  nodeUpdateFunc
) => {
  const mappedItems = list.map(item =>
    recursivelyUpdateNode(item, listUpdateFunc, nodeUpdateFunc)
  );

  if (!mappedItems.every((item, index) => Object.is(item, list[index]))) {
    list = list.map(item =>
      recursivelyUpdateNode(item, listUpdateFunc, nodeUpdateFunc)
    );
  }

  return listUpdateFunc(list, parentNode);
};

export class App extends Component {
  state = {
    rootNodes: [
      {
        id: "A",
        title: "A",
        children: [],
        noDrop: false, // items cannot be dropped into this
        locked: true // you cannot drag this item.
      },
      {
        id: "B",
        title: "B",
        children: [
          {
            id: "B1",
            title: "B1"
          },
          {
            id: "B2",
            title: "B2"
          }
        ]
      },
      {
        id: "C",
        title: "C",
        children: [
          {
            id: "C1",
            title: "C1",
            children: []
          }
        ]
      }
    ]
  };

  handleMoveNode = args => {
    this.setState(state => ({
      rootNodes: recursivelyUpdateList(
        state.rootNodes,
        null,
        (list, parentNode) => {
          return parentNode === args.newParentNode &&
            parentNode === args.oldParentNode
            ? remove(
                args.oldParentChildIndex +
                  (args.newParentChildIndex < args.oldParentChildIndex ? 1 : 0)
              )(insert(args.newParentChildIndex, args.node)(list))
            : parentNode === args.newParentNode
              ? insert(args.newParentChildIndex, args.node)(list)
              : parentNode === args.oldParentNode
                ? remove(args.oldParentChildIndex)(list)
                : list;
        },
        item => item
      )
    }));
  };

  handleToggleCollapse = node => {
    this.setState(state => ({
      rootNodes: recursivelyUpdateList(
        state.rootNodes,
        null,
        (list, parentNode) => list,
        item =>
          item === node ? { ...item, isCollapsed: !item.isCollapsed } : item
      )
    }));
  };

  renderNode = node => (
    <div className={styles.nodeItem}>
      {!node.children || node.children === [] ? null : (
        <a
          style={{ fontSize: "0.5em", verticalAlign: "middle" }}
          onClick={() => this.handleToggleCollapse(node)}
        >
          {node.isCollapsed ? "⊕" : "⊖"}
        </a>
      )}
      Node: {node.title}
    </div>
  );

  render() {
    return (
      <TreeView
        rootNodes={this.state.rootNodes}
        classNames={styles}
        renderNode={this.renderNode}
        onMoveNode={this.handleMoveNode}
      />
    );
  }
}

const DraggableApp = DragDropContext(HTML5Backend)(App);

render(<DraggableApp />, document.querySelector("#root"));

function insert(start, item) {
  return arr => [...arr.slice(0, start), item, ...arr.slice(start)];
}

function remove(index) {
  return arr => arr.filter((_, i) => i !== index);
}
