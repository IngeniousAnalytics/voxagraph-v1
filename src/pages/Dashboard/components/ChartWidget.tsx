import React, { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { getChartOptions } from 'src/helpers/chartOptions';
import { IChartWidget, IGraph } from 'src/types';
import { parseChartData } from 'src/utils';
import '../styles/chartWidget.scss';
import { Button, TextInput } from '@mantine/core';

const ChartWidget: React.FC<any> = ({
  type,
  variant,
  width,
  height,
  inputData,
  code,
  setGraphs,
  isChartTitleChange,
  setIsChartTitleChange,
}) => {
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

  if (inputData?.plot?.length === 0 && !inputData.title) {
    return (
      <div className="empty-msg">
        Search for a suitable Question or SQL Query to plot the{' '}
        <strong>{formatType(type)}</strong> chart.
      </div>
    );
  }

  if (inputData?.title && inputData?.plot?.length === 0) {
    return (
      <div className="empty-chart-msg">
        <h3>{inputData.title}</h3>
        <p>
          Please hit the Refresh icon to fetch the latest data as per your
          previous search history.
        </p>
      </div>
    );
  }

  const parsedData = parseChartData(
    inputData?.plot,
    isChartTitleChange ? '' : inputData?.title,
    type,
    variant,
  );
  if (!parsedData.isCompatible) {
    return (
      <div>This graph is not compatible with the data you are querying</div>
    );
  }

  const options = getChartOptions(type, variant, parsedData,height);
  if (!options || Object.keys(options).length === 0) {
    return (
      <div className="chart-error">
        This chart is not compatible with the data you are querying.
      </div>
    );
  }

const onChartClick = (params: any) => {
  if (params.componentType === 'series' && params.data) {
    const { seriesName, data } = params;
    const selectedData = {
      seriesName,
      data,
    };
  }
  // console.log('Chart clicked:', params,code);
}

const onEvents = {
    click: onChartClick,
  };

  return (
    <div className="chart-container">
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
      <ReactECharts
      className='no-drag-graph' 
      onEvents={onEvents}
        option={options}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
    </div>
  );
};

export default ChartWidget;
