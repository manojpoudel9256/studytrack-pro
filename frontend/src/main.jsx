import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { TimerProvider } from "./context/TimerContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TimerProvider>
      <App />
    </TimerProvider>
  </React.StrictMode>
);
