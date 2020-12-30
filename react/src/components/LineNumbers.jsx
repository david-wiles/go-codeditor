import * as React from "react";

export class LineNumbers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 1
    };

    this.observer = new MutationObserver((list, ob) => {
      // TODO avoid use of document if possible
      this.setState({count: document.querySelectorAll("div.ql-editor > p").length});
    });
  }

  componentDidMount() {
    // TODO wait for quill to load so we don't have to throw away events
    this.observer.observe(document.getElementById("editor"), {subtree: true, childList: true});
  }

  render() {
    let numbers = [];

    for (let i = 1; i <= this.state.count; i += 1) {
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
