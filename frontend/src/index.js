import React from "react";
import ReactDOM from "react-dom";
import { configureAxios } from "./api";
import { App } from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

configureAxios();

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);

serviceWorkerRegistration.unregister();

reportWebVitals(console.log);
