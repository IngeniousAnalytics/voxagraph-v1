// import React, { useRef, useState } from 'react';
// import { FiDownload } from 'react-icons/fi';
// import { parseChartData } from 'src/utils';
// import * as XLSX from 'xlsx';
// import '../styles/tableWidget.scss';
// import { TextInput } from '@mantine/core';
// import { IGraph } from 'src/types';

// const TableWidget = ({
//   inputData,
//   type,
//   setGraphs,
//   code,
//   isChartTitleChange,
//   setIsChartTitleChange,
// }: any) => {
//   const [tableHeaderColor, setTableHeaderColor] = useState(
//     inputData?.tableHeaderColor || '#008000'
//   );
//   const parsedData = parseChartData(
//     inputData?.plot,
//     isChartTitleChange ? '' : inputData?.title,
//     type
//   );

//   const titleInputRef = useRef<HTMLInputElement>(null);
//   const updateGraphTitle = (value: any) => {
//     setGraphs((prevGraphs: IGraph[]) =>
//       prevGraphs.map((graph) =>
//         graph.code === code
//           ? {
//               ...graph,
//               data: {
//                 ...graph.data,
//                 title: value,
//               },
//             }
//           : graph
//       )
//     );
//   };

//   const formatType = (type: string) => {
//     return type
//       ? type
//           .replace(/([a-z])([A-Z])/g, '$1 $2')
//           .replace(/\b\w/g, (char) => char.toUpperCase())
//       : '';
//   };

//   if (inputData?.plot?.length === 0 && !inputData.title) {
//     return (
//       <div className="empty-msg">
//         Search for a suitable Question or SQL Query to plot the{' '}
//         <strong>{formatType(type)}</strong> chart.
//       </div>
//     );
//   }
//   if (!parsedData.isCompatible) {
//     return (
//       <div>This graph is not compatible with the data you are querying</div>
//     );
//   }

//   if (parsedData.rawData) {
//     const raw = parsedData.rawData;

//     const columns = Array.from(
//       new Set(raw.flatMap((row: any) => Object.keys(row)))
//     );

//     const prettify = (col: string) => col.replace(/_/g, ' ').toUpperCase();

//     const buildAoA = () => {
//       const headerRow = columns.map((col) => prettify(col));
//       const dataRows = raw.map((row: any) =>
//         columns.map((col) => {
//           // if some row doesn't have that key, fall back to empty string or whatever:
//           return row[col] != null ? row[col] : '';
//         })
//       );

//       return [headerRow, ...dataRows];
//     };

//     const downloadExcel = () => {
//       const aoa = buildAoA();
//       const worksheet = XLSX.utils.aoa_to_sheet(aoa);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

//       // Derive a filename from the (prettified) title, or fallback:
//       const filename =
//         (parsedData.title || 'table-data').replace(/\s+/g, '_') + '.xlsx';

//       XLSX.writeFile(workbook, filename);
//     };

//     const handleTableHeaderColor = (color: any) => {
//       setTableHeaderColor(color);
//       setGraphs((prevGraphs: IGraph[]) =>
//         prevGraphs.map((graph) =>
//           graph.code === code
//             ? {
//                 ...graph,
//                 data: {
//                   ...graph.data,
//                   tableHeaderColor: color,
//                 },
//               }
//             : graph
//         )
//       );
//     };

//     return (
//       <div className="table-wrapper">
//         <div className="table-header">
//           {isChartTitleChange && (
//             <TextInput
//               placeholder="Enter chart title"
//               value={inputData.title}
//               onChange={(e) => updateGraphTitle(e.target.value)}
//               style={{ marginTop: '10px', width: 250 }}
//               ref={titleInputRef}
//               onBlur={() => setIsChartTitleChange(false)}
//             />
//           )}
//           <h3 className="table-title">{parsedData.title}</h3>
//           <div className="tb-widget-color-down">
//             <input
//               type="color"
//               className="no-drag-color"
//               value={tableHeaderColor}
//               onChange={(e) => handleTableHeaderColor(e.target.value)}
//               style={{ height: 20, width: 20 }}
//             />
//             <FiDownload
//               onClick={downloadExcel}
//               className="no-drag-download-icon"
//               color="#008000"
//               size={20}
//             />
//           </div>
//         </div>
//         <div className="table-scroll-container">
//           <table className="custom-chart-table">
//             <thead
//               style={{
//                 background: inputData?.tableHeaderColor
//                   ? inputData?.tableHeaderColor
//                   : '#008000',
//               }}
//             >
//               <tr>
//                 {columns.map((col: any) => (
//                   <th key={col}>{prettify(col)}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {raw.map((row: any, idx: any) => (
//                 <tr key={idx}>
//                   {columns.map((col: any) => (
//                     <td key={col}>{row[col]}</td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   }

