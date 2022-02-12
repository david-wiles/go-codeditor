import React from "react";

import styles from "./custom.module.scss";

const LineNumbers = (props) => {
  let numbers = Array.from(Array(props.count), (_, i) => {
    let key = "line-number-" + i + 1;
    return (<p className={styles.lineNumber} key={key}>{i + 1}</p>);
  });

  return (
    <div className={styles.lineNumbers}>
      {numbers}
    </div>
  );

};

export default LineNumbers;
