import React from "react";

export class FileElement extends React.Component {
  render() {
    return (
      <div
        className={"file-tree-element"}
        onDoubleClick={() => this.props.onFileOpen(this.props.path)}
      >
        <i className={"gg-file"}/>
        {this.props.name}
      </div>
    );
  }
}
