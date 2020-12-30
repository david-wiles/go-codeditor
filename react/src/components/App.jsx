import * as React from "react";

import {GlobalHotKeys, configure} from "react-hotkeys";
import ReactQuill from "react-quill";
import {Finder} from "./Finder.jsx";
import {LineNumbers} from "./LineNumbers.jsx";
import {Toolbar} from "./Toolbar.jsx";
import {Client} from "../client.js";

const keyMap = {
  save: ["ctrl+s", "command+s"]
};

export class App extends React.Component {
  constructor(props) {
    super(props);

    configure({
      ignoreEventsCondition: () => false // No events should be ignored
    });

    this.client = new Client();
    this.rqRef = null;
    this.handlers = {
      save: (e) => {
        e.preventDefault();
        this.client.save("/Users/davidwiles/testing.txt", this.rqRef.getText())
          .then(r => console.log(r))
          .catch(e => console.log(e));
      }
    }
  }

  render() {
    return (
      <div className={"app-container"} spellCheck={"false"}>
        <Toolbar/>
        <div className={"editor-container"}>
          <Finder/>
          <LineNumbers/>
          <ReactQuill
            theme={null}
            id={"editor"}
            className={"quill-container"}
            ref={(el) => this.rqRef = el.getEditor()}
          />
          <GlobalHotKeys keyMap={keyMap} handlers={this.handlers}/>
        </div>
      </div>
    );
  }
}
