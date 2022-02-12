import React, {useState, useContext} from 'react';
import styles from "../custom.module.scss";
import Finder from "../finder/Finder";
import {Context} from "../../hooks/context.jsx";

const OpenDirectoryAction = (props) => {
  const [state, dispatch] = useContext(Context);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className={styles.menuBarAction}
           onClick={() => setModalOpen((prev) => !prev)}>
        Open Directory
      </div>
      <div className={modalOpen ? styles.modalDialog : [styles.modalDialog, styles.hidden].join(' ')}>
        <Finder
          dir={state.dir.length ? state.dir : '~'}
          client={state.client}
          recurse={false}
          onFileOpen={(f) => {}}
          name={"open-directory-modal"}
          onDirectorySelect={(dir) => {
            dispatch({
              type: 'SET_DIR',
              payload: dir
            });
            setModalOpen(false);
          }}
        />
      </div>
    </>
  );
};

export default OpenDirectoryAction;
