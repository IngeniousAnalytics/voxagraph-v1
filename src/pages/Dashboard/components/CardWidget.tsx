import { Fragment } from 'react';
import { Text, TextInput } from '@mantine/core';
import '../styles/cardWidget.scss';
import { IGraph } from 'src/types';
import { useEffect, useRef } from 'react';

const CardWidget = ({ inputData, type,setGraphs,code,setIsChartTitleChange,isChartTitleChange,defaultColor }: any) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
 
 
  const updateGraphTitle = (value: any) => {
    setGraphs((prevGraphs: IGraph[]) =>
      prevGraphs.map((graph) =>
        graph.code === code
          ? {
              ...graph,
              data: {
                ...graph.data,
                title: value,
              },
            }
          : graph
      )
    );
  };

  useEffect(() => {
    if (isChartTitleChange && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isChartTitleChange]);

  const formatType = (type: string) => {
    return type
      ? type
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : '';
  };

  if (inputData?.plot?.length === 0) {
    return (
      <div>
        Search for a suitable Question or SQL Query to plot the{' '}
        <strong>{formatType(type)}</strong> chart.
      </div>
    );
  }

  const plotData = inputData?.plot?.[0] || {};
  const label = Object.keys(plotData)[0] || 'Label';
  const value = plotData[label] ?? 0;

 

  return (
    <Fragment>
      <div className="count-card-wrapper" style={{background:defaultColor}}>
        {isChartTitleChange && (
                <TextInput
                  placeholder="Enter chart title"
                  value={inputData.title}
                  onChange={(e) => updateGraphTitle(e.target.value)}
                  style={{ marginTop: '10px',  width: 250 }}
                  ref={titleInputRef}
                  onBlur={() => setIsChartTitleChange(false)}
                />
              )}
        <h3 className="card-title">{isChartTitleChange?"":inputData.title}</h3>
        <Text style={{ fontSize: 31, fontWeight: 800 , margin: 2,  color: "green",textAlign: "center"}}>
          {value.toLocaleString('en-IN')}
        </Text>
      </div>
    </Fragment>
  );
};

export default CardWidget;
