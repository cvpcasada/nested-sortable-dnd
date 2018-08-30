import React from 'react';
import { TreeViewItemList } from './Node';

class TreeView extends React.Component {
  render() {
    const { classNames, ...props } = this.props;

    return (
      <div className={classNames.treeView}>
        <TreeViewItemList
          lock={props.lock}
          parentNode={null}
          nodes={props.rootNodes}
          renderNode={props.renderNode}
          classNames={classNames}
          onMoveNode={props.onMoveNode}
        />
      </div>
    );
  }
}

export default TreeView;
