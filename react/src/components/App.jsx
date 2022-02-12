import React, {useContext, useEffect, useState} from "react";

import styles from "./custom.module.scss";

import Toolbar from "./Toolbar.jsx";
import Editor from "./Editor.jsx";
import Client from "../Client.js";
import Finder from "./finder/Finder.jsx";

import {Context} from "../hooks/context.jsx";

const App = () => {
  const [state, dispatch] = useContext(Context);
  const [files, setFiles] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    // Get client's credentials and create a new client, put in context
    dispatch({
      type: 'SET_CLIENT',
      payload: new Client()
    });
  }, []);

  const createEditor = (file, index) => {
    return (
      <Editor
        client={state.client}
        file={file}
        isActive={activeIdx === index}
        key={"editor-pane-" + file.path}
      />
    );
  };

  // Render an editor for each open file
  let editors = files.map(createEditor);
  if (editors.length === 0) {
    editors.push(createEditor({
      name: "",
      path: ""
    }, 0));
  }

  return (
    <div className={styles.appContainer}
         spellCheck={"false"}>
      <Toolbar
        files={files}
        active={activeIdx}
        onTabChange={setActiveIdx}
        onTabClose={(idx) => {
          setFiles(files.filter((file, index) => index !== idx));
          setActiveIdx(activeIdx - 1);
        }}
      />
      <div className={styles.editorContainer}>
        <Finder
          dir={state.dir}
          client={state.client}
          name={"main"}
          recurse={true}
          onFileOpen={(f) => {
            setFiles([...files, {
              name: f.split("/").pop(),
              path: f
            }])
          }}
          onDirectorySelect={() => {}}
        />
        {
          editors
        }
      </div>
    </div>
  );
}

export default App;