//   return null;
// };

// export default TableWidget;

// import React, { useEffect, useRef, useState } from 'react';
// import { FiDownload } from 'react-icons/fi';
// import { parseChartData } from 'src/utils';
// import * as XLSX from 'xlsx';
// import '../styles/tableWidget.scss';
// import { TextInput } from '@mantine/core';
// import { IGraph } from 'src/types';
// import { FixedSizeList as List } from 'react-window';

// const TableWidget = ({
//   inputData,
//   type,
//   setGraphs,
//   code,
//   isChartTitleChange,
//   setIsChartTitleChange,
// }: any) => {
//   const [tableHeaderColor, setTableHeaderColor] = useState(
//     inputData?.tableHeaderColor || '#008000'
//   );
//   const parsedData = parseChartData(
//     inputData?.plot,
//     isChartTitleChange ? '' : inputData?.title,
//     type
//   );

//   const titleInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (isChartTitleChange && titleInputRef.current) {
//       titleInputRef.current.focus();
//     }
//   }, [isChartTitleChange]);

//   const updateGraphTitle = (value: any) => {
//     setGraphs((prevGraphs: IGraph[]) =>
//       prevGraphs.map((graph) =>
//         graph.code === code
//           ? {
//               ...graph,
//               data: {
//                 ...graph.data,
//                 title: value,
//               },
//             }
//           : graph
//       )
//     );
//   };

//   const formatType = (type: string) => {
//     return type
//       ? type
//           .replace(/([a-z])([A-Z])/g, '$1 $2')
//           .replace(/\b\w/g, (char) => char.toUpperCase())
//       : '';
//   };

//   if (inputData?.plot?.length === 0 && !inputData.title) {
//     return (
//       <div className="empty-msg">
//         Search for a suitable Question or SQL Query to plot the{' '}
//         <strong>{formatType(type)}</strong> chart.
//       </div>
//     );
//   }
//   if (!parsedData.isCompatible) {
//     return (
//       <div>This graph is not compatible with the data you are querying</div>
//     );
//   }

//   if (parsedData.rawData) {
//     const raw = parsedData.rawData;

//     const columns = Array.from(
//       new Set(raw.flatMap((row: any) => Object.keys(row)))
//     );

//     const prettify = (col: string) => col.replace(/_/g, ' ').toUpperCase();

//     const buildAoA = () => {
//       const headerRow = columns.map((col) => prettify(col));
//       const dataRows = raw.map((row: any) =>
//         columns.map((col) => {
//           // if some row doesn't have that key, fall back to empty string or whatever:
//           return row[col] != null ? row[col] : '';
//         })
//       );

//       return [headerRow, ...dataRows];
//     };

//     const downloadExcel = () => {
//       const aoa = buildAoA();
//       const worksheet = XLSX.utils.aoa_to_sheet(aoa);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

//       // Derive a filename from the (prettified) title, or fallback:
//       const filename =
//         (parsedData.title || 'table-data').replace(/\s+/g, '_') + '.xlsx';

//       XLSX.writeFile(workbook, filename);
//     };

//     console.log('raw', raw);
//     const handleTableHeaderColor = (color: any) => {
//       setTableHeaderColor(color);
//       setGraphs((prevGraphs: IGraph[]) =>
//         prevGraphs.map((graph) =>
//           graph.code === code
//             ? {
//                 ...graph,
//                 data: {
//                   ...graph.data,
//                   tableHeaderColor: color,
//                 },
//               }
//             : graph
//         )
//       );
//     };

//     const Row = ({ index, style, data }: any) => {
//       const rowdata = data[index];
//       return (
//         <div
//           style={{
//             ...style,
//             display: 'flex',
//             borderBottom: '1px solid #ccc',
//             padding: '8px',
//           }}
//         >
//           {columns.map((col, idx) => (
//             <div
//               key={idx}
//               style={{
//                 width: 'auto',
//                 flex: 1,
//                 padding: '0 8px',
//                 textAlign: 'center',
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis',
//               }}
//             >
//               {rowdata[col] !== undefined ? rowdata[col] : ''}
//             </div>
//           ))}
//         </div>
//       );
//     };

