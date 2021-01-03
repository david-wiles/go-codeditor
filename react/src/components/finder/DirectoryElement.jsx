import React from "react";
import {FileElement} from "./FileElement.jsx";

export class DirectoryElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: false
    }
  }

  render() {
    let subTree = this.props.tree.subTree;
    return (
      <div key={"finder-list-element-" + this.props.tree.path}>
        <div
          className={this.props.isRoot ? "directory-tree-element root" : "directory-tree-element"}
          onDoubleClick={() => this.setState({isCollapsed: !this.state.isCollapsed})}
        >
          <i className={this.state.isCollapsed ? "gg-chevron open" : "gg-chevron"}/>
          <i className={"gg-folder"}/>
          {this.props.name}
        </div>
        <div className={this.state.isCollapsed ? "finder-directory-closed" : "finder-directory-open"}>
          {
            Object.keys(subTree).map((key) => {
              if (subTree[key].isDir) {
                return (
                  <DirectoryElement
                    key={"finder-element-" + subTree[key].path}
                    name={subTree[key].name}
                    tree={subTree[key]}
                    onFileOpen={this.props.onFileOpen}
                  />
                );
              } else {
                return (
                  <FileElement
                    key={"finder-element-" + subTree[key].path}
                    path={subTree[key].path}
                    name={subTree[key].name}
                    onFileOpen={this.props.onFileOpen}
                  />
                );
              }
            })
          }
        </div>
      </div>
    );
  }
}
