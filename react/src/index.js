import React from 'react';
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import Store from "./hooks/context.jsx"

ReactDOM.render(
  <Store><App/></Store>,
  document.getElementById("root")
);
