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

  const generateLayout = () => {
    return graphs.map((chart) => {
      const baseRows = Math.ceil((chart.height ?? 0) / 100);
      const rowCountForText = chart.type === "text" ? baseRows / 2 : baseRows;
      const colCount = chart.width ? Math.ceil(chart.width / 100) : 4;

      return {
        i: chart.code.toString(),
        x: chart.x || 0,
        y: chart.y || 0,
        w: colCount,
        h: rowCountForText,
        minW: 2,
        minH: 2,
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
    onUpdatePosition(Number(newItem.i), newItem.x, newItem.y, newItem.h, newItem.w);
  };

  const handleResizeStop = (
    layout: any,
    oldItem: any,
    newItem: any,
    _placeholder: any,
    _e: any,
    _element: any
  ) => {
    const newWidthPx = newItem.w * 100;
    const newHeightPx = newItem.h * 100;
    onUpdatePosition(Number(newItem.i), newItem.x, newItem.y, newItem.h, newItem.w);
    onResize(Number(newItem.i), newWidthPx, newHeightPx);
  };

  return (
    <div className="ai-chart">
      <ResponsiveReactGridLayout
        useCSSTransforms={true}
        className="layout"
        layouts={{ lg: generateLayout() }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={95}
        margin={[3, 3]}
        measureBeforeMount={false}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        isDraggable={!window.location.hash.startsWith("#/published")}
        isResizable={!window.location.hash.startsWith("#/published")}
        draggableCancel=".no-drag, .no-drag-download-icon, .action-wrappers, .text-toolbar, .no-drag-bold, .no-drag-italic, .no-drag-color, .text-area, .text-display, .rotation-control, .search-modal, .edit-zone, .edit-zone-button, .dynamic-card, button"
      >
        {graphs.map((chart) => {
          const baseRows = Math.ceil((chart.height ?? 0) / 100);
          const rowCountForText = chart.type === "text" ? baseRows / 2 : baseRows;
          const colCount = chart.width ? Math.ceil(chart.width / 100) : 4;
          
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