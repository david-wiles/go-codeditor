import React from "react";

import styles from "./custom.module.scss";

import MenuBar from './menu/MenuBar.jsx';

const Toolbar = (props) => {

  const createTab = (title, index) => {
    return (
      <div
        className={index === props.active ? [styles.editorTab, styles.active].join(' ') : styles.editorTab}
        onClick={() => props.onTabChange(index)}
        key={"toolbar-tab-" + index}
      >
        {title}
        <div
          className={styles.closeButton}
          onClick={() => props.onTabClose(index)}
        >
          <i className={styles.xClose}/>
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
    <div>
      <MenuBar/>
      <div className={styles.toolbar}>
        {
          tabs
        }
      </div>
    </div>
  );
};

export default Toolbar;