//     return (
//       // <div className="table-wrapper">
//       //   <div className="table-header">
//       //     {isChartTitleChange && (
//       //       <TextInput
//       //         placeholder="Enter chart title"
//       //         value={inputData.title}
//       //         onChange={(e) => updateGraphTitle(e.target.value)}
//       //         style={{ marginTop: '10px', width: 250 }}
//       //         ref={titleInputRef}
//       //         onBlur={() => setIsChartTitleChange(false)}
//       //       />
//       //     )}
//       //     <h3 className="table-title">{parsedData.title}</h3>
//       //     <div className="tb-widget-color-down">
//       //       <input
//       //         type="color"
//       //         className="no-drag-color"
//       //         value={tableHeaderColor}
//       //         onChange={(e) => handleTableHeaderColor(e.target.value)}
//       //         style={{ height: 20, width: 20 }}
//       //       />
//       //       <FiDownload
//       //         onClick={downloadExcel}
//       //         className="no-drag-download-icon"
//       //         color="#008000"
//       //         size={20}
//       //       />
//       //     </div>
//       //   </div>
//       //   <div className="table-scroll-container">
//       //     <table className="custom-chart-table">
//       //       <thead
//       //         style={{
//       //           background: inputData?.tableHeaderColor
//       //             ? inputData?.tableHeaderColor
//       //             : '#008000',
//       //         }}
//       //       >
//       //         <tr>
//       //           {columns.map((col: any) => (
//       //             <th key={col}>{prettify(col)}</th>
//       //           ))}
//       //         </tr>
//       //       </thead>
//       //       <tbody>
//       //         {raw.map((row: any, idx: any) => (
//       //           <tr key={idx}>
//       //             {columns.map((col: any) => (
//       //               <td key={col}>{row[col]}</td>
//       //             ))}
//       //           </tr>
//       //         ))}
//       //       </tbody>
//       //     </table>
//       //   </div>
//       // </div>
//       // --------------------------------//
//       <div className="table-wrapper">
//         <div className="table-header">
//           {isChartTitleChange && (
//             <TextInput
//               placeholder="Enter chart title"
//               value={inputData.title}
//               onChange={(e) => updateGraphTitle(e.target.value)}
//               style={{ marginTop: '10px', width: 250 }}
//               ref={titleInputRef}
//               onBlur={() => setIsChartTitleChange(false)}
//             />
//           )}
//           <h3 className="table-title">{parsedData.title}</h3>
//           <div className="tb-widget-color-down">
//             <input
//               type="color"
//               className="no-drag-color"
//               value={tableHeaderColor}
//               onChange={(e) => handleTableHeaderColor(e.target.value)}
//               style={{ height: 20, width: 20 }}
//             />
//             <FiDownload
//               onClick={downloadExcel}
//               className="no-drag-download-icon"
//               color="#008000"
//               size={20}
//             />
//           </div>
//         </div>
//         <div style={{ width: '100%' }}>
//           <div
//             style={{
//               display: 'flex',
//               fontWeight: 'bold',
//               padding: '8px',
//               background: '#f0f0f0',
//             }}
//           >
//             {columns.map((col: any) => (
//               <div
//                 style={{
//                   width: 'auto',
//                   flex: 1,
//                   background: inputData?.tableHeaderColor
//                     ? inputData?.tableHeaderColor
//                     : '#008000',
//                   color: 'white',
//                   textAlign: 'center',
//                 }}
//                 key={col}
//               >
//                 {prettify(col)}
//               </div>
//             ))}
//           </div>

//           {/* Virtualized list */}
//           <List
//             height={300}
//             itemCount={raw.length}
//             itemSize={50}
//             width="100%"
//             itemData={raw}
//           >
//             {Row}
//           </List>
//         </div>
//       </div>
//     );
//   }

//   return null;
// };

// export default TableWidget;

// import React, { useEffect, useRef, useState, useMemo } from 'react';
// import { FiDownload } from 'react-icons/fi';
// import { parseChartData } from 'src/utils';
// import * as XLSX from 'xlsx';
// import '../styles/tableWidget.scss';
// import { TextInput } from '@mantine/core';
// import { IGraph } from 'src/types';
// import AutoSizer from 'react-virtualized-auto-sizer';
// import { VariableSizeGrid as Grid } from 'react-window';

// // Approximate metrics — tweak to match your font
// const CHAR_WIDTH = 12;
// const LINE_HEIGHT = 20;
// const CELL_H_PADDING = 16;
// const CELL_V_PADDING = 12;
// const HEADER_HEIGHT = 40;

// const TableWidget = ({
//   inputData,
//   type,
//   setGraphs,
//   code,
//   isChartTitleChange,
//   setIsChartTitleChange,
// }: any) => {
//   // 1. Parse
//   const parsedData = parseChartData(
//     inputData?.plot,
//     isChartTitleChange ? '' : inputData?.title,
//     type
//   );

