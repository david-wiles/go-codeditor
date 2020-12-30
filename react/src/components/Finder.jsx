import * as React from "react";
import {FileElement} from "./finder/FileElement.jsx";
import {DirectoryElement} from "./finder/DirectoryElement.jsx";

export class Finder extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={"finder-container"}>
        <FileElement name={"hello_world"}/>
        <DirectoryElement name={"goodbyte_world"}/>
      </div>
    );
  }
}
