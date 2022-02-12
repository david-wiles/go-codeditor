import React, {useEffect, useState} from "react";

import styles from "../custom.module.scss";

import DirectoryElement from "./DirectoryElement.jsx";

const appendFileEntry = (rootTree, dir, entry) => {
  let parts = entry.name
    .slice(dir.length)
    .split("/");

  let tree = rootTree;
  for (let i = 0; i < parts.length; i += 1) {
    if (tree.subTree[parts[i]]) {
      tree = tree.subTree[parts[i]];
    } else {
      // The last part should always entry this branch because file names must be unique.
      // However, we may enter this branch before the last part if there is only one file in the dir
      tree.subTree[parts[i]] = {
        isDir: entry.isDir,
        name: parts[parts.length - 1],
        path: dir + parts.join("/"),
        subTree: {}
      };
    }
  }
};

const Finder = (props) => {

  const [dir, setDir] = useState('');
  const [tree, setTree] = useState({
    isDir: false,
    path: "",
    name: "",
    // tree will be a map formatted with each part of the path, such as...
    // {
    //   "<root>": {
    //     "isDir": true,
    //     "path": <root>,
    //     "name": <root basename>
    //     "subTree": {
    //       "<subPath>": {
    //         "isDir": true,
    //         "path": <root>/<subPath>,
    //         "name": <subPath>
    //         "subTree": {
    //           "<file>": {
    //             "isDir": false,
    //             "path": <root>/<subPath>/<file>,
    //             "name": <file>
    //           }
    //         }
    //       }
    //     }
    //   },
    // }
    subTree: {}
  });

  useEffect(() => {
    props.client.ls(props.dir)
      .then(res => {
        let tree = {
          isDir: true,
          path: res.dir,
          name: res.dir.split("/").pop(),
          subTree: {}
        };

        // Roll entries into arrays
        res.entries.forEach((entry) => appendFileEntry(tree, res.dir, entry));

        setDir(res.dir);
        setTree(tree);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className={styles.finderContainer}>
      <DirectoryElement
        name={dir}
        tree={tree}
        isRoot={true}
        onFileOpen={props.onFileOpen}
      />
    </div>
  );
};

export default Finder;