//   const raw: any[] = parsedData.rawData || [];

//   // 2. Derive columns
//   const columns = useMemo(
//     () => Array.from(new Set(raw.flatMap((r) => Object.keys(r)))),
//     [raw]
//   );
//   const prettify = (col: string) => col.replace(/_/g, ' ').toUpperCase();

//   // 3. Excel helpers
//   const buildAoA = useMemo(() => {
//     const header = columns.map(prettify);
//     const dataRows = raw.map((row) => columns.map((c) => row[c] ?? ''));
//     return [header, ...dataRows];
//   }, [columns, raw]);

//   const downloadExcel = () => {
//     const ws = XLSX.utils.aoa_to_sheet(buildAoA);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//     const fname =
//       (parsedData.title || 'table-data').replace(/\s+/g, '_') + '.xlsx';
//     XLSX.writeFile(wb, fname);
//   };

//   // 4. Column widths
//   const columnWidths = useMemo(
//     () =>
//       columns.map((col) => {
//         const headerLen = prettify(col).length;
//         const maxLen = raw.reduce(
//           (m, r) => Math.max(m, String(r[col] ?? '').length),
//           headerLen
//         );
//         return maxLen * CHAR_WIDTH + CELL_H_PADDING;
//       }),
//     [columns, raw]
//   );

//   // 5. Data row heights
//   const dataRowHeights = useMemo(
//     () =>
//       raw.map((row) => {
//         const lines = columns.map((col, i) => {
//           const text = String(row[col] ?? '');
//           const contentWidth = columnWidths[i] - CELL_H_PADDING;
//           const charsPerLine = Math.max(
//             1,
//             Math.floor(contentWidth / CHAR_WIDTH)
//           );
//           return Math.ceil(text.length / charsPerLine);
//         });
//         const numLines = Math.max(1, ...lines);
//         return numLines * LINE_HEIGHT + CELL_V_PADDING;
//       }),
//     [raw, columns, columnWidths]
//   );

//   // Combine header + data row heights
//   const rowHeights = useMemo(
//     () => [HEADER_HEIGHT, ...dataRowHeights],
//     [dataRowHeights]
//   );

//   // 6. Header & title logic
//   const [tableHeaderColor, setTableHeaderColor] = useState(
//     inputData?.tableHeaderColor || '#008000'
//   );
//   const titleInputRef = useRef<HTMLInputElement>(null);
//   useEffect(() => {
//     if (isChartTitleChange && titleInputRef.current)
//       titleInputRef.current.focus();
//   }, [isChartTitleChange]);

//   const updateGraphTitle = (val: string) =>
//     setGraphs((prev: IGraph[]) =>
//       prev.map((g) =>
//         g.code === code ? { ...g, data: { ...g.data, title: val } } : g
//       )
//     );
//   const handleTableHeaderColor = (col: string) => {
//     setTableHeaderColor(col);
//     setGraphs((prev: IGraph[]) =>
//       prev.map((g) =>
//         g.code === code
//           ? { ...g, data: { ...g.data, tableHeaderColor: col } }
//           : g
//       )
//     );
//   };
//   const formatType = (t: string) =>
//     t
//       ? t
//           .replace(/([a-z])([A-Z])/g, '$1 $2')
//           .replace(/\b\w/g, (c) => c.toUpperCase())
//       : '';

//   // Early returns
//   if (inputData?.plot?.length === 0 && !inputData?.title)
//     return (
//       <div className="empty-msg">
//         Search for a suitable Question or SQL Query to plot the{' '}
//         <strong>{formatType(type)}</strong> chart.
//       </div>
//     );
//   if (!parsedData.isCompatible)
//     return (
//       <div>This graph is not compatible with the data you are querying</div>
//     );
//   if (raw.length === 0) return null;

//   // 7. Render
//   return (
//     <div className="table-wrapper">
//       <div className="table-header">
//         {isChartTitleChange && (
//           <TextInput
//             placeholder="Enter chart title"
//             value={inputData.title}
//             onChange={(e) => updateGraphTitle(e.target.value)}
//             style={{ marginTop: 10, width: 250 }}
//             ref={titleInputRef}
//             onBlur={() => setIsChartTitleChange(false)}
//           />
//         )}
//         <h3 className="table-title">{parsedData.title}</h3>
//         <div className="tb-widget-color-down">
//           <input
//             type="color"
//             className="no-drag-color"
//             value={tableHeaderColor}
//             onChange={(e) => handleTableHeaderColor(e.target.value)}
//             style={{ height: 20, width: 20 }}
//           />
//           <FiDownload
//             onClick={downloadExcel}
//             className="no-drag-download-icon"
//             size={20}
//           />
//         </div>
//       </div>
//       <div className="grid-container" style={{ flex: 1, height: 300 }}>
//         <AutoSizer>
//           {({ height, width }) => (
//             <Grid
//               columnCount={columns.length}
//               columnWidth={(i) => columnWidths[i]}
//               rowCount={raw.length + 1}
//               rowHeight={(i) => rowHeights[i]}
//               height={height}
//               width={width}
//               itemData={{ raw, columns, prettify, tableHeaderColor }}
//             >
//               {GridCell}
//             </Grid>
//           )}
//         </AutoSizer>
//       </div>
//     </div>
//   );
// };

