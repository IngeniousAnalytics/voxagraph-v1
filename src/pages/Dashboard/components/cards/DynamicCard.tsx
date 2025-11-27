// src/pages/Dashboard/components/cards/DynamicCard.tsx
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Popover } from "@mantine/core";
import { ICardData } from "../../../../types/cards";
import { IGraph } from "../../../../types";
import CardStyleEditor from "./CardStyleEditor";
import attachResizable from "./resizer";
import "./dynamicCard.scss";

/**
 * Updated to use a popover launcher and a fixed 420px "Figma-style" vertical panel.
 * Popover opens the vertical panel (withinPortal) which is draggable via the ribbon in CardStyleEditor.
 */

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

  const [currentDesign, setCurrentDesign] = useState<any>(savedDesign || inputData.design || {});
  const [opened, setOpened] = useState(false);

  const {
    color = "#2E3A59",
    background = "#FFFFFF",
    fontSize = 18,
    fontWeight = "700",
    fontStyle = "normal",
    fontFamily = "Inter, sans-serif",
    textShadow = "none",
    borderRadius = "8px",
    alignX = "center",
    alignY = "middle",
  } = currentDesign || {};

  const dataArray =
    Array.isArray(inputData?.data) && inputData.data.length > 0
      ? inputData.data
      : Array.isArray(inputData?.plot) && inputData.plot.length > 0
      ? inputData.plot
      : [];

  const record = dataArray.length > 0 ? dataArray[0] : null;
  const entries: [string, unknown][] = record ? Object.entries(record) : [];
  const [displayKey, displayValue] = entries.length > 0 ? entries[0] : ["No Data", "—"];

  const safeValue =
    typeof displayValue === "number"
      ? displayValue.toLocaleString()
      : typeof displayValue === "string"
      ? displayValue
      : "—";

  useEffect(() => {
    const el = document.getElementById(`card-${code}`);
    if (!el) return;
    const cleanup = attachResizable(el);
    return () => cleanup();
  }, [code]);

  return (
    <div
      id={`card-${code}`}
      className="dynamic-card"
      style={{
        background,
        borderRadius,
        padding: "16px",
        boxShadow: "0 6px 20px rgba(20,24,32,0.06)",
        cursor: "default",
        userSelect: "none",
        color,
        fontFamily,
        display: "flex",
        flexDirection: "column",
        /* For a column layout: justifyContent controls vertical alignment, alignItems controls horizontal */
        justifyContent:
          alignY === "top" ? "flex-start" : alignY === "bottom" ? "flex-end" : "center",
        alignItems:
          alignX === "left" ? "flex-start" : alignX === "right" ? "flex-end" : "center",
        height: "60%",
        position: "relative",
        minHeight: 80,
      }}
    >
      <div >
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

        <div
          style={{
            fontSize: (fontSize || 18) + 8,
            fontWeight,
            fontStyle,
            color,
            textShadow,
            marginTop: 6,
            lineHeight: 1,
          }}
        >
          {safeValue}
        </div>
      </div>

      {/* Edit launcher: Popover opens a fixed vertical panel (420px) */}
      <Popover
        opened={opened}
        onChange={setOpened}
        position="bottom-end"
        width={420}
        withArrow={false}
        withinPortal
        trapFocus={false}
        closeOnEscape
      >
        <Popover.Target>
          <div
            className="edit-icon"
            role="button"
            aria-label="Edit card style"
            onClick={(e) => {
              e.stopPropagation();
              setOpened((o) => !o);
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Icon icon="mdi:pencil" width={16} height={16} />
          </div>
        </Popover.Target>

        <Popover.Dropdown className="figma-panel-container" style={{ padding: 0, boxShadow: "none" }}>
          {/* We render the editor inside a fixed-width vertical panel styled like a Figma inspector.
              The CardStyleEditor contains the drag behaviour; the top ribbon is the draggable handle.
              The panel itself is not scrollable (S2) — content was compacted to avoid inner scroll. */}
          <div className="figma-panel" role="dialog" aria-label="Card Style Panel">
            <CardStyleEditor
              design={currentDesign}
              onChange={(d) => {
                console.log('DynamicCard: onChange', d);
                setCurrentDesign(d);
                if (code && setGraphs) {
                  setGraphs((prev) => prev.map((g) => 
                    g.code === code 
                      ? { ...g, data: { ...g.data, design: d } } 
                      : g
                  ));
                }
              }}
              onSave={(d) => {
                console.log('DynamicCard: onSave', d);
                setCurrentDesign(d);
                if (code && setGraphs) {
                  setGraphs((prev) => prev.map((g) => 
                    g.code === code 
                      ? { ...g, data: { ...g.data, design: d } } 
                      : g
                  ));
                }
                localStorage.setItem(localKey, JSON.stringify(d));
                setOpened(false);
              }}
              onClose={() => setOpened(false)}
            />
          </div>
        </Popover.Dropdown>
      </Popover>
    </div>
  );
};

export default DynamicCard;


