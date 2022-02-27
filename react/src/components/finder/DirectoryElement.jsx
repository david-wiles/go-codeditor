import React, {useState} from "react";

import styles from "../custom.module.scss";

import FileElement from "./FileElement.jsx";

const DirectoryElement = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(!props.isRoot);

  const getSubtreeElement = (elem) => {
    if (elem.isDir) {
      return (
        <DirectoryElement
          key={props.finderName + "-finder-element-" + elem.path}
          name={elem.name}
          finderName={props.finderName}
          tree={elem}
          onFileOpen={props.onFileOpen}
          onDirectorySelect={props.onDirectorySelect}
        />
      );
    } else {
      return (
        <FileElement
          key={props.finderName + "-finder-element-" + elem.path}
          path={elem.path}
          name={elem.name}
          onFileOpen={props.onFileOpen}
        />
      );
    }
  };

  let subTree = props.tree.subTree;
  return (
    <div>
      <div
        className={props.isRoot ? [styles.directoryTreeElement, styles.root].join(' ') : styles.directoryTreeElement}
        onClick={() => {
          setIsCollapsed(!isCollapsed);
          // Get the files in the next directory if we haven't already

        }}
        onDoubleClick={() => props.onDirectorySelect(props.tree.path)}
      >
        <i className={isCollapsed ? [styles.ggChevron, styles.open].join(' ') : styles.ggChevron}/>
        <i className={styles.ggFolder}/>
        {props.name}
      </div>
      <div className={isCollapsed ? styles.finderDirectoryClosed : styles.finderDirectoryOpen}>
        {
          subTree ? Object.values(subTree).map(getSubtreeElement) : ''
        }
      </div>
    </div>
  );
};

export default DirectoryElement;