// const GridCell = ({ columnIndex, rowIndex, style, data }: any) => {
//   const { raw, columns, prettify, tableHeaderColor } = data;
//   // Header row
//   if (rowIndex === 0) {
//     return (
//       <div
//         style={{
//           ...style,
//           boxSizing: 'border-box',
//           padding: '8px',
//           background: tableHeaderColor,
//           color: '#fff',
//           fontWeight: 'bold',
//           borderBottom: '1px solid #ccc',
//           borderRight: '1px solid #ccc',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           overflow: 'hidden',
//           whiteSpace: 'nowrap',
//           textOverflow: 'ellipsis',
//         }}
//       >
//         {prettify(columns[columnIndex])}
//       </div>
//     );
//   }

//   // Data rows
//   const cell = raw[rowIndex - 1][columns[columnIndex]] ?? '';
//   return (
//     <div
//       style={{
//         ...style,
//         boxSizing: 'border-box',
//         padding: `${CELL_V_PADDING / 2}px ${CELL_H_PADDING / 2}px`,
//         borderBottom: '1px solid #eee',
//         borderRight: '1px solid #eee',
//         overflow: 'hidden',
//         whiteSpace: 'pre-wrap',
//         wordBreak: 'break-word',
//       }}
//     >
//       {String(cell)}
//     </div>
//   );
// };

// export default TableWidget;

// import React, { useEffect, useRef, useState, useMemo } from 'react';
// import { FiDownload } from 'react-icons/fi';
// import { parseChartData } from 'src/utils';
// import * as XLSX from 'xlsx';
// import '../styles/tableWidget.scss';
// import { TextInput } from '@mantine/core';
// import { IGraph } from 'src/types';
// import AutoSizer from 'react-virtualized-auto-sizer';
// import { VariableSizeGrid as Grid } from 'react-window';

// // Approximate metrics — tweak to match your font
// const CHAR_WIDTH = 12;
// const LINE_HEIGHT = 20;
// const CELL_H_PADDING = 16;
// const CELL_V_PADDING = 12;
// const HEADER_HEIGHT = 40;

// const TableWidget = ({
//   inputData,
//   type,
//   setGraphs,
//   code,
//   isChartTitleChange,
//   setIsChartTitleChange,
// }: any) => {
//   // 1. Parse
//   const parsedData = parseChartData(
//     inputData?.plot,
//     isChartTitleChange ? '' : inputData?.title,
//     type
//   );

//   const raw: any[] = parsedData.rawData || [];

//   // 2. Derive columns
//   const columns = useMemo(
//     () => Array.from(new Set(raw.flatMap((r) => Object.keys(r)))),
//     [raw]
//   );
//   const prettify = (col: string) => col.replace(/_/g, ' ').toUpperCase();

//   // 3. Search state & filtering
//   const [searchQuery, setSearchQuery] = useState('');
//   const filteredData = useMemo(() => {
//     if (!searchQuery.trim()) return raw;
//     const lower = searchQuery.toLowerCase();
//     return raw.filter((row) =>
//       columns.some((col) => String(row[col] ?? '').toLowerCase().includes(lower))
//     );
//   }, [raw, searchQuery, columns]);

//   // 4. Excel helpers (use filteredData)
//   const buildAoA = useMemo(() => {
//     const header = columns.map(prettify);
//     const dataRows = filteredData.map((row) => columns.map((c) => row[c] ?? ''));
//     return [header, ...dataRows];
//   }, [columns, filteredData]);

//   const downloadExcel = () => {
//     const ws = XLSX.utils.aoa_to_sheet(buildAoA);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//     const fname =
//       (parsedData.title || 'table-data').replace(/\s+/g, '_') + '.xlsx';
//     XLSX.writeFile(wb, fname);
//   };

