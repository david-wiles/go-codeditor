import React, {useContext, useState} from 'react';
import styles from "../custom.module.scss";

import OpenDirectoryModal from "./OpenDirectoryModal";
import {Context} from "../../hooks/context";

const OpenDirectoryAction = (props) => {
  const [state, dispatch] = useContext(Context)
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <span className={styles.menuBarAction}
            onClick={() => setModalOpen((prev) => !prev)}>
        Open Directory
      </span>
      {
        modalOpen ?
          <OpenDirectoryModal open={modalOpen}
                              onDirectorySelect={() => setModalOpen(false)}
                              dir={state.dir}/>
          : ''
      }
    </>
  );
};

export default OpenDirectoryAction;
