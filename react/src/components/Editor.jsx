import * as React from "react";

import ReactQuill from "react-quill";
import {configure, HotKeys} from "react-hotkeys";
import {LineNumbers} from "./LineNumbers.jsx";


const keyMap = {
  save: ["ctrl+s", "command+s"]
};

export class Editor extends React.Component {
  constructor(props) {
    super(props);

    configure({
      ignoreEventsCondition: () => false // No events should be ignored
    });
    this.state = {
      lineCount: 1
    };
    this.rqRef = null;
    this.handlers = {
      save: (e) => {
        e.preventDefault();
        this.props.client.save(this.props.file, this.rqRef.getEditor().getText())
          .then(r => console.log(r))
          .catch(e => console.log(e));
      }
    }
    this.observer = new MutationObserver((list, ob) => {
      this.setState({lineCount: this.rqRef.getEditingArea().children[0].children.length});
    });
  }

  componentDidMount() {
    this.observer.observe(this.rqRef.getEditingArea().children[0], {childList: true});
  }

  render() {
    return (
      <HotKeys
        keyMap={keyMap}
        handlers={this.handlers}
        className={this.props.isActive ? "editor-pane active" : "editor-pane"}>
        <LineNumbers count={this.state.lineCount}/>
        <ReactQuill
          theme={null}
          id={"editor"}
          className={"quill-container"}
          ref={(el) => this.rqRef = el}
        />
      </HotKeys>
    );
  }
}