//   // 5. Column widths (based on all data)
//   const columnWidths = useMemo(
//     () =>
//       columns.map((col) => {
//         const headerLen = prettify(col).length;
//         const maxLen = raw.reduce(
//           (m, r) => Math.max(m, String(r[col] ?? '').length),
//           headerLen
//         );
//         return maxLen * CHAR_WIDTH + CELL_H_PADDING;
//       }),
//     [columns, raw]
//   );

//   // 6. Data row heights (use filteredData)
//   const dataRowHeights = useMemo(
//     () =>
//       filteredData.map((row) => {
//         const lines = columns.map((col, i) => {
//           const text = String(row[col] ?? '');
//           const contentWidth = columnWidths[i] - CELL_H_PADDING;
//           const charsPerLine = Math.max(
//             1,
//             Math.floor(contentWidth / CHAR_WIDTH)
//           );
//           return Math.ceil(text.length / charsPerLine);
//         });
//         const numLines = Math.max(1, ...lines);
//         return numLines * LINE_HEIGHT + CELL_V_PADDING;
//       }),
//     [filteredData, columns, columnWidths]
//   );

//   const rowHeights = useMemo(
//     () => [HEADER_HEIGHT, ...dataRowHeights],
//     [dataRowHeights]
//   );

//   // 7. Header & title logic
//   const [tableHeaderColor, setTableHeaderColor] = useState(
//     inputData?.tableHeaderColor || '#008000'
//   );
//   const titleInputRef = useRef<HTMLInputElement>(null);
//   useEffect(() => {
//     if (isChartTitleChange && titleInputRef.current)
//       titleInputRef.current.focus();
//   }, [isChartTitleChange]);

//   const updateGraphTitle = (val: string) =>
//     setGraphs((prev: IGraph[]) =>
//       prev.map((g) =>
//         g.code === code ? { ...g, data: { ...g.data, title: val } } : g
//       )
//     );
//   const handleTableHeaderColor = (col: string) => {
//     setTableHeaderColor(col);
//     setGraphs((prev: IGraph[]) =>
//       prev.map((g) =>
//         g.code === code
//           ? { ...g, data: { ...g.data, tableHeaderColor: col } }
//           : g
//       )
//     );
//   };
//   const formatType = (t: string) =>
//     t
//       ? t
//           .replace(/([a-z])([A-Z])/g, '$1 $2')
//           .replace(/\b\w/g, (c) => c.toUpperCase())
//       : '';

//   // Early returns
//   if (inputData?.plot?.length === 0 && !inputData?.title)
//     return (
//       <div className="empty-msg">
//         Search for a suitable Question or SQL Query to plot the{' '}
//         <strong>{formatType(type)}</strong> chart.
//       </div>
//     );
//   if (!parsedData.isCompatible)
//     return (
//       <div>This graph is not compatible with the data you are querying</div>
//     );
//   if (raw.length === 0) return null;

//   // 8. Render
//   return (
//     <div className="table-wrapper">
//       {/* Title & Controls */}
//       <div className="table-header" style={{ flexDirection: 'column' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '12px',justifyContent: 'space-between' }}>
//           {isChartTitleChange ? (
//             <TextInput
//               placeholder="Enter chart title"
//               value={inputData.title}
//               onChange={(e) => updateGraphTitle(e.target.value)}
//               style={{ width: 250 }}
//               ref={titleInputRef}
//               onBlur={() => setIsChartTitleChange(false)}
//             />
//           ) : (
//             <h3 className="table-title">{parsedData.title}</h3>
//           )}
//           <div style={{display:'flex', gap: 4, marginLeft: 'auto'}}>

//           <input
//             type="color"
//             className="no-drag-color"
//             value={tableHeaderColor}
//             onChange={(e) => handleTableHeaderColor(e.target.value)}
//             style={{ height: 20, width: 20 }}
//             />

//           <FiDownload
//             onClick={downloadExcel}
//             className="no-drag-download-icon"
//             size={20}
//             />
//             </div>
//         </div>

//         {/* Search Bar */}
//         <div style={{ marginTop: 10, marginBottom: 10, width: 300 }}>
//           <TextInput
//             placeholder="Search..."
//             value={searchQuery}

//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Table Grid */}
//       <div className="grid-container" style={{ flex: 1, height: 300 }}>
//         <AutoSizer>
//           {({ height, width }) => (
//             <Grid
//               columnCount={columns.length}
//               columnWidth={(i) => columnWidths[i]}
//               rowCount={filteredData.length + 1}
//               rowHeight={(i) => rowHeights[i]}
//               height={height}
//               width={width}
//               itemData={{ raw: filteredData, columns, prettify, tableHeaderColor }}
//             >
//               {GridCell}
//             </Grid>
//           )}
//         </AutoSizer>
//       </div>
//     </div>
//   );
// };

