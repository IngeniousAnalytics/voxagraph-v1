// src/main.tsx
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./redux/store";

import AppShell from "./app";          // ✅ Authenticated app shell
import AppPublic from "./AppPublic";   // ✅ Marketing site

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./assets/styles/grid.css";
import "./_mixins.scss";
import "./styles.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider defaultColorScheme="light">
        <Notifications position="top-right" zIndex={2077} />

        {/* ✅ ONE router for the whole app */}
        <BrowserRouter>
          <Routes>
            {/* Public marketing routes */}
            <Route path="/*" element={<AppPublic />} />
            {/* Authenticated app shell (login/dashboard) */}
            <Route path="/login/*" element={<AppShell />} />
            <Route path="/dashboard/*" element={<AppShell />} />
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </Provider>
  </StrictMode>
);
