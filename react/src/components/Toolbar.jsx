import * as React from "react";

export class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.createTab.bind(this);
  }

  createTab(title, index) {
    return (
      <div
        className={index === this.props.active ? "editor-tab active" : "editor-tab"}
        onClick={() => this.props.tabChange(index)}
        key={"toolbar-tab-" + index}
      >
        {title}
      </div>
    );
  }

  render() {
    let tabs = this.props.files.map((f, i) => this.createTab(f, i));

    // Default scratch editor
    if (tabs.length === 0) {
      tabs.push(this.createTab(<em>Untitled</em>, 0));
    }

    return (
      <div className={"toolbar"}>
        {
          tabs
        }
      </div>
    );
  }
}