// const GridCell = ({ columnIndex, rowIndex, style, data }: any) => {
//   const { raw, columns, prettify, tableHeaderColor } = data;
//   // Header row
//   if (rowIndex === 0) {
//     return (
//       <div
//         style={{
//           ...style,
//           boxSizing: 'border-box',
//           padding: '8px',
//           background: tableHeaderColor,
//           color: '#fff',
//           fontWeight: 'bold',
//           borderBottom: '1px solid #ccc',
//           borderRight: '1px solid #ccc',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           overflow: 'hidden',
//           whiteSpace: 'nowrap',
//           textOverflow: 'ellipsis',
//         }}
//         className='table-header-cel'
//       >
//         {prettify(columns[columnIndex])}
//       </div>
//     );
//   }

//   // Data rows
//   const cell = raw[rowIndex - 1][columns[columnIndex]] ?? '';
//   return (
//     <div
//       style={{
//         ...style,
//         boxSizing: 'border-box',
//         padding: `${CELL_V_PADDING / 2}px ${CELL_H_PADDING / 2}px`,
//         borderBottom: '1px solid #eee',
//         borderRight: '1px solid #eee',
//         overflow: 'hidden',
//         whiteSpace: 'pre-wrap',
//         wordBreak: 'break-word',
//       }}
//     >
//       {String(cell)}
//     </div>
//   );
// };

// export default TableWidget;

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { FiDownload } from 'react-icons/fi';
import { parseChartData } from 'src/utils';
import * as XLSX from 'xlsx';
import '../styles/tableWidget.scss';
import { Text, TextInput } from '@mantine/core';
import { IGraph } from 'src/types';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeGrid as Grid } from 'react-window';

// Approximate metrics — tweak to match your font
const CHAR_WIDTH = 10;
const LINE_HEIGHT = 20;
const CELL_H_PADDING = 16;
const CELL_V_PADDING = 12;
const HEADER_HEIGHT = 40;

