// src/main.tsx
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

// ⚠️ CRITICAL: Hide webpack overlay for ResizeObserver errors BEFORE React mounts
if (typeof window !== "undefined") {
  // Function to hide the webpack dev server overlay
  const hideOverlay = () => {
    const overlay = document.getElementById('webpack-dev-server-client-overlay');
    const overlayDiv = document.getElementById('webpack-dev-server-client-overlay-div');
    
    if (overlay) {
      overlay.style.cssText = 'display: none !important; visibility: hidden !important;';
    }
    if (overlayDiv) {
      overlayDiv.style.cssText = 'display: none !important; visibility: hidden !important;';
    }
  };

  // Intercept the error before webpack displays it
  window.onerror = function(msg: any) {
    const msgStr = String(msg || '');
    if (msgStr.includes('ResizeObserver')) {
      // Hide overlay on next tick
      setTimeout(hideOverlay, 0);
      return true; // Prevent default error handling
    }
    return false;
  };

  // Also continuously monitor and hide the overlay if it appears
  let checkCount = 0;
  const checkInterval = setInterval(() => {
    const overlay = document.getElementById('webpack-dev-server-client-overlay');
    if (overlay) {
      const text = overlay.textContent || '';
      if (text.includes('ResizeObserver')) {
        hideOverlay();
      }
    }
    checkCount++;
    if (checkCount > 100) clearInterval(checkInterval); // Stop after 100 checks (10 seconds)
  }, 100);
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
