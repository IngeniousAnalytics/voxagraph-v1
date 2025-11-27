// src/pages/Dashboard/components/cards/CardStyleEditor.tsx
import React, { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import { closeAllModals } from "@mantine/modals";
import "./card-editor.scss";

/**
 * CardStyleEditor updated:
 * - Ribbon is draggable (moves the panel via transform on container).
 * - Compact, fits within 420px height/width constraints (no internal scroll).
 * - No thick gray lines; visual polish like Figma inspector.
 */

export interface CardDesign {
  background?: string;
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: string;
  textShadow?: string;
  borderRadius?: string;
  borderWidth?: number;
  borderColor?: string;
  alignX?: "left" | "center" | "right";
  alignY?: "top" | "middle" | "bottom";
  layoutMode?: "stacked" | "inline";
  width?: number;
  height?: number;
}

interface Props {
  design?: CardDesign;
  onChange?: (d: CardDesign) => void;
  onSave?: (d: CardDesign) => void;
  onClose?: () => void;

  initialX?: number;
  initialY?: number;
}

const FONT_FAMILIES = [
  { id: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial", label: "Inter" },
  { id: "Poppins, system-ui, -apple-system, Roboto, Arial", label: "Poppins" },
  { id: "Roboto, system-ui, -apple-system, 'Segoe UI', Arial", label: "Roboto" },
  { id: "Montserrat, system-ui, -apple-system, Roboto, Arial", label: "Montserrat" },
  { id: "Lato, system-ui, -apple-system, Roboto, Arial", label: "Lato" },
];

const SHADOWS: Record<string, string> = {
  none: "none",
  subtle: "0 1px 2px rgba(0,0,0,0.12)",
  medium: "0 4px 10px rgba(0,0,0,0.14)",
  strong: "0 8px 20px rgba(0,0,0,0.18)",
  mstrong: "0 16px 40px rgba(0,0,0,0.20)",
  lstrong: "0 32px 60px rgba(0,0,0,0.24)",
};

export default function CardStyleEditor({ design = {}, onChange, onSave, onClose }: Props) {
  const [local, setLocal] = useState<CardDesign>({ ...design });

  // Drag state for entire panel
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => setLocal({ ...design }), [design]);

  const update = (k: keyof CardDesign, v: string | number | boolean | undefined) => {
    const next = { ...local, [k]: v };
    setLocal(next);
    onChange?.(next);
  };

  const toggleBold = () => update("fontWeight", local.fontWeight === "700" ? "400" : "700");
  const toggleItalic = () => update("fontStyle", local.fontStyle === "italic" ? "normal" : "italic");
  const setAlignX = (a: CardDesign["alignX"]) => update("alignX", a);
  const setAlignY = (a: CardDesign["alignY"]) => update("alignY", a);
  const setLayout = (m: CardDesign["layoutMode"]) => update("layoutMode", m);

  const cycleShadow = () => {
    const order = ["none", "subtle", "medium", "strong"];
    const current = subKey(local.textShadow);
    const next = order[(order.indexOf(current) + 1) % order.length];
    update("textShadow", SHADOWS[next]);
  };

  const handleSave = () => {
    onSave?.(local);
    closeAllModals();
    onClose?.();
  };

  // ---- Drag handlers (ribbon is the handle) ----
  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start drag if clicking interactive element or inside one
    const target = e.target as HTMLElement;
    
    // Check if clicking on or inside a button
    if (target.closest("button, .ce-btn, .ce-select, .ce-size, .ce-color, .ce-iconwrap, .ce-radius, input, select, label, a")) {
      return;
    }

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });

    // prevent text selection while dragging
    (document.activeElement as HTMLElement)?.blur?.();
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Apply transform to panel root (so popover content moves visually)
  useEffect(() => {
    const el = document.querySelector(".figma-panel") as HTMLElement | null;
    if (el) {
      el.style.transform = `translate(${position.x}px, ${position.y}px)`;
      el.style.transition = isDragging ? "none" : "transform 0.12s ease";
    }
  }, [position, isDragging]);

  return (
    <div className="card-editor-root" style={{ width: "100%" }}>
      {/* Ribbon: drag handle */}
      <div
        className="ce-ribbon"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? "grabbing" : "grab", WebkitUserSelect: "none" }}
      >
        {/* Groups — compact, no heavy dividers */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select
            className="ce-select"
            value={local.fontFamily || FONT_FAMILIES[0].id}
            onChange={(e) => update("fontFamily", e.target.value)}
            title="Font family"
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>

          <input
            className="ce-size"
            type="number"
            title="Font size"
            min={8}
            max={80}
            value={local.fontSize ?? 18}
            onChange={(e) => update("fontSize", Number(e.target.value))}
            style={{ width: 62 }}
          />

          <button className={`ce-btn ${local.fontWeight === "700" ? "active" : ""}`} onClick={toggleBold} title="Bold">
            <Icon icon="mdi:format-bold" width={18} />
          </button>
          <button className={`ce-btn ${local.fontStyle === "italic" ? "active" : ""}`} onClick={toggleItalic} title="Italic">
            <Icon icon="mdi:format-italic" width={18} />
          </button>
          <button className="ce-btn" onClick={cycleShadow} title="Text shadow">
            <Icon icon="mdi:text-shadow" width={18} />
          </button>
        </div>
      </div>

      {/* Compact content area — intentionally minimal to avoid inner scrolling */}
      <div
        className="ce-body"
        style={{
          padding: "12px 14px 18px 14px",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 10,
          alignItems: "start",
          background: "transparent",
        }}
      >
        {/* color row */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label className="ce-iconwrap" title="Text color">
            <Icon icon="mdi:format-color-text" width={16} />
            <input
              className="ce-color"
              type="color"
              value={local.color || "#2E3A59"}
              onChange={(e) => update("color", e.target.value)}
            />
          </label>

          <label className="ce-iconwrap" title="Background color">
            <Icon icon="mdi:format-color-fill" width={16} />
            <input
              className="ce-color"
              type="color"
              value={local.background || "#ffffff"}
              onChange={(e) => update("background", e.target.value)}
            />
          </label>

          <div>Border</div>

          <input
            type="number"
            className="ce-radius"
            title="Border radius px"
            min={0}
            max={60}
            value={parseInt(local.borderRadius || "0")}
            onChange={(e) => update("borderRadius", `${e.target.value}px`)}
            style={{ width: 82 }}
          />
        </div>

        {/* alignment row */}
        <div style={{ display: "flex", gap: 8 }}>
          <button className={`ce-btn ${local.alignX === "left" ? "active" : ""}`} onClick={() => setAlignX("left")} title="Align left">
            <Icon icon="mdi:format-align-left" />
          </button>
          <button className={`ce-btn ${local.alignX === "center" ? "active" : ""}`} onClick={() => setAlignX("center")} title="Align center">
            <Icon icon="mdi:format-align-center" />
          </button>
          <button className={`ce-btn ${local.alignX === "right" ? "active" : ""}`} onClick={() => setAlignX("right")} title="Align right">
            <Icon icon="mdi:format-align-right" />
          </button>

          <div style={{ width: 12 }} />

          <button
            type="button"
            className={`ce-btn ${local.alignY === "top" ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              console.log('CardStyleEditor: align top clicked');
              setAlignY("top");
            }}
            title="Align top"
          >
            <Icon icon="mdi:align-vertical-top" />
          </button>
          <button
            type="button"
            className={`ce-btn ${local.alignY === "middle" ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              console.log('CardStyleEditor: align middle clicked');
              setAlignY("middle");
            }}
            title="Align middle"
          >
            <Icon icon="mdi:align-vertical-center" />
          </button>
          <button
            type="button"
            className={`ce-btn ${local.alignY === "bottom" ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              console.log('CardStyleEditor: align bottom clicked');
              setAlignY("bottom");
            }}
            title="Align bottom"
          >
            <Icon icon="mdi:align-vertical-bottom" />
          </button>
        </div>



        {/* layout controls */}
        <div style={{ display: "flex", gap: 8 }}>
          <button className={`ce-btn ${local.layoutMode === "stacked" ? "active" : ""}`} onClick={() => setLayout("stacked")} title="Stacked">
            <Icon icon="mdi:format-wrap-top-bottom" />
          </button>
          <button className={`ce-btn ${local.layoutMode === "inline" ? "active" : ""}`} onClick={() => setLayout("inline")} title="Inline">
            <Icon icon="mdi:format-wrap-inline" />
          </button>
        </div>

                {/* Save/close */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="ce-btn secondary"
            onClick={() => {
              closeAllModals();
              onClose?.();
            }}
            title="Cancel"
          >
            <Icon icon="mdi:close" width={18} />
          </button>
          <button className="ce-btn primary" onClick={handleSave} title="Save">
            <Icon icon="mdi:content-save" width={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// helpers
function subKey(textShadow?: string) {
  if (!textShadow || textShadow === "none") return "none";
  if (textShadow.includes("0 1px")) return "subtle";
  if (textShadow.includes("0 4px")) return "medium";
  if (textShadow.includes("0 8px")) return "strong";
  if (textShadow.includes("0 16px")) return "mstrong";
  if (textShadow.includes("0 32px")) return "lstrong";
  return "none";
}
