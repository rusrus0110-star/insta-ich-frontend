import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/auth.css";
import "./styles/layout.css";
import "./styles/main.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
