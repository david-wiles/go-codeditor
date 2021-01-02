import * as React from "react";

export class LineNumbers extends React.Component {
  render() {
    let numbers = [];

    for (let i = 1; i <= this.props.count; i += 1) {
      let key = "line-number-" + i;
      numbers.push(<p className={"line-number"} key={key}>{i}</p>)
    }

    return (
      <div className={"line-numbers"}>
        {numbers}
      </div>
    );
  }
}
