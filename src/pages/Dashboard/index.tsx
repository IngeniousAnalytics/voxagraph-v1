import React, { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { IDashboard } from "../../types";
import DraggableChart from "./components/DraggableChart";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./index.scss";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Dashboard: React.FC<IDashboard> = ({
  graphs,
  onUpdatePosition,
  onUpdateData,
  onResize,
  onRefresh,
  onDelete,
  activeTab,
  onChartColor,
  publishedParams,
  setGraphs,
}) => {
  const [charCode, setChartCode] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);

  // Grid sizing constants (px per grid unit) - Changed to 5px for smooth resizing
  const COL_PX = 5;
  const ROW_PX = 5; // matches `rowHeight` passed to RGL below

  const generateLayout = () => {
    return graphs.map((chart) => {
      const baseRows = Math.ceil((chart.height ?? 0) / ROW_PX);
      // Remove the division by 2 for text charts to enable smooth 5px resizing
      const rowCountForText = baseRows; // Changed from: chart.type === "text" ? baseRows / 2 : baseRows
      const colCount = chart.width ? Math.ceil(chart.width / COL_PX) : 4;

      return {
        i: chart.code.toString(),
        x: chart.x || 0,
        y: chart.y || 0,
        w: colCount,
        h: rowCountForText,
        minW: 2, // 2 * 5px = 10px minimum width
        minH: 2, // 2 * 5px = 10px minimum height
        isResizable: !window.location.hash.startsWith("#/published"),
      };
    });
  };
  
  const handleDragStop = (
    layout: any,
    oldItem: any,
    newItem: any,
    placeholder: any,
    _e: any,
    _element: any
  ) => {
    // Convert grid units to pixels for persistence
    const pxWidth = newItem.w * COL_PX;
    const pxHeight = newItem.h * ROW_PX; // Already in full grid units, no need to multiply by 2
    onUpdatePosition(Number(newItem.i), newItem.x, newItem.y, pxHeight, pxWidth);
    // also notify onResize consumers of the pixel dimensions
    onResize(Number(newItem.i), pxWidth, pxHeight);
  };

  const handleResizeStop = (
    layout: any,
    oldItem: any,
    newItem: any,
    _placeholder: any,
    _e: any,
    _element: any
  ) => {
    const newWidthPx = newItem.w * COL_PX;
    const newHeightPx = newItem.h * ROW_PX; // Already in full grid units
    // Persist pixel sizes to graphs so DraggableChart receives updated props
    onUpdatePosition(Number(newItem.i), newItem.x, newItem.y, newHeightPx, newWidthPx);
    onResize(Number(newItem.i), newWidthPx, newHeightPx);
  };

  return (
    <div className="ai-chart">
      <ResponsiveReactGridLayout
        useCSSTransforms={true}
        className="layout"
        layouts={{ lg: generateLayout() }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ 
          lg: 240,  // 1200px / 5px = 240 columns
          md: 200,  // 996px / 5px ≈ 200 columns
          sm: 154,  // 768px / 5px ≈ 154 columns
          xs: 96,   // 480px / 5px = 96 columns
          xxs: 2    // Keep minimal for very small screens
        }}
        rowHeight={ROW_PX}
        margin={[3, 3]}
        measureBeforeMount={false}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        isDraggable={!window.location.hash.startsWith("#/published")}
        isResizable={!window.location.hash.startsWith("#/published")}
        draggableCancel=".no-drag, .no-drag-download-icon, .action-wrappers, .text-toolbar, .no-drag-bold, .no-drag-italic, .no-drag-color, .text-area, .text-display, .rotation-control, .search-modal, .edit-zone, .edit-zone-button, .dynamic-card, button"
      >
        {graphs.map((chart) => {
          const baseRows = Math.ceil((chart.height ?? 0) / ROW_PX);
          // Remove the division by 2 for text charts
          const rowCountForText = baseRows; // Changed from: chart.type === "text" ? baseRows / 2 : baseRows
          const colCount = chart.width ? Math.ceil(chart.width / COL_PX) : 4;
          
          return (
            <div
              key={chart.code}
              data-grid={{
                i: chart.code.toString(),
                x: chart.x,
                y: chart.y,
                w: colCount,
                h: rowCountForText,
              }}
              className={`react-grid-item ${
                chart.type === "text" ? "react-grid-text" : ""
              }`}
            >
              <DraggableChart
                {...chart}
                onUpdatePosition={onUpdatePosition}
                onUpdateData={onUpdateData}
                onResize={onResize}
                onRefresh={onRefresh}
                onDelete={onDelete}
                activeTab={activeTab}
                onChartColor={onChartColor}
                publishedParams={publishedParams}
                setGraphs={setGraphs}
                setChartCode={setChartCode}
                setIsEditing={setIsEditing}
                isEditing={isEditing}
                charCode={charCode}
              />
            </div>
          );
        })}
      </ResponsiveReactGridLayout>
    </div>
  );
};

export default Dashboard;