import * as React from "react";

export class DirectoryElement extends React.Component {
  render() {
    return (
      <div className={"directory-tree-element"}>
        <i className={"gg-folder"}/>
        {this.props.name}
      </div>
    );
  }
}
