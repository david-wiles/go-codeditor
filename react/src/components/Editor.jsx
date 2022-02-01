import React, {useEffect, useRef, useState} from "react";

import ReactQuill from "react-quill";
import {configure, HotKeys} from "react-hotkeys";
import LineNumbers from "./LineNumbers.jsx";

const keyMap = {
  save: ["ctrl+s", "command+s"]
};

const Editor = (props) => {
  const isInitialMount = useRef(true);

  configure({
    ignoreEventsCondition: () => false // No events should be ignored
  });

  const [originalText, setOriginalText] = useState('');
  const [markupText, setMarkupText] = useState('');
  const [lineCount, setLineCount] = useState(1);

  let rqRef = null;
  let handlers = {
    save: (e) => {
      e.preventDefault();
      props.client.save(props.file.path, rqRef.getEditor().getText())
        .then(r => console.log(r))
        .catch(e => console.log(e));
    }
  };

  let observer = new MutationObserver((list, ob) => {
    let editorChildren = rqRef.getEditingArea().children[0].children;

    // for (let item of editorChildren) {
    //   console.log(hljs.highlight("JavaScript", item.innerHTML, true));
    // }
    setLineCount(editorChildren.length);
  });

  const loadText = (path) => {
    if (path !== "") {
      props.client.open(path)
        .then((text) => {
          rqRef.getEditor().setText(text.text);
          setOriginalText(text.text);
        })
        .catch(err => console.error(err));
    }
  };

  const clearEditor = () => {
    rqRef.getEditor().setText("");
    setOriginalText('');
  }

  useEffect(() => {
    loadText(props.file?.path);
    if (isInitialMount) {
      observer.observe(rqRef.getEditingArea().children[0], {subtree: true, childList: true});
    }
  }, [props.file?.path]);

  return (
    <HotKeys
      keyMap={keyMap}
      handlers={handlers}
      className={props.isActive ? "editor-pane active" : "editor-pane"}>
      <LineNumbers count={lineCount}/>
      <ReactQuill
        theme={null}
        id={"editor-" + props.file.path}
        className={"quill-container"}
        ref={(el) => {
          if (!rqRef) rqRef = el;
        }}
      />
    </HotKeys>
  );
};

export default Editor;
