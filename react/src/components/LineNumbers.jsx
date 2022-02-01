import React from "react";

const LineNumbers = (props) => {
  let numbers = Array.from(Array(props.count), (_, i) => {
    let key = "line-number-" + i + 1;
    return (<p className={"line-number"} key={key}>{i + 1}</p>);
  });

  return (
    <div className={"line-numbers"}>
      {numbers}
    </div>
  );

};

export default LineNumbers;
