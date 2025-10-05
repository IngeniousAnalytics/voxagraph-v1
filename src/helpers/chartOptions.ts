type EChartsColor = string;

interface ISeriesItem {
  name: string;
  data: number[];
  color?: EChartsColor;
  group?: string;
}

interface IChartJSON {
  title: string;
  xCategory: string[];
  series: ISeriesItem[];
}

const DEFAULT_COLORS: string[] = [
  '#fff176',
  '#ff8a65',
  '#a1887f',
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#00acc1',
  '#43a047',
  '#f06292',
  '#ba68c8',
  '#7986cb',
  '#4dd0e1',
  '#aed581',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
];

const getCommonTitle = (title: string) => ({
  text: title,
  left: 'center',
  textStyle: { fontSize: 16, fontWeight: 'bold' },
});

const applyColors = (data: number[], names?: string[]) =>
  data.map((value, i) => ({
    value,
    ...(names ? { name: names[i] || `Item ${i + 1}` } : {}),
    itemStyle: { color: DEFAULT_COLORS[i % DEFAULT_COLORS.length] },
  }));

export const getChartOptions = (
  type: string,
  variant: string,
  parsedData: IChartJSON,
  height: number
) => {
  const { xCategory, series, title } = parsedData;
  if (!xCategory?.length || !series?.length) return null;
  
  const common = { title: getCommonTitle(title) };

  switch (type.toLowerCase()) {
    case 'bar':
      switch (variant) {
        case 'stacked_bar':
          return {
            ...common,
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            xAxis: {
              type: 'category',
              data: xCategory,
              axisLabel: {
                interval: 0, // To prevent label overlap if there are many codes
                rotate: 45, // Optional: Rotate labels if they are long
                formatter: (value: any) => {
                  // Optional: Wrap the label if it's long
                  return value.length > 10
                    ? value.replace(/(.{10})/g, '$1\n')
                    : value;
                },
              },
            },
            yAxis: { type: 'value' },
            series: series.map((s) => ({
              type: 'bar',
              name: s.name,
              stack: 'x',
              data: s.data,
            })),
          };

        case 'racing_bar': {
          return {
            ...common,
            xAxis: { type: 'value' },
            yAxis: {
              type: 'category',
              data: xCategory,
              inverse: true,
              animationDuration: 300,
              animationDurationUpdate: 300,
              max: 2,
            },
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            series: series.map((s) => ({
              realtimeSort: true,
              type: 'bar',
              name: s.name,
              data: applyColors(s.data),
              label: {
                show: true,
                position: 'right',
                valueAnimation: true,
              },
            })),
          };
        }

        case 'basic_bar':
        default:
          return {
            ...common,
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            xAxis: {
              type: 'category',
              data: xCategory,
              axisLabel: {
                interval: 0, // To prevent label overlap if there are many codes
                rotate: 45, // Optional: Rotate labels if they are long
                formatter: (value: any) => {
                  // Optional: Wrap the label if it's long
                  return value.length > 8
                    ? value.replace(/(.{8})/g, '$1\n')
                    : value;
                },
              },
            },
            yAxis: { type: 'value' },
            series: series.map((s) => ({
              type: 'bar',
              name: s.name,
              data: applyColors(s.data),
            })),
          };
      }

    case 'line':
      switch (variant) {
        case 'stacked_line':
          return {
            ...common,
            tooltip: { trigger: 'axis' },
            xAxis: {
              type: 'category',
              data: xCategory,
              axisLabel: {
                interval: 0, // To prevent label overlap if there are many codes
                rotate: 45, // Optional: Rotate labels if they are long
                formatter: (value: any) => {
                  // Optional: Wrap the label if it's long
                  return value.length > 8
                    ? value.replace(/(.{8})/g, '$1\n')
                    : value;
                },
              },
            },
            yAxis: { type: 'value' },
            series: series.map((s) => ({
              type: 'line',
              name: s.name,
              stack: 'x',
              data: s.data,
            })),
          };

        case 'area_line':
          return {
            ...common,
            tooltip: { trigger: 'axis' },
            xAxis: {
              type: 'category',
              data: xCategory,
              axisLabel: {
                interval: 0, // To prevent label overlap if there are many codes
                rotate: 45, // Optional: Rotate labels if they are long
                formatter: (value: any) => {
                  // Optional: Wrap the label if it's long
                  return value.length > 8
                    ? value.replace(/(.{8})/g, '$1\n')
                    : value;
                },
              },
            },
            yAxis: { type: 'value' },
            series: series.map((s) => ({
              type: 'line',
              name: s.name,
              data: applyColors(s.data),
              areaStyle: {},
            })),
          };

        case 'smooth_line':
          return {
            ...common,
            tooltip: { trigger: 'axis' },
            xAxis: {
              type: 'category',
              data: xCategory,
              axisLabel: {
                interval: 0, // To prevent label overlap if there are many codes
                rotate: 45, // Optional: Rotate labels if they are long
                formatter: (value: any) => {
                  // Optional: Wrap the label if it's long
                  return value.length > 8
                    ? value.replace(/(.{8})/g, '$1\n')
                    : value;
                },
              },
            },
            yAxis: { type: 'value' },
            series: series.map((s) => ({
              type: 'line',
              name: s.name,
              smooth: true,
              data: applyColors(s.data),
            })),
          };

        case 'step_line':
          return {
            ...common,
            tooltip: { trigger: 'axis' },
            xAxis: {
              type: 'category',
              data: xCategory,
              axisLabel: {
                interval: 0, // To prevent label overlap if there are many codes
                rotate: 45, // Optional: Rotate labels if they are long
                formatter: (value: any) => {
                  // Optional: Wrap the label if it's long
                  return value.length > 8
                    ? value.replace(/(.{8})/g, '$1\n')
                    : value;
                },
              },
            },
            yAxis: { type: 'value' },
            series: series.map((s) => ({
              type: 'line',
              name: s.name,
              step: 'middle',
              data: applyColors(s.data),
            })),
          };

        case 'basic_area': {
          return {
            ...common,
            tooltip: {
              trigger: 'axis',
              axisPointer: { type: 'shadow' },
            },
            xAxis: {
              type: 'category',
              data: xCategory,
              boundaryGap: false,
            },
            yAxis: {
              type: 'value',
            },
            series: series.map((s) => ({
              type: 'line',
              name: s.name,
              areaStyle: {},
              smooth: true,
              data: applyColors(s.data),
            })),
          };
        }

        case 'stacked_area': {
          return {
            ...common,
            tooltip: {
              trigger: 'axis',
              axisPointer: { type: 'shadow' },
            },
            xAxis: {
              type: 'category',
              data: xCategory,
            },
            yAxis: {
              type: 'value',
            },
            series: series.map((s) => ({
              type: 'line',
              name: s.name,
              stack: 'total',
              areaStyle: {},
              data: applyColors(s.data),
            })),
          };
        }

        case '100_stacked_area': {
          return {
            ...common,
            tooltip: {
              trigger: 'axis',
              axisPointer: { type: 'shadow' },
            },
            xAxis: {
              type: 'category',
              data: xCategory,
              axisLabel: {
                interval: 0, // To prevent label overlap if there are many codes
                rotate: 45, // Optional: Rotate labels if they are long
                formatter: (value: any) => {
                  // Optional: Wrap the label if it's long
                  return value.length > 8
                    ? value.replace(/(.{8})/g, '$1\n')
                    : value;
                },
              },
            },
            yAxis: {
              type: 'value',
              min: 0,
              max: 100,
            },
            series: series.map((s) => ({
              type: 'line',
              name: s.name,
              stack: 'total',
              areaStyle: {},
              data: applyColors(s.data),
            })),
          };
        }

        case 'basic_line':
        default:
          return {
            ...common,
            tooltip: { trigger: 'axis' },
            xAxis: {
              type: 'category',
              data: xCategory,
              axisLabel: {
                interval: 0, // To prevent label overlap if there are many codes
                rotate: 45, // Optional: Rotate labels if they are long
                formatter: (value: any) => {
                  // Optional: Wrap the label if it's long
                  return value.length > 8
                    ? value.replace(/(.{8})/g, '$1\n')
                    : value;
                },
              },
            },
            yAxis: { type: 'value' },
            series: series.map((s) => ({
              type: 'line',
              name: s.name,
              data: applyColors(s.data),
            })),
          };
      }

    case 'pie':
      switch (variant) {
        case 'donut': {
          const pieData = series.map((s) => ({
            name: s.name,
            value: Array.isArray(s.data) ? s.data[0] : s.data,
          }));

          const grandTotal = pieData.reduce((sum, item) => sum + item.value, 0);

          return {
            ...common,
            tooltip: {
              trigger: 'item',
              formatter: '{b}: {c}', // Or include percentage with {d}%
            },
            legend: {
              orient: 'horizontal', // or 'vertical' for side layout
              bottom: 10,
              left: 'center',
              icon: 'roundRect',
              itemWidth: 14,
              itemHeight: 14,
              textStyle: {
                fontSize: 14,
              },
            },
            series: [
              {
                type: 'pie',
                radius: ['50%', '65%'],
                data: pieData,
                label: {
                  show: false, // Hide labels from slices
                },
                labelLine: {
                  show: false,
                },
              },
            ],
            graphic: {
              elements: [
                {
                  type: 'text',
                  left: 'center',
                  top: 'center',
                  style: {
                    text: `Total: ${grandTotal.toLocaleString('en-IN')}`,
                    fontSize: 16,
                    fontWeight: 'bold',
                    fill: '#333',
                  },
                },
              ],
            },
          };
        }

        case 'rose_pie': {
          const pieData = series.map((s) => ({
            name: s.name,
            value: Array.isArray(s.data) ? s.data[0] : s.data,
          }));

          const grandTotal = pieData.reduce((sum, item) => sum + item.value, 0);

          return {
            ...common,
            tooltip: {
              trigger: 'item',
              formatter: '{b}: {c}', // show value only
            },
            legend: {
              orient: 'horizontal',
              bottom: 10,
              left: 'center',
              icon: 'roundRect',
              itemWidth: 14,
              itemHeight: 14,
              textStyle: {
                fontSize: 14,
              },
            },
            series: [
              {
                type: 'pie',
                radius: '50%',
                data: pieData,
                roseType: 'area',
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            ],
            graphic: {
              elements: [
                {
                  type: 'text',
                  left: 'center',
                  top: 'center',
                  style: {
                    text: `Total: ${grandTotal.toLocaleString('en-IN')}`,
                    fontSize: 16,
                    fontWeight: 'bold',
                    fill: '#333',
                  },
                },
              ],
            },
          };
        }

        case 'ring_pie': {
          const pieData = series.map((s) => ({
            name: s.name,
            value: Array.isArray(s.data) ? s.data[0] : s.data,
          }));

          const grandTotal = pieData.reduce((sum, item) => sum + item.value, 0);

          return {
            ...common,
            tooltip: {
              trigger: 'item',
              formatter: '{b}: {c}', // show value only
            },
            legend: {
              orient: 'horizontal',
              bottom: 10,
              left: 'center',
              icon: 'roundRect',
              itemWidth: 14,
              itemHeight: 14,
              textStyle: {
                fontSize: 14,
              },
            },
            series: [
              {
                type: 'pie',
                radius: ['40%', '70%'],
                data: pieData,
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            ],
            graphic: {
              elements: [
                {
                  type: 'text',
                  left: 'center',
                  top: 'center',
                  style: {
                    text: `Total: ${grandTotal.toLocaleString('en-IN')}`,
                    fontSize: 16,
                    fontWeight: 'bold',
                    fill: '#333',
                  },
                },
              ],
            },
          };
        }

        case 'basic_pie':
        default: {
          const pieData = series.map((s) => ({
            name: s.name,
            value: Array.isArray(s.data) ? s.data[0] : s.data, // FIX
          }));
          const grandTotal = pieData.reduce((sum, item) => sum + item.value, 0);
          return {
            ...common,
            tooltip: {
              trigger: 'item',
              formatter: '{b}: {c}',
            },
            series: [
              {
                type: 'pie',
                radius: '50%',
                data: series.map((s) => ({
                  name: s.name,
                  value: Array.isArray(s.data) ? s.data[0] : s.data, // FIX
                })),

                label: {
                  formatter: '{b}: {c}',
                },
              },
            ],
            graphic: {
              elements: [
                {
                  type: 'text',
                  left: 'center',
                  bottom: Math.max(height * 0.05, 10),
                  style: {
                    text: `Total: ${grandTotal.toLocaleString('en-IN')}`,
                    fontSize: 16,
                    fontWeight: 'bold',
                  },
                },
              ],
            },
          };
        }

        // case 'half_donut': {
        //   const halfDonutData = series.map((s) => ({
        //     name: s.name,
        //     value: Array.isArray(s.data) ? s.data[0] : s.data,
        //   }));

        //   const grandTotal = halfDonutData.reduce(
        //     (sum, item) => sum + item.value,
        //     0
        //   );
        //   // Add transparent dummy slice to complete 360° but only show half
        //   const fullData = [
        //     ...halfDonutData,
        //     {
        //       name: '',
        //       value: grandTotal, // fill the other half invisibly
        //       itemStyle: {
        //         color: 'transparent',
        //       },
        //       label: {
        //         show: false,
        //       },
        //       tooltip: {
        //         show: false,
        //       },
        //     },
        //   ];

        //   return {
        //     ...common,
        //     tooltip: {
        //       trigger: 'item',
        //       formatter: '{b}: {c}',
        //     },

        //     legend: {
        //       orient: 'horizontal',
        //       bottom: 10,
        //       left: 'center',
        //       icon: 'roundRect',
        //       itemWidth: 14,
        //       itemHeight: 14,
        //       textStyle: {
        //         fontSize: 14,
        //       },
        //     },
        //     series: [
        //       {
        //         type: 'pie',
        //         radius: ['50%', '65%'],
        //         center: ['50%', '75%'],
        //         startAngle: 180,
        //         clockwise: true,
        //         data: fullData,
        //         label: {
        //           show: false,
        //         },
        //         labelLine: {
        //           show: false,
        //         },
        //       },
        //     ],
        //     graphic: {
        //       elements: [
        //         {
        //           type: 'text',
        //           left: 'center',
        //           top: Math.max(height * 0.08, 10),
        //           style: {
        //             text: `Total: ${grandTotal.toLocaleString('en-IN')}`,
        //             fontSize: 16,
        //             fontWeight: 'bold',
        //             fill: '#333',
        //           },
        //         },
        //       ],
        //     },
        //   };
        // }
        case 'half_donut': {
          // 1) prepare the half-donut slices
          const halfDonutData = series.map((s) => ({
            name: s.name,
            value: Array.isArray(s.data) ? s.data[0] : s.data,
          }));
          const grandTotal = halfDonutData.reduce(
            (sum, item) => sum + item.value,
            0
          );

          // 2) add transparent slice to fill the bottom half
          const fullData = [
            ...halfDonutData,
            {
              name:'', // will be hidden in legend
              value: grandTotal, // same size as sum => fills 180°
              itemStyle: { color: 'transparent' },
              label: { show: false },
              tooltip: { show: false },
            },
          ];

          return {
            ...common,
            tooltip: {
              trigger: 'item',
              formatter: '{b}: {c}',
            },
            legend: {
              orient: 'horizontal',
              bottom: 10,
              left: 'center',
              icon: 'roundRect',
              itemWidth: 14,
              itemHeight: 14,
              textStyle: { fontSize: 14 },
            },
            series: [
              {
                type: 'pie',
                radius: ['40%', '70%'],
                // center: ['50%', '75%'],
                startAngle: 180,
                clockwise: true,
                data: fullData,
                label: { show: false },
                labelLine: { show: false },
              },
            ],
            graphic: {
              elements: [
                {
                  type: 'text',
                  left: 'center',
                  top: 'center',
                  style: {
                    text: `Total: ${grandTotal.toLocaleString('en-IN')}`,
                    fontSize: 16,
                    fontWeight: 'bold',
                    fill: '#333',
                  },
                },
              ],
            },
          };
        }
      }

    case 'scatter':
      switch (variant) {
        case 'bubble': {
          return {
            ...common,
            tooltip: {
              trigger: 'item',
            },
            xAxis: {
              type: 'value',
            },
            yAxis: {
              type: 'value',
            },
            series: series.map((s) => ({
              type: 'scatter',
              name: s.name,
              symbolSize: [10, 100],
              data: applyColors(s.data),
            })),
          };
        }

        case 'scatter':
        default: {
          return {
            ...common,
            tooltip: {
              trigger: 'item',
            },
            xAxis: {
              type: 'value',
            },
            yAxis: {
              type: 'value',
            },
            series: series.map((s) => ({
              type: 'scatter',
              name: s.name,
              data: applyColors(s.data),
            })),
          };
        }
      }

    case 'radar':
      switch (variant) {
        case 'filled_radar': {
          return {
            ...common,
            tooltip: {
              trigger: 'item',
            },
            radar: {
              indicator: xCategory.map((category) => ({
                name: category,
                max: 100,
              })),
            },
            series: series.map((s) => ({
              type: 'radar',
              name: s.name,
              data: [s.data],
              areaStyle: {
                normal: {
                  opacity: 0.3,
                },
              },
              itemStyle: {
                normal: {
                  color: applyColors(s.data),
                },
              },
            })),
          };
        }

        case 'radar':
        default: {
          return {
            ...common,
            tooltip: {
              trigger: 'item',
            },
            radar: {
              indicator: xCategory.map((category) => ({
                name: category,
                max: 100,
              })),
            },
            series: series.map((s) => ({
              type: 'radar',
              name: s.name,
              data: [s.data],
              itemStyle: {
                normal: {
                  color: applyColors(s.data),
                },
              },
            })),
          };
        }
      }

    case 'heatmap':
      const allValues = series.flatMap((s) => s.data);
      return {
        ...common,
        tooltip: { trigger: 'item' },
        xAxis: { type: 'category', data: xCategory },
        yAxis: { type: 'category', data: series.map((s) => s.name) },
        visualMap: {
          min: Math.min(...allValues),
          max: Math.max(...allValues),
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '15%',
        },
        series: series.map((s) => ({
          type: 'heatmap',
          name: s.name,
          data: s.data.map((val, i) => [xCategory[i], val]),
        })),
      };

    case 'treemap':
      return {
        ...common,
        tooltip: { trigger: 'item' },
        series: series.map((s) => ({
          type: 'treemap',
          data: s.data.map((val, i) => ({
            name: xCategory[i] || `Item ${i + 1}`,
            value: val,
          })),
        })),
      };

    case 'gauge':
      switch (variant) {
        case 'angular_gauge': {
          return {
            ...common,
            tooltip: { trigger: 'item', formatter: '{a} : {c}' },
            series: [
              {
                type: 'gauge',
                radius: '80%',
                min: 0,
                max: 100,
                startAngle: 180,
                endAngle: 0,
                axisLine: {
                  lineStyle: {
                    color: [
                      [0.2, '#ff4500'],
                      [0.8, '#ffb500'],
                      [1, '#58d9c5'],
                    ],
                    width: 20,
                  },
                },
                pointer: { show: true },
                title: { text: 'Angular Gauge', fontSize: 14, color: '#fff' },
                detail: { formatter: '{value}%', fontSize: 18, color: 'auto' },
                data: [{ value: 75, name: 'Percentage' }],
              },
            ],
          };
        }

        case 'basic_gauge':
        default: {
          return {
            ...common,
            tooltip: { trigger: 'item', formatter: '{a} : {c}' },
            series: [
              {
                type: 'gauge',
                radius: '80%',
                min: 0,
                max: 100,
                axisLine: {
                  lineStyle: {
                    color: [
                      [0.2, '#ff4500'],
                      [0.8, '#ffb500'],
                      [1, '#58d9c5'],
                    ],
                    width: 20,
                  },
                },
                pointer: { show: true },
                title: { text: 'Basic Gauge', fontSize: 14, color: '#fff' },
                detail: { formatter: '{value}%', fontSize: 18, color: 'auto' },
                data: [{ value: 50, name: 'Percentage' }],
              },
            ],
          };
        }
      }

    case 'tree':
      return {
        ...common,
        tooltip: { trigger: 'item', triggerOn: 'mousemove' },
        series: [
          {
            type: 'tree',
            data: series.map((s) => ({
              name: s.name,
              value: s.data,
              children: s.data.map((val, i) => ({
                name: `${xCategory[i] || `Item ${i + 1}`}`,
                value: val,
              })),
            })),
            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',
            symbolSize: 7,
            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
            },
            leaves: { label: { position: 'right' } },
          },
        ],
      };

    case 'funnel':
      return {
        ...common,
        tooltip: { trigger: 'item', formatter: '{b} : {c} ({d}%)' },
        series: series.map((s) => ({
          type: 'funnel',
          width: '40%',
          data: s.data.map((val, i) => ({
            value: val,
            name: xCategory[i] || `Item ${i + 1}`,
          })),
        })),
      };

    case 'table':
      return {
        ...common,
        chart: { type: undefined },
        title: { text: title },
        series: [],
        tableData: {
          xCategory: xCategory,
          series: series,
        } as any,
      };

    default:
      return {
        ...common,
        title: { text: `${type} chart is not configured` },
        series: [],
      };
  }
};
