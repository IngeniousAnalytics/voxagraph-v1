// src/index.tsx
// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="light">
      <App />
    </MantineProvider>
  </React.StrictMode>
);
