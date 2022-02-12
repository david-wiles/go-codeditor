import React from 'react';

import styles from '../custom.module.scss';

import DropDown from "./DropDown.jsx";
import OpenDirectoryAction from "./OpenDirectoryAction.jsx"

const MenuBar = (props) => {
  return (
    <div className={styles.toolbar}>
      <DropDown title={'File'}
                actions={[
                  <OpenDirectoryAction key={'file-open-directory-action'}/>
                ]}/>
    </div>
  );
}

export default MenuBar;
