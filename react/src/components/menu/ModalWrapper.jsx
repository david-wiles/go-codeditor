import React from "react";

import styles from '../custom.module.scss';

const ModalWrapper = (props) => {
  return (
    <div className={props.open ? styles.modal : styles.hidden}>
      <div className={styles.modalDialog}>
        <div className={styles.modalContent}>
          { props.content }
        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;
