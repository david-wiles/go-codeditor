import React from "react";

const FileElement = (props) => {
  return (
    <div
      className={"file-tree-element"}
      onDoubleClick={() => props.onFileOpen(props.path)}
    >
      <i className={"gg-file"}/>
      {props.name}
    </div>
  );
};

export default FileElement;
