// preload.js

import { remote } from "electron";
const { app } = remote;

import path from "path";
import fs from "fs";

import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import styles from "./app.css";

// to disable any security warnnings
window.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const dashboardCSS = `
    height: 500px;
    min-height: 500px;
    width: 280px;
    position: fixed;
    bottom: 0px;
    right: 0px;
    z-index: 999;
`;

window.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.cssText = styles.toString();
  document.head.append(style);

  const dashboardRootEle = document.createElement("douyin-dashboard-root");
  dashboardRootEle.innerHTML = fs
    .readFileSync(path.join(app.getAppPath(), "dashboard.html"))
    .toString();
  dashboardRootEle.style.cssText = dashboardCSS;
  document.body.append(dashboardRootEle);

  let root = document.getElementById("dashboard-root");
  ReactDOM.render(<App></App>, root);
});
