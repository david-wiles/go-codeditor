import React, {useState} from "react";

import Toolbar from "./Toolbar.jsx";
import Editor from "./Editor.jsx";
import Client from "../Client.js";
import Finder from "./finder/Finder.jsx";

const App = () => {
  const client = new Client();

  const [files, setFiles] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);

  const createEditor = (file, index) => {
    return (
      <Editor
        client={client}
        file={file}
        isActive={activeIdx === index}
        key={"editor-pane-" + file.path}
      />
    );
  };

  // Render an editor for each open file
  let editors = files.map(createEditor);

  // Push an empty editor by default
  if (editors.length === 0) {
    editors.push(createEditor({
      name: "",
      path: ""
    }, 0));
  }

  return (
    <div className={"app-container"} spellCheck={"false"}>
      <Toolbar
        files={files}
        active={activeIdx}
        onTabChange={setActiveIdx}
        onTabClose={(idx) => {
          setFiles(files.filter((file, index) => index !== idx));
          setActiveIdx(activeIdx - 1);
        }}
      />
      <div className={"editor-container"}>
        <Finder
          client={client}
          dir={"/Users/davidwiles/go/src/go-codeditor/react/src/"}
          onFileOpen={(f) => {
            setFiles([...files, {
              name: f.split("/").pop(),
              path: f
            }])
          }}
        />
        {
          editors
        }
      </div>
    </div>
  );
}

export default App;
