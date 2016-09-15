import React from "react";
import {TreeViewItemList} from "./Node";

const TreeView =
  ({allowInsertToNode = true, ...props}) => (
    <div className={ props.classNames.treeView }>
      <TreeViewItemList
        lock={props.lock}
        parentNode={ null }
        nodes={ props.rootNodes }
        renderNode={ props.renderNode }
        classNames={ props.classNames }
        onMoveNode={ props.onMoveNode }
        allowInsertToNode={ allowInsertToNode }
      />
    </div>
  );

export default TreeView;
