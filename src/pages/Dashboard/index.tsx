// import React from 'react';
// import { Responsive, WidthProvider, Layouts } from 'react-grid-layout';
// import 'react-grid-layout/css/styles.css';
// import 'react-resizable/css/styles.css';
// import DraggableChart from './components/DraggableChart';
// import { IDashboard } from 'src/types';
// import './index.scss';

// const ResponsiveGridLayout = WidthProvider(Responsive);

// const Dashboard: React.FC<IDashboard> = ({
//   graphs,
//   onUpdatePosition,
//   onResize,
//   onUpdateData,
//   onRefresh,
//   onDelete,
//   activeTab,
//   onChartColor,
//   publishedParams
// }) => {
//   const layouts: Layouts = {
//     lg: graphs.map(chart => ({
//       i: chart.code.toString(),
//       x: chart.x,
//       y: chart.y,
//       w: Math.ceil(chart.width / 100),
//       h: Math.ceil(chart.height / 100),
//       minW: 2,
//       minH: 2
//     }))
//   };

//   const handleLayoutChange = (currentLayout:any) => {
//     currentLayout.forEach((item: { i: any; x: number; y: number; w: number; h: number; }) => {
//       const code = Number(item.i);
//         const chart = graphs.find((g) => g.code == item.i);
//       // onUpdatePosition(code, item.x, item.y);
//       if (chart) {
//          onUpdatePosition(code, item.x, item.y, item.h, item.w)
//         };
//         onResize(code, item.w * 100, item.h * 100);

//     });
//   };

//   //  const handleLayoutChange = (layout: any) => {
//   //   layout.forEach((item: any) => {
//   //     const chart = graphs.find((g) => g.code == item.i);
//   //     if (chart) {
//   //       onUpdatePosition(Number(item.i), item.x, item.y, item.h, item.w);
//   //       // You might want to update width/height here if you want to track grid units
//   //       // Or keep the pixel dimensions and convert back and forth
//   //     }
//   //      onResize(item.i, item.w * 100, item.h * 100);
//   //   });
//   // };

//   return (
//     <ResponsiveGridLayout
//       className="layout"
//       layouts={layouts}
//       breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
//       cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
//       rowHeight={100}
//       margin={[16, 16]}
//       onLayoutChange={handleLayoutChange}
//       isResizable={true}
//       isDraggable={true}
//       preventCollision={true}
//       compactType="horizontal"
//       useCSSTransforms={true}
//       isDroppable={true}
//       draggableCancel=".no-drag, .action-wrappers, .search-modal, .react-grid-item > .card-widget, .react-grid-item > .chart-widget "

//     >
//       {graphs.map(chart => (
//         <div
//           key={chart.code}
//           data-grid={{
//             i: chart.code.toString(),
//             x: chart.x,
//             y: chart.y,
//             w: Math.ceil(chart.width / 100),
//             h: Math.ceil(chart.height / 100)
//           }}
//           className="react-grid-item"
//         >
//           <DraggableChart
//             {...chart}
//             onUpdatePosition={onUpdatePosition}
//             onUpdateData={onUpdateData}
//             onResize={onResize}
//             onRefresh={onRefresh}
//             onDelete={onDelete}
//             activeTab={activeTab}
//             onChartColor={onChartColor}
//             publishedParams={publishedParams}
//           />
//         </div>
//       ))}
//     </ResponsiveGridLayout>
//   );
// };

// export default Dashboard;

// import React, { useRef, useState } from 'react';
// import { Responsive, WidthProvider } from 'react-grid-layout';
// import { IDashboard } from 'src/types';
// import DraggableChart from './components/DraggableChart';
// import 'react-grid-layout/css/styles.css';
// import 'react-resizable/css/styles.css';
// import './index.scss';
// import TextEditor from './components/TextEditor';

// const ResponsiveReactGridLayout = WidthProvider(Responsive);

// const Dashboard: React.FC<IDashboard> = ({
//   graphs,
//   onUpdatePosition,
//   onUpdateData,
//   onResize,
//   onRefresh,
//   onDelete,
//   activeTab,
//   onChartColor,
//   publishedParams,
//   setGraphs,
// }) => {
//   const [charCode, setChartCode] = useState<any>(0);
//   const [textTiltedata, setTextTilteData] = useState<any>({});
//   const [isEditing, setIsEditing] = useState(false);
//   const hasMountedRef = useRef(false);
//   // const generateLayout = () => {

