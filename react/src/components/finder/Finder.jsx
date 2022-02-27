import React, {useContext, useEffect, useState} from "react";

import styles from "../custom.module.scss";

import DirectoryElement from "./DirectoryElement.jsx";
import {Context} from "../../hooks/context";

const Finder = (props) => {
  return (
    <div className={[styles.finderContainer].concat(props.className).join(' ')}>
      {
        !!props.tree ?
          <DirectoryElement
            name={props.tree.path}
            finderName={props.name}
            tree={props.tree}
            isRoot={true}
            onFileOpen={props.onFileOpen}
            onDirectorySelect={props.onDirectorySelect}
          /> :
          ''
      }
    </div>
  );
};

export default Finder;
