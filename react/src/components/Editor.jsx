import * as React from "react";

import ReactQuill from "react-quill";
import {configure, HotKeys} from "react-hotkeys";
import {LineNumbers} from "./LineNumbers.jsx";

import hljs from 'highlight.js';

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
      originalText: "",
      markupText: "",
      lineCount: 1
    };
    this.rqRef = null;
    this.handlers = {
      save: (e) => {
        e.preventDefault();
        this.props.client.save(this.props.file.path, this.rqRef.getEditor().getText())
          .then(r => console.log(r))
          .catch(e => console.log(e));
      }
    }
    this.observer = new MutationObserver((list, ob) => {
      let editorChildren = this.rqRef.getEditingArea().children[0].children;

      // for (let item of editorChildren) {
      //   console.log(hljs.highlight("JavaScript", item.innerHTML, true));
      // }
      this.setState({lineCount: editorChildren.length});
    });

    this.loadText.bind(this);
    this.clearEditor.bind(this);
  }

  loadText() {
    // Load text
    if (this.props.file?.path !== "") {
      this.props.client.open(this.props.file.path)
        .then((text) => {
          this.rqRef.getEditor().setText(text.text);
          this.setState({originalText: text.text})
        })
        .catch(err => console.error(err));
    }
  }

  clearEditor() {
    this.rqRef.getEditor().setText("");
    this.setState({
      originalText: ""
    });
  }

  componentDidMount() {
    this.loadText();
    // Observe line changes
    this.observer.observe(this.rqRef.getEditingArea().children[0], {subtree: true, childList: true});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Load text if the previous file path doesn't match the current one
    if (prevProps.file === undefined || prevProps.file.path !== this.props.file.path) {
      this.loadText();
    }
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
