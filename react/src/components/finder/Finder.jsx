import React from "react";
import {DirectoryElement} from "./DirectoryElement.jsx";

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

export class Finder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dir: "",
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
      tree: {
        isDir: false,
        path: "",
        name: "",
        subTree: {}
      },
    };
  }

  componentDidMount() {
    this.props.client.ls(this.props.dir)
      .then(res => {
        let tree = {
          isDir: true,
          path: res.dir,
          name: res.dir.split("/").pop(),
          subTree: {}
        };

        // Roll entries into arrays
        res.entries.forEach((entry) => {
          appendFileEntry(tree, res.dir, entry);
        });

        this.setState({
          dir: res.dir,
          tree: tree
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className={"finder-container"}>
        <DirectoryElement
          name={this.state.dir}
          tree={this.state.tree}
          isRoot={true}
          onFileOpen={this.props.onFileOpen}
        />
      </div>
    );
  }
}
