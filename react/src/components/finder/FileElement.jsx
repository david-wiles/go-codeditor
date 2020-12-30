import * as React from "react";

export class FileElement extends React.Component {
  render() {
    return (
      <div className={"file-tree-element"}>
        <i className={"gg-file"}/>
        {this.props.name}
      </div>
    );
  }
}
