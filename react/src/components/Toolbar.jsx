import React from "react";

const Toolbar = (props) => {

  const createTab = (title, index) => {
    return (
      <div
        className={index === props.active ? "editor-tab active" : "editor-tab"}
        onClick={() => props.onTabChange(index)}
        key={"toolbar-tab-" + index}
      >
        {title}
        <div
          className={"close-button"}
          aria-role={"button"}
          onClick={() => props.onTabClose(index)}
        >
          <i className={"x-close"}/>
        </div>
      </div>
    );
  }

  let tabs = props.files.map((f, i) => createTab(f.name, i));

  // Default scratch editor
  if (tabs.length === 0) {
    tabs.push(createTab(<em>Untitled</em>, 0));
  }

  return (
    <div className={"toolbar"}>
      {
        tabs
      }
    </div>
  );
};

export default Toolbar;
