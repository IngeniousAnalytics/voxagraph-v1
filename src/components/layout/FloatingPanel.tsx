import React, { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  x: number;
  y: number;
  children: ReactNode;
}

export default function FloatingPanel({ x, y, children }: Props) {
  const panel = document.getElementById("floating-panel-root");

  if (!panel) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: y,
        left: x,
        zIndex: 9999999,
        pointerEvents: "auto",
      }}
    >
      {children}
    </div>,
    panel
  );
}
