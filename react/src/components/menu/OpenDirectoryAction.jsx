import React, {useContext, useState} from 'react';
import styles from "../custom.module.scss";

import ModalWrapper from './ModalWrapper';
import Finder from "../finder/Finder";
import {Context} from "../../hooks/context";

const OpenDirectoryAction = (props) => {
  const [state, dispatch] = useContext(Context);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <span className={styles.menuBarAction}
           onClick={() => setModalOpen((prev) => !prev)}>
        Open Directory
      </span>
      <ModalWrapper open={modalOpen} content={
        <Finder
          dir={state.dir.length ? state.dir : '~'}
          client={state.client}
          recurse={false}
          onFileOpen={(f) => {
          }}
          name={"open-directory-modal"}
          onDirectorySelect={(dir) => {
            dispatch({
              type: 'SET_DIR',
              payload: dir
            });
            setModalOpen(false);
          }}
        />
      }/>
    </>
  );
};

export default OpenDirectoryAction;
