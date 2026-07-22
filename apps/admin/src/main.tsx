import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// No SSR here, so no @ant-design/nextjs-registry needed — that
// package only exists to solve Ant Design's CSS-in-JS timing during
// server rendering. A plain client SPA never renders on the server,
// so this problem doesn't exist here at all.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
