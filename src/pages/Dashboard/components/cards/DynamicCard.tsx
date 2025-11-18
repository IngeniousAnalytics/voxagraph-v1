import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { ICardData } from "src/types/cards";
import { IGraph } from "src/types";
import "./dynamicCard.scss";
import { openModal, closeAllModals } from "@mantine/modals";
import CardStyleEditor, { CardDesign } from "./CardStyleEditor";

interface DynamicCardProps {
  inputData: ICardData;
  setGraphs?: React.Dispatch<React.SetStateAction<IGraph[]>>;
  code?: number;
}

const DynamicCard: React.FC<DynamicCardProps> = ({ inputData, setGraphs, code }) => {
  // Unique localStorage key for persistence
  const localKey = `card_design_${code}`;
  /* inside component scope */
  

  const savedDesign = (() => {
    try {
      const stored = localStorage.getItem(localKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const [currentDesign, setCurrentDesign] = useState(savedDesign || inputData.design || {});

  // ✅ Sync design with localStorage
  useEffect(() => {
    if (code && currentDesign) {
      localStorage.setItem(localKey, JSON.stringify(currentDesign));
    }
  }, [code, currentDesign]);

  // ✅ Extract card display data
  const dataArray =
    Array.isArray(inputData?.data) && inputData.data.length > 0
      ? inputData.data
      : Array.isArray(inputData?.plot) && inputData.plot.length > 0
      ? inputData.plot
      : [];

  const record = dataArray.length > 0 ? dataArray[0] : null;
  const entries: [string, any][] = record ? Object.entries(record) : [];
  const [displayKey, displayValue] = entries.length > 0 ? entries[0] : ["No Data", "—"];

  // ✅ Format values safely
  const safeValue =
    typeof displayValue === "number"
      ? displayValue.toLocaleString()
      : typeof displayValue === "string"
      ? displayValue
      : "—";

  // ✅ Live style application helper
  const applyStyleToCard = (style: Record<string, any>) => {
    const card = document.getElementById(`card-${code}`);
    if (!card) return;
    Object.entries(style).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        (card.style as any)[key] = value;
      }
    });
  };
  // 🔧 Apply live styles directly to card DOM element
const applyDesignToDOM = (design: any) => {
  if (!code) return;

  const el = document.getElementById(`card-${code}`);
  if (!el) return;

  const {
    background,
    color,
    fontSize,
    fontWeight,
    fontStyle,
    fontFamily,
    textShadow,
    borderRadius,
    alignX,
    alignY,
  } = design;

  // Apply safe CSS
  el.style.background = background || "";
  el.style.color = color || "";
  el.style.fontSize = fontSize ? `${fontSize}px` : "";
  el.style.fontWeight = fontWeight || "";
  el.style.fontStyle = fontStyle || "";
  el.style.fontFamily = fontFamily || "";
  el.style.textShadow = textShadow || "";
  el.style.borderRadius = borderRadius || "0px";

  // Alignment (flexbox)
  el.style.display = "flex";
  el.style.flexDirection = "column";
  el.style.justifyContent =
    alignY === "top"
      ? "flex-start"
      : alignY === "bottom"
      ? "flex-end"
      : "center";

  el.style.alignItems =
    alignX === "left"
      ? "flex-start"
      : alignX === "right"
      ? "flex-end"
      : "center";
};
  // ✅ Handle design changes from modal
  const handleDesignChange = (newDesign: any) => {
    setCurrentDesign(newDesign);

    // Update card live
    applyStyleToCard({
      background: newDesign.background,
      color: newDesign.color,
      fontSize: `${newDesign.fontSize}px`,
      fontWeight: newDesign.fontWeight,
      fontStyle: newDesign.fontStyle,
      fontFamily: newDesign.fontFamily,
      textShadow: newDesign.textShadow,
    });

    // Update parent graphs
    if (setGraphs && code) {
      setGraphs((prev) =>
        prev.map((g) => (g.code === code ? { ...g, design: newDesign } : g))
      );
    }

    // Persist in localStorage
    if (code) localStorage.setItem(localKey, JSON.stringify(newDesign));
  };

// open modal to edit
const handleEdit = () => {
  openModal({
    title: null,
    size: "lg",
    withCloseButton: false,
    overlayProps: {
      blur: 2,
      opacity: 0.35,
    },
    children: (
      <CardStyleEditor
        design={currentDesign}
        onChange={(d) => {
          // immediate preview
          setCurrentDesign(d);
          applyDesignToDOM(d); // your existing function that applies style
        }}
        onSave={(d) => {
          // finalize: persist and update parent graphs
          setCurrentDesign(d);
          applyDesignToDOM(d);
          if (code && setGraphs) {
            setGraphs((prev) => prev.map((g) => (g.code === code ? { ...g, design: d } : g)));
          }
          localStorage.setItem(`card_design_${code}`, JSON.stringify(d));
          closeAllModals();
        }}
        onClose={() => closeAllModals()}
      />
    ),
  });
};


  // ✅ Extract style values
  const {
    color = "#2E3A59",
    background = "#FFFFFF",
    fontSize = 18,
    fontWeight = "bold",
    fontStyle = "normal",
    fontFamily = "Inter, sans-serif",
    textShadow = "none",
    alignX = "center",
    alignY = "middle",
  } = currentDesign;

  return (
    <div
      id={`card-${code}`}
      className="dynamic-card"
      style={{
        background,
       borderRadius: currentDesign.borderRadius || "0px",

        padding: "16px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            cursor: "default", // ✅ prevents hand cursor on the whole card

        userSelect: "none",
        color,
        fontFamily,
        display: "flex",
        justifyContent:
          alignX === "left" ? "flex-start" : alignX === "right" ? "flex-end" : "center",
        alignItems:
          alignY === "top" ? "flex-start" : alignY === "bottom" ? "flex-end" : "center",
        textAlign: alignX,
        height: "100%",
        position: "relative",
      }}
      title="Click ✏️ to edit"
     // onClick={setGraphs ? handleEdit : undefined} // ✅ single click opens modal
    >
      <div>
        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
          <h3
            style={{
              color,
              fontSize,
              fontWeight,
              fontStyle,
              textShadow,
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {inputData.title || displayKey}
          </h3>
        </div>

        {/* Value */}
        <div
          style={{
            fontSize: fontSize + 8,
            fontWeight,
            fontStyle,
            color,
            textShadow,
          }}
        >
          {safeValue}
        </div>
      </div>

    {setGraphs && (
    <div
        className="edit-zone"
        onClick={(e) => {
          e.stopPropagation();
          handleEdit();  // Direct, immediate call
        }}
        title="Click to edit"
    >
        <Icon icon="mdi:pencil" width={18} height={18} />

    </div>
    )}



    </div>
  );
};

export default DynamicCard;
