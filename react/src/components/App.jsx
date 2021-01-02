import * as React from "react";

import {Toolbar} from "./Toolbar.jsx";
import {Editor} from "./Editor.jsx";
import {Client} from "../client.js";
import {Finder} from "./Finder.jsx";

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.client = new Client();
    this.state = {
      files: ["one", "two", "three"], // Open files
      activeIdx: 0
    };

    this.createEditor.bind(this);
  }

  createEditor(file, index) {
    return (
      <Editor
        client={this.client}
        file={file}
        isActive={this.state.activeIdx === index}
        key={"editor-pane-" + index}
      />
    );
  }

  render() {
    // Render an editor for each open file
    let editors = this.state.files.map((f, i) => this.createEditor(f, i));

    // Push an empty editor by default
    if (editors.length === 0) {
      editors.push(this.createEditor(undefined, 0));
    }

    return (
      <div className={"app-container"} spellCheck={"false"}>
        <Toolbar
          files={this.state.files}
          active={this.state.activeIdx}
          tabChange={(idx) => this.setState({activeIdx: idx})}
        />
        <div className={"editor-container"}>
          <Finder/>
          {
            editors
          }
        </div>
      </div>
    );
  }
}
