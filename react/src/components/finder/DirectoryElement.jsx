import React, {useState} from "react";

import styles from "../custom.module.scss";

import FileElement from "./FileElement.jsx";

const DirectoryElement = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getSubtreeElement = (elem) => {
    if (elem.isDir) {
      return (
        <DirectoryElement
          key={"finder-element-" + elem.path}
          name={elem.name}
          tree={elem}
          onFileOpen={props.onFileOpen}
        />
      );
    } else {
      return (
        <FileElement
          key={"finder-element-" + elem.path}
          path={elem.path}
          name={elem.name}
          onFileOpen={props.onFileOpen}
        />
      );
    }
  };

  let subTree = props.tree.subTree;
  return (
    <div key={"finder-list-element-" + props.tree.path}>
      <div
        className={props.isRoot ? [styles.directoryTreeElement, styles.root].join(' ') : styles.directoryTreeElement}
        onDoubleClick={() => setIsCollapsed(!isCollapsed)}
      >
        <i className={isCollapsed ? [styles.ggChevron, styles.open].join(' ') : styles.ggChevron}/>
        <i className={styles.ggFolder}/>
        {props.name}
      </div>
      <div className={isCollapsed ? styles.finderDirectoryClosed : styles.finderDirectoryOpen}>
        {
          Object.values(subTree).map(getSubtreeElement)
        }
      </div>
    </div>
  );


};

export default DirectoryElement;
