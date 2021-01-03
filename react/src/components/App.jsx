import React from "react";

import {Toolbar} from "./Toolbar.jsx";
import {Editor} from "./Editor.jsx";
import {Client} from "../Client.js";
import {Finder} from "./finder/Finder.jsx";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.client = new Client();
    this.state = {
      files: [], // all open files
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
        key={"editor-pane-" + file.path}
      />
    );
  }

  render() {
    // Render an editor for each open file
    let editors = this.state.files.map((f, i) => this.createEditor(f, i));

    // Push an empty editor by default
    if (editors.length === 0) {
      editors.push(this.createEditor({
        name: "",
        path: ""
      }, 0));
    }

    return (
      <div className={"app-container"} spellCheck={"false"}>
        <Toolbar
          files={this.state.files}
          active={this.state.activeIdx}
          onTabChange={(idx) => this.setState({activeIdx: idx})}
          onTabClose={(idx) => {
            this.setState((prev) => ({
              files: prev.files.filter((file, index) => index !== idx),
              activeIdx: prev.activeIdx - 1
            }));
          }}
        />
        <div className={"editor-container"}>
          <Finder
            client={this.client}
            dir={"/Users/davidwiles/go/src/go-codeditor/react/src/"}
            onFileOpen={(f) => {
              this.setState((prev) => ({
                files: [...prev.files, {
                  name: f.split("/").pop(),
                  path: f
                }]
              }));
            }}
          />
          {
            editors
          }
        </div>
      </div>
    );
  }
}
