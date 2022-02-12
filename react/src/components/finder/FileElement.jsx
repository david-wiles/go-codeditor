import React from "react";

import styles from "../custom.module.scss";

const FileElement = (props) => {
  return (
    <div
      className={styles.fileTreeElement}
      onDoubleClick={() => props.onFileOpen(props.path)}
    >
      <i className={styles.ggFile}/>
      {props.name}
    </div>
  );
};

export default FileElement;
