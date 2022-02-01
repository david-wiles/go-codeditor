import React, {useState} from "react";

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
        className={props.isRoot ? "directory-tree-element root" : "directory-tree-element"}
        onDoubleClick={() => setIsCollapsed(!isCollapsed)}
      >
        <i className={isCollapsed ? "gg-chevron open" : "gg-chevron"}/>
        <i className={"gg-folder"}/>
        {props.name}
      </div>
      <div className={isCollapsed ? "finder-directory-closed" : "finder-directory-open"}>
        {
          Object.values(subTree).map(getSubtreeElement)
        }
      </div>
    </div>
  );


};

export default DirectoryElement;
