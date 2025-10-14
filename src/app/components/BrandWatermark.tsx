// /src/app/components/BrandWatermark.tsx
import React from "react";
import "./BrandWatermark.scss";

// ✅ Prefer a PNG placed in /public/assets/img/ for zero type issues
// Put: /public/assets/img/logo_only.png  (24x24 or 32x32)
const LOGO_URL = "./assets/img/logo_only.ico";

export default function BrandWatermark() {
  // inline style fallback so it's visible even if SCSS fails to load
  const baseStyle: React.CSSProperties = {
    position: "fixed",
    right: 16,
    bottom: 14,
    display: "inlineFlex",
    gap: 8,
    alignItems: "center",
    padding: "8px 10px",
    borderRadius: 12,
    zIndex: 1000,               // ⬅️ sits above almost everything
    pointerEvents: "none",
  };

  return (
    <div className="brand-watermark" role="contentinfo" style={baseStyle}>
      <small>Powered by&nbsp;<strong>Ingenious Analytics</strong></small>
      <img
        src={LOGO_URL}
        width={24}
        height={24}
        alt="Ingenious Analytics"
        loading="lazy"
        decoding="async"
        style={{ borderRadius: 6 }}
      />
    </div>
  );
}