//   //   return graphs.map((chart) => ({
//   //     i: chart.code.toString(), // Unique identifier for each item as a string
//   //     x: chart.x || 0, // x position in grid units
//   //     y: chart.y || 0, // y position in grid units
//   //     w: chart.width ? Math.ceil(chart.width / 100) : 4,
//   //     h: chart.width ? chart.type==="text"?(Math.ceil(chart.height / 100)/2): Math.ceil(chart.height / 100) : 4,
//   //     type: chart.type,
//   //     minW: 2, // minimum width
//   //     minH: 2, // minimum height
//   //     isResizable: !window.location.hash.startsWith('#/published'), // disable resizing for published dashboards
//   //   }));
//   // };


//   // Dashboard.tsx

// const generateLayout = () => {
//   return graphs.map((chart) => {
//     const baseRows = Math.ceil(chart.height / 100);

//     // If it's a "text" widget, we want half as many rows, but force at least 1
//     const rowCountForText = Math.ceil(baseRows / 2);

//     return {
//       i: chart.code.toString(),
//       x: chart.x || 0,
//       y: chart.y || 0,
//       w: chart.width ? Math.ceil(chart.width / 100) : 4,
//       h: chart.type === "text" ? rowCountForText : baseRows,
//       minW: 2,
//       minH: 2,
//       isResizable: !window.location.hash.startsWith("#/published"),
//     };
//   });
// };

// console.log('graphs', generateLayout());

//   const handleLayoutChange = (layout: any) => {
//     if (!hasMountedRef.current) {
//       hasMountedRef.current = true;
//       return;
//     }


//     layout.forEach((item: any) => {
//       const chart = graphs.find((g) => g.code == item.i);
//       if (chart) {
//         onUpdatePosition(item.i, item.x, item.y, item.h, item.w);
//         console.log('onResize', item.i, item.w * 100, item.h * 100);
//       }

//       onResize(item.i, item.w * 100, item.h * 100);
//     });
//   };

//   return (
//     <div className="ai-chart">
//       <ResponsiveReactGridLayout
//         useCSSTransforms={true}
//         className="layout"
//         layouts={{ lg: generateLayout() }}
//         breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
//         cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
//         rowHeight={95}
//         margin={[3, 3]}
//         measureBeforeMount={false}
//         onLayoutChange={handleLayoutChange}
//         isDraggable={!window.location.hash.startsWith('#/published')}
//         isResizable={!window.location.hash.startsWith('#/published')}
//         draggableCancel=".no-drag, .no-drag-download-icon, .action-wrappers, .text-toolbar, .no-drag-bold, .no-drag-italic, .no-drag-color,.text-area, .text-display, .rotation-control, .search-modal, .react-grid-item > .card-widget, .react-grid-item > .chart-widget "
//       >
//         {/* {graphs.map((chart) => (
//           <div
//             key={chart.code}
//             data-grid={{
//               i: chart.code.toString(),
//               x: chart.x,
//               y: chart.y,
//               w: Math.ceil(chart.width / 100),
//               h: chart.type==="text"?(Math.ceil(chart.height / 100)/2):Math.ceil(chart.height / 100),
//             }}
//             className={`react-grid-item ${
//               chart.type == 'text' ? 'react-grid-text' : ''
//             }`}
//           >
//             <DraggableChart
//               {...chart}
//               onUpdatePosition={onUpdatePosition}
//               onUpdateData={onUpdateData}
//               onResize={onResize}
//               onRefresh={onRefresh}
//               onDelete={onDelete}
//               activeTab={activeTab}
//               onChartColor={onChartColor}
//               publishedParams={publishedParams}
//               setGraphs={setGraphs}
//               setChartCode={setChartCode}
//               setTextTilteData={setTextTilteData}
//               setIsEditing={setIsEditing}
//               isEditing={isEditing}
//               charCode={charCode}
//               // Remove x, y, width, height from DraggableChart since they're now handled by the grid
//             />
//           </div>
//         ))} */}
//          {graphs.map((chart) => {
//     // Compute the same h exactly as generateLayout() did above:
//     const baseRows = Math.ceil(chart.height / 100);
//     const rowCountForText = chart.type === "text" ? baseRows / 2 : baseRows;

