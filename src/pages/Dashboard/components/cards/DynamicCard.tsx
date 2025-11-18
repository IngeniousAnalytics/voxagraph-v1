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
  const localKey = `card_design_${code}`;

  const savedDesign = (() => {
    try {
      const stored = localStorage.getItem(localKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const [currentDesign, setCurrentDesign] = useState(savedDesign || inputData.design || {});

  useEffect(() => {
    if (code && currentDesign) {
      localStorage.setItem(localKey, JSON.stringify(currentDesign));
    }
  }, [code, currentDesign]);

  const dataArray =
    Array.isArray(inputData?.data) && inputData.data.length > 0
      ? inputData.data
      : Array.isArray(inputData?.plot) && inputData.plot.length > 0
      ? inputData.plot
      : [];

  const record = dataArray.length > 0 ? dataArray[0] : null;
  const entries: [string, any][] = record ? Object.entries(record) : [];
  const [displayKey, displayValue] = entries.length > 0 ? entries[0] : ["No Data", "—"];

  const safeValue =
    typeof displayValue === "number"
      ? displayValue.toLocaleString()
      : typeof displayValue === "string"
      ? displayValue
      : "—";

  const handleEdit = () => {
    console.log('handleEdit called'); // Debug log
    
    openModal({
  title: null,
  size: "lg",
  withCloseButton: false,
  classNames: {
  content: "draggable-modal-content"
},
  overlayProps: {
    blur: 2,
    opacity: 0.35,
  },
  children: (
    <CardStyleEditor
      design={currentDesign}
      onChange={(d) => {
        setCurrentDesign(d);
        if (code && setGraphs) {
          setGraphs((prev) =>
            prev.map((g) => (g.code === code ? { ...g, design: d } : g))
          );
        }
      }}
      onSave={(d) => {
        setCurrentDesign(d);
        if (code && setGraphs) {
          setGraphs((prev) =>
            prev.map((g) => (g.code === code ? { ...g, design: d } : g))
          );
        }
        localStorage.setItem(localKey, JSON.stringify(d));
        closeAllModals();
      }}
      onClose={() => closeAllModals()}
    />
  ),
});

  };

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
        cursor: "default",
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
    >
      <div>
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
          className="edit-zone-button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Edit button clicked!'); // Debug log
            handleEdit();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 999999,
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#333',
            transition: 'all 0.2s ease',
            userSelect: 'none',
            pointerEvents: 'auto'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Icon icon="mdi:pencil" width={16} height={16} />
          
        </div>
      )}
    </div>
  );
};

export default DynamicCard;