const TableWidget = ({
  inputData,
  type,
  setGraphs,
  code,
  isChartTitleChange,
  setIsChartTitleChange,
  isPublished
}: any) => {
  // parse & data
  const parsedData = parseChartData(
    inputData?.plot,
    isChartTitleChange ? '' : inputData?.title,
    type
  );
  const raw: any[] = parsedData.rawData || [];
  if (inputData?.plot?.length === 0 && !inputData?.title)
    return (
      <div className="empty-msg">
        Search for a suitable Question or SQL Query to plot{' '}
        <strong>{type}</strong>.
      </div>
    );
  if (!parsedData.isCompatible)
    return (
      <div>This graph is not compatible with the data you are querying</div>
    );
  if (!raw.length) return null;

  // derive columns
  const columns = useMemo(
    () => Array.from(new Set(raw.flatMap((r) => Object.keys(r)))),
    [raw]
  );
  const prettify = (col: string) => col.replace(/_/g, ' ').toUpperCase();

  // search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return raw;
    const lower = searchQuery.toLowerCase();
    return raw.filter((row) =>
      columns.some((col) =>
        String(row[col] ?? '')
          .toLowerCase()
          .includes(lower)
      )
    );
  }, [raw, searchQuery, columns]);

  // column widths
  const columnWidths = useMemo(
    () =>
      columns.map((col) => {
        const headerLen = prettify(col).length;
        const maxLen = raw.reduce(
          (m, r) => Math.max(m, String(r[col] ?? '').length),
          headerLen
        );
        return maxLen * CHAR_WIDTH + CELL_H_PADDING;
      }),
    [columns, raw]
  );

  // row heights
  const dataRowHeights = useMemo(
    () =>
      filteredData.map((row) => {
        const lines = columns.map((col, i) => {
          const text = String(row[col] ?? '');
          const contentWidth = columnWidths[i] - CELL_H_PADDING;
          const charsPerLine = Math.max(
            1,
            Math.floor(contentWidth / CHAR_WIDTH)
          );
          return Math.ceil(text.length / charsPerLine);
        });
        const numLines = Math.max(1, ...lines);
        return numLines * LINE_HEIGHT + CELL_V_PADDING;
      }),
    [filteredData, columns, columnWidths]
  );

  // title & color state
  const [tableHeaderColor, setTableHeaderColor] = useState(
    inputData?.tableHeaderColor || '#008000'
  );
  const titleInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isChartTitleChange) titleInputRef.current?.focus();
  }, [isChartTitleChange]);

  const updateGraphTitle = (val: string) =>
    setGraphs((prev: any[]) =>
      prev.map((g) =>
        g.code === code ? { ...g, data: { ...g.data, title: val } } : g
      )
    );
  const handleTableHeaderColor = (col: string) => {
    setTableHeaderColor(col);
    setGraphs((prev: any[]) =>
      prev.map((g) =>
        g.code === code
          ? { ...g, data: { ...g.data, tableHeaderColor: col } }
          : g
      )
    );
  };

  // export
  const buildAoA = useMemo(
    () => [
      columns.map(prettify),
      ...filteredData.map((r) => columns.map((c) => r[c] ?? '')),
    ],
    [columns, filteredData]
  );
  const downloadExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet(buildAoA);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(
      wb,
      `${(parsedData.title || 'table-data').replace(/\s+/g, '_')}.xlsx`
    );
  };

  // refs for direct scroll sync
  const headerOuterRef = useRef<HTMLDivElement>(null);
  const bodyOuterRef = useRef<HTMLDivElement>(null);

  return (
    <div className="table-wrapper">
      {/* header title & controls */}
      <div className="table-header" style={{ flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            justifyContent: 'space-between',
          }}
        >
          {isChartTitleChange ? (
            <TextInput
              ref={titleInputRef}
              style={{ width: 250 }}
              placeholder="Enter chart title"
              value={inputData.title}
              onChange={(e) => updateGraphTitle(e.target.value)}
              onBlur={() => setIsChartTitleChange(false)}
            />
          ) : (
            <h3 className="table-title">{parsedData.title}</h3>
          )}
          <div style={{ display: 'flex', gap: 5 }}>
           {!isPublished&& <input
              type="color"
              className="no-drag-color"
              value={tableHeaderColor}
              onChange={(e) => handleTableHeaderColor(e.target.value)}
              style={{ width: 20, height: 20 }}
            />}
            <FiDownload
              size={20}
              className="no-drag-download-icon"
              onClick={downloadExcel}
            />
          </div>
        </div>
        <div
          style={{
            margin: '10px 0',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TextInput
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 300, marginRight: 10 }}
          />
          <Text style={{ fontWeight: 700,color:tableHeaderColor }}>Total:{filteredData.length}</Text>
        </div>
      </div>

      {/* grids */}
      <div className="grid-container" style={{ flex: 1, height: 300 }}>
        {/* header grid */}
        <div
          style={{ width: '100%', height: HEADER_HEIGHT, overflow: 'hidden' }}
        >
          <AutoSizer disableHeight>
            {({ width }) => (
              <Grid
                outerRef={headerOuterRef}
                columnCount={columns.length}
                columnWidth={(i) => columnWidths[i]}
                rowCount={1}
                rowHeight={() => HEADER_HEIGHT}
                width={width}
                height={HEADER_HEIGHT}
                style={{ overflowX: 'hidden', overflowY: 'hidden' }}
              >
                {({ columnIndex, style, data }) => {
                  const bg = tableHeaderColor;
                  return (
                    <div
                      style={{
                        ...style,
                        boxSizing: 'border-box',
                        padding: 8,
                        background: bg,
                        color: '#fff',
                        fontWeight: 'bold',
                        border: 'solid #ccc',
                        borderWidth: '0 1px 1px 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {prettify(columns[columnIndex])}
                    </div>
                  );
                }}
              </Grid>
            )}
          </AutoSizer>
        </div>
        {/* body grid */}
        <div style={{ flex: 1, height: `calc(100% - ${HEADER_HEIGHT}px)` }}>
          <AutoSizer>
            {({ height, width }) => (
              <Grid
                outerRef={bodyOuterRef}
                columnCount={columns.length}
                columnWidth={(i) => columnWidths[i]}
                rowCount={filteredData.length}
                rowHeight={(i) => dataRowHeights[i]}
                width={width}
                height={height}
                onScroll={({ scrollLeft }) => {
                  if (headerOuterRef.current)
                    headerOuterRef.current.scrollLeft = scrollLeft;
                }}
              >
                {({ columnIndex, rowIndex, style, data }) => {
                  const cell =
                    filteredData[rowIndex][columns[columnIndex]] ?? '';
                  return (
                    <div
                      style={{
                        ...style,
                        boxSizing: 'border-box',
                        padding: `${CELL_V_PADDING / 2}px ${
                          CELL_H_PADDING / 2
                        }px`,
                        borderBottom: '1px solid #eee',
                        borderRight: '1px solid #eee',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflow: 'hidden',
                        textAlign: 'center',
                      }}
                    >
                      {String(cell)}
                    </div>
                  );
                }}
              </Grid>
            )}
          </AutoSizer>
        </div>
      </div>
    </div>
  );
};

export default TableWidget;
