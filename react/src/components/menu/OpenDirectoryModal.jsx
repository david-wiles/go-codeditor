import React, {useContext, useEffect, useState} from "react";
import styles from '../custom.module.scss';
import ModalWrapper from "./ModalWrapper";
import Finder from "../finder/Finder";
import {Context} from "../../hooks/context";

const OpenDirectoryModal = (props) => {
  const [isOpen, setOpen] = useState(props.open);
  const [text, setText] = useState('');
  const [tree, setTree] = useState({});

  const [state, dispatch] = useContext(Context);

  useEffect(() => {
    if (props.dir) {
      state.client.buildTree(props.dir, false)
        .then(t => setTree(t))
        .catch(err => console.error(err));
    }
  }, [props.dir]);

  const selectDirectory = (dir) => {
    state.client.buildTree(dir, true)
      .then(t => dispatch({
        type: 'SET_TREE',
        payload: t
      }))
      .catch(err => console.error(err))

    dispatch({
      type: 'SET_DIR',
      payload: dir
    });

    if (props.onDirectorySelect) {
      props.onDirectorySelect();
    }
  };

  return (
    <ModalWrapper open={props.open} content={
      <div className={styles.directorySelector}>
        <Finder
          className={styles.finder}
          recurse={false}
          onFileOpen={(f) => {
          }}
          name={"open-directory-modal"}
          onDirectorySelect={(dir) => selectDirectory(dir)}
          tree={tree}
        />

        <div className={styles.controls}>
          <div className={styles.textInputBox}>
            <label htmlFor={'openDirectoryInput'}>
              Directory Name
            </label>
            <input type={"text"}
                   id={"openDirectoryInput"}
                   onChange={(e) => setText(e.target.value)}/>
          </div>
          <div className={styles.formButtons}>
            <button onClick={() => setOpen(!isOpen)}>Cancel</button>
            <button onClick={() => selectDirectory(text)}>Open</button>
          </div>
        </div>
      </div>
    }/>
  )
};

export default OpenDirectoryModal;
