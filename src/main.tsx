import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./redux/store";

import AppShell from "./app";          // Authenticated dashboard shell
import AppPublic from "./AppPublic";   // Public-facing site

// 🧩 Global styles
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import "./assets/styles/grid.css";
import "./_mixins.scss";
import "./styles.scss";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
// Silence ResizeObserver warnings too (sometimes logged as console.warn)
// ✅ Prevent ResizeObserver warnings (Chrome bug)
if (typeof window !== "undefined") {
  const originalError = window.console.error;
  const originalWarn = window.console.warn;

  const suppressMessage = (args: any[]) =>
    args.length === 1 &&
    typeof args[0] === "string" &&
    args[0].includes("ResizeObserver loop");

  window.console.error = (...args) => {
    if (suppressMessage(args)) return;
    originalError(...args);
  };

  window.console.warn = (...args) => {
    if (suppressMessage(args)) return;
    originalWarn(...args);
  };
}


root.render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider
        defaultColorScheme="light"
        theme={{
          fontFamily: "'Inter', sans-serif",
          primaryColor: "blue",
          defaultRadius: "md",
          cursorType: "pointer",
          components: {
            Button: {
              defaultProps: {
                radius: "md",
                size: "sm",
              },
            },
          },
        }}
      >
        {/* 🔔 Global Notifications */}
        <Notifications position="top-right" zIndex={2077} />

        {/* 💬 Global Modals Context (required for openModal, closeAllModals) */}
        <ModalsProvider
          modalProps={{
            transitionProps: { transition: "fade", duration: 150 },
            overlayProps: { backgroundOpacity: 0.35, blur: 2 },
          }}
        >
          {/* 🌍 Single router for the whole app */}
          <BrowserRouter>
            <Routes>
              {/* Public Marketing Routes */}
              <Route path="/*" element={<AppPublic />} />

              {/* Authenticated App Shell */}
              <Route path="/login/*" element={<AppShell />} />
              <Route path="/dashboard/*" element={<AppShell />} />
            </Routes>
          </BrowserRouter>
        </ModalsProvider>
      </MantineProvider>
    </Provider>
  </StrictMode>
);