//     // Compute w exactly the same as in generateLayout()
//     const colCount = chart.width ? Math.ceil(chart.width / 100) : 4;

//     return (
//       <div
//         key={chart.code}
//         data-grid={{
//           i: chart.code.toString(), 
//           x: chart.x,
//           y: chart.y,
//           w: colCount,
//           h: rowCountForText,
//         }}
//         className={`react-grid-item ${chart.type === "text" ? "react-grid-text" : ""}`}
//       >
//         <DraggableChart
//           {...chart}
//           onUpdatePosition={onUpdatePosition}
//           onUpdateData={onUpdateData}
//           onResize={onResize}
//           onRefresh={onRefresh}
//           onDelete={onDelete}
//           activeTab={activeTab}
//           onChartColor={onChartColor}
//           publishedParams={publishedParams}
//           setGraphs={setGraphs}
//           setChartCode={setChartCode}
//           setTextTilteData={setTextTilteData}
//           setIsEditing={setIsEditing}
//           isEditing={isEditing}
//           charCode={charCode}
//         />
//       </div>
//     );
//   })}
//       </ResponsiveReactGridLayout>
//       <>
//         {/* <TextEditor
        
//       /> */}
//       </>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { IDashboard } from "src/types";
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
  // Any existing local state you still need:
  const [charCode, setChartCode] = useState<number>(0);
  const [textTiltedata, setTextTilteData] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);

  // 1️⃣ Generate “layouts” exactly once per render.
  //    Make absolutely sure this uses the *same* math as `data-grid` below.
  const generateLayout = () => {
    return graphs.map((chart) => {
      // Round up to whole “grid-rows” of 100px.
      const baseRows = Math.ceil((chart.height ?? 0) / 100);
      // If type==="text", we want half as many rows, but at least 1.
      const rowCountForText =
        chart.type === "text" ?baseRows / 2 : baseRows;

      // Round up to whole “grid-cols” of 100px.
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

  // 2️⃣ Instead of onLayoutChange, use onDragStop + onResizeStop:
  const handleDragStop = (
    layout: any[],
    oldItem: any,
    newItem: any,
    placeholder: any,
    _e: any,
    _element: any
  ) => {
    // newItem has { i, x, y, w, h }. We only changed x/y on drag.
    // Update your state so `graphs[code].x = newItem.x, graphs[code].y = newItem.y`.
    onUpdatePosition(newItem.i, newItem.x, newItem.y, newItem.h, newItem.w);
  };

  const handleResizeStop = (
    layout: any[],
    oldItem: any,
    newItem: any,
    _placeholder: any,
    _e: any,
    _element: any
  ) => {
    // newItem has { i, x, y, w, h }. We only changed w/h on resize.
    // Compute actual pixel width/height from w/h:
    const newWidthPx = newItem.w * 100;
    const newHeightPx = newItem.h * 100;

    onUpdatePosition(newItem.i, newItem.x, newItem.y, newItem.h, newItem.w);
    onResize(newItem.i, newWidthPx, newHeightPx);
  };

  return (
    <div className="ai-chart">
      <ResponsiveReactGridLayout
        useCSSTransforms={true}
        className="layout"
        // Pass the layout we computed above. RGL will NOT fire onDragStop/onResizeStop
        // except when the user actually drags/resizes.
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
        draggableCancel=".no-drag,.no-drag-download-icon, .action-wrappers, .text-toolbar, .no-drag-bold, .no-drag-italic, .no-drag-color,.text-area, .text-display, .rotation-control, .search-modal, .react-grid-item > .card-widget, .react-grid-item > .chart-widget"
        // .no-drag-graph,
    >
        {graphs.map((chart) => {
          // **Make sure this matches `generateLayout()` exactly:**
          const baseRows = Math.ceil((chart.height ?? 0) / 100);
          const rowCountForText =
            chart.type === "text" ? baseRows / 2 : baseRows;
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
                setTextTilteData={setTextTilteData}
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

