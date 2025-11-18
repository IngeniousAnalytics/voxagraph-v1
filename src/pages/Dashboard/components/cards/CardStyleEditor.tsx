// src/pages/Dashboard/components/cards/CardStyleEditor.tsx
import React, { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import { closeAllModals } from "@mantine/modals";
import "./card-editor.scss";

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
  
  // Drag state
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

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start drag if clicking on interactive elements
    const target = e.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    const isInteractive = ['button', 'input', 'select', 'label', 'a', 'svg', 'path'].includes(tagName);
    const hasClickableClass = target.closest('.ce-btn, .ce-select, .ce-size, .ce-color, .ce-iconwrap, .ce-radius');
    
    if (isInteractive || hasClickableClass) {
      return; // Don't start drag, let the element handle the click
    }
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, handleMouseMove, handleMouseUp]);

useEffect(() => {
  const content = document.querySelector(".draggable-modal-content") as HTMLElement;
  if (content) {
    content.style.position = "absolute";
    content.style.top = "0";
    content.style.left = "0";
    content.style.transform = `translate(${position.x}px, ${position.y}px)`;
    content.style.transition = "none";
    content.style.zIndex = "9999";
  }
}, [position]);




  return (
   <div className="card-editor-root">      {/* Compact ribbon top (32px height) */}
      <div className="ce-ribbon" onMouseDown={handleMouseDown} style={{ cursor: isDragging ? "grabbing" : "grab" }}>
        {/* Fonts group */}
        <div className="ce-group">
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
          />
        </div>

        {/* Style group (icons) */}
        <div className="ce-group">
          <button className={`ce-btn ${local.fontWeight === "700" ? "active" : ""}`} onClick={toggleBold} title="Bold">
            <Icon icon="mdi:format-bold" width={22} height={22} />

          </button>
          <button className={`ce-btn ${local.fontStyle === "italic" ? "active" : ""}`} onClick={toggleItalic} title="Italic">
            <Icon icon="mdi:format-italic" width={22} height={22}/>
          </button>
         <button  className="ce-btn"  onClick={cycleShadow}  title="Text shadow">
            <Icon icon="mdi:text-shadow" width={22} height={22}/>
            
          </button>
        </div>

        {/* Color & BG */}
        <div className="ce-group">
          <label className="ce-iconwrap" title="Text color">
            <Icon icon="mdi:format-color-text" width={22} height={22}/>
            <input
              className="ce-color"
              type="color"
              value={local.color || "#2E3A59"}
              onChange={(e) => update("color", e.target.value)}
            />
          </label>

          <label className="ce-iconwrap" title="Background color">
            <Icon icon="mdi:format-color-fill" width={22} height={22}/>
            <input
              className="ce-color"
              type="color"
              value={local.background || "#ffffff"}
              onChange={(e) => update("background", e.target.value)}
            />
          </label>
        </div>

        {/* Alignments */}
        <div className="ce-group">
          <button className={`ce-btn ${local.alignX === "left" ? "active" : ""}`} onClick={() => setAlignX("left")} title="Align left">
            <Icon icon="mdi:format-align-left" />
          </button>
          <button className={`ce-btn ${local.alignX === "center" ? "active" : ""}`} onClick={() => setAlignX("center")} title="Align center">
            <Icon icon="mdi:format-align-center" />
          </button>
          <button className={`ce-btn ${local.alignX === "right" ? "active" : ""}`} onClick={() => setAlignX("right")} title="Align right">
            <Icon icon="mdi:format-align-right" />
          </button>

          <div className="ce-divider" />

          <button className={`ce-btn ${local.alignY === "top" ? "active" : ""}`} onClick={() => setAlignY("top")} title="Align top">
            <Icon icon="mdi:align-vertical-top" />
          </button>
          <button className={`ce-btn ${local.alignY === "middle" ? "active" : ""}`} onClick={() => setAlignY("middle")} title="Align middle">
            <Icon icon="mdi:align-vertical-center" />
          </button>
          <button className={`ce-btn ${local.alignY === "bottom" ? "active" : ""}`} onClick={() => setAlignY("bottom")} title="Align bottom">
            <Icon icon="mdi:align-vertical-bottom" />
          </button>
        </div>

        {/* layout + radius */}
        <div className="ce-group">
          <button className={`ce-btn ${local.layoutMode === "stacked" ? "active" : ""}`} onClick={() => setLayout("stacked")} title="Stacked (title above)">
            <Icon icon="mdi:format-wrap-top-bottom" />
          </button>
          <button className={`ce-btn ${local.layoutMode === "inline" ? "active" : ""}`} onClick={() => setLayout("inline")} title="Inline (title beside)">
            <Icon icon="mdi:format-wrap-inline" />
          </button>

          <input
            type="number"
            className="ce-radius"
            title="Border radius px"
            min={0}
            max={60}
            value={parseInt(local.borderRadius || "0")}
            onChange={(e) => update("borderRadius", `${e.target.value}px`)}
          />
        </div>

        {/* right side: Save / Close */}
        <div className="ce-group ce-right">
          <button className="ce-btn secondary" onClick={() => { closeAllModals(); onClose?.(); }} title="Cancel">
            <Icon icon="mdi:close" />
          </button>
          <button className="ce-btn primary" onClick={handleSave} title="Save">
            <Icon icon="mdi:content-save" />
          </button>
        </div>
      </div>

      {/* Live preview (compact) 
      <div className="ce-preview" style={{
        background: local.background || "#fff",
        color: local.color || "#2E3A59",
        fontFamily: local.fontFamily,
        fontWeight: local.fontWeight,
        fontStyle: local.fontStyle,
        borderRadius: local.borderRadius || "0px",
        textShadow: local.textShadow || "none",
      }}>
         <div className="ce-preview-inner" style={{ flexDirection: local.layoutMode === "inline" ? "row" : "column" }}>
          <div className="ce-preview-title">Total DVDs</div>
          <div className="ce-preview-value">{formatPreviewValue(4581, local)}</div>
        </div> 
      </div>*/}
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