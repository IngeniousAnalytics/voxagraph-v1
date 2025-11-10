// src/helpers/chartOptions.ts
type EChartsColor = string;

interface ISeriesItem {
  name: string;
  data: number[];
  color?: EChartsColor;
}

interface IChartJSON {
  title: string;
  xCategory: string[];
  series: ISeriesItem[];
  isCompatible?: boolean;
}

const DEFAULT_COLORS: string[] = [
  '#fff176', '#ff8a65', '#a1887f', '#f44336', '#e91e63', '#9c27b0',
  '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
  '#ff5722', '#795548', '#00acc1', '#43a047', '#f06292', '#ba68c8',
  '#7986cb', '#4dd0e1', '#aed581', '#673ab7', '#3f51b5', '#2196f3',
  '#03a9f4', '#00bcd4', '#009688',
];

const getCommonTitle = (title: string) => ({
  text: title || '',
  left: 'center',
  textStyle: { fontSize: 16, fontWeight: 'bold' },
});

const applyColors = (data: number[], names?: string[]) =>
  data.map((value, i) => ({
    value,
    ...(names ? { name: names[i] || `Item ${i + 1}` } : {}),
    itemStyle: { color: DEFAULT_COLORS[i % DEFAULT_COLORS.length] },
  }));

/**
 * ✅ Auto-parses any JSON data into ECharts-friendly structure.
 */
export const parseDynamicJSON = (jsonData: any[], title: string): IChartJSON => {
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    return { title, xCategory: [], series: [], isCompatible: false };
  }

  const sample = jsonData[0];
  const keys = Object.keys(sample);

  // Detect first string key as x-axis category
  const xKey =
    keys.find((k) => isNaN(Number(sample[k])) && typeof sample[k] === 'string') ||
    keys[0];

  // Detect numeric or numeric-string keys
  const numericKeys = keys.filter(
    (k) => !isNaN(Number(sample[k])) && k !== xKey
  );

  const xCategory = jsonData.map((item) => String(item[xKey]));
  const series = numericKeys.map((numKey, idx) => ({
    name: numKey.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    data: jsonData.map((item) => Number(item[numKey])),
    color: DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
  }));

  return { title, xCategory, series, isCompatible: true };
};

/**
 * ✅ Generates chart options dynamically for ECharts
 */
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
    // ===========================================================
    // BAR CHARTS
    // ===========================================================
    case 'bar':
      switch (variant) {
        case 'stacked_bar':
          return {
            ...common,
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: { bottom: 10 },
            xAxis: {
              type: 'category',
              data: xCategory,
              axisLabel: {
                interval: 0,
                rotate: 45,
                formatter: (v: string) =>
                  v.length > 10 ? v.replace(/(.{10})/g, '$1\n') : v,
              },
            },
            yAxis: { type: 'value' },
            series: series.map((s) => ({
              type: 'bar',
              name: s.name,
              stack: 'x',
              data: s.data,
              itemStyle: { color: s.color },
            })),
          };

        case 'basic_bar':
        default:
          return {
            ...common,
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: { bottom: 10 },
            xAxis: {
              type: 'category',
              data: xCategory,
              axisLabel: {
                interval: 0,
                rotate: 45,
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

    // ===========================================================
    // LINE CHARTS
    // ===========================================================
    case 'line':
      return {
        ...common,
        tooltip: { trigger: 'axis' },
        legend: { bottom: 10 },
        xAxis: { type: 'category', data: xCategory },
        yAxis: { type: 'value' },
        series: series.map((s) => ({
          type: 'line',
          name: s.name,
          stack: variant.includes('stacked') ? 'total' : undefined,
          smooth: variant === 'smooth_line',
          areaStyle: variant.includes('area') ? {} : undefined,
          data: applyColors(s.data),
        })),
      };

    // ===========================================================
    // PIE CHARTS
    // ===========================================================
    case 'pie': {
  // --- Detect proper pie data structure ---
  let pieData: any[] = [];

  // Case 1: two-column data (category + value)
  if (series.length === 1) {
    pieData = series[0].data.map((val, i) => ({
      name: parsedData.xCategory[i] || `Item ${i + 1}`,
      value: Number(val),
      itemStyle: {
        color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      },
    }));
  } else {
    // Case 2: multi-series (each numeric column as slice)
    pieData = series.map((s, i) => ({
      name: s.name,
      value: Array.isArray(s.data) ? Number(s.data[0]) : Number(s.data),
      itemStyle: {
        color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      },
    }));
  }

  // --- Sort descending by value ---
  pieData.sort((a, b) => b.value - a.value);

  // --- Limit to top N + “Others” ---
  const TOP_N = 10;
  if (pieData.length > TOP_N) {
    const topItems = pieData.slice(0, TOP_N);
    const othersSum = pieData
      .slice(TOP_N)
      .reduce((sum, item) => sum + item.value, 0);
    topItems.push({
      name: 'Others',
      value: othersSum,
      itemStyle: {
        color: '#ccc',
      },
    });
    pieData = topItems;
  }

  const grandTotal = pieData.reduce((sum, item) => sum + item.value, 0);

  const basePieConfig = {
    ...common,
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      icon: 'roundRect',
      itemWidth: 14,
      itemHeight: 14,
      textStyle: { fontSize: 13 },
    },
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

  // --- Handle Pie Variants ---
  switch (variant) {
    case 'donut':
      return {
        ...basePieConfig,
        series: [
          {
            type: 'pie',
            radius: ['50%', '65%'],
            data: pieData,
            label: { show: false },
            labelLine: { show: false },
          },
        ],
      };

    case 'rose_pie':
      return {
        ...basePieConfig,
        series: [
          {
            type: 'pie',
            radius: '55%',
            roseType: 'area',
            data: pieData,
            label: { show: false },
            labelLine: { show: false },
          },
        ],
      };

    case 'ring_pie':
      return {
        ...basePieConfig,
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            data: pieData,
            label: { show: false },
            labelLine: { show: false },
          },
        ],
      };

    case 'half_donut': {
      const fullData = [
        ...pieData,
        {
          name: '',
          value: grandTotal,
          itemStyle: { color: 'transparent' },
          label: { show: false },
          tooltip: { show: false },
        },
      ];
      return {
        ...basePieConfig,
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            startAngle: 180,
            clockwise: true,
            data: fullData,
            label: { show: false },
            labelLine: { show: false },
          },
        ],
      };
    }

    case 'basic_pie':
    default:
      return {
        ...basePieConfig,
        series: [
          {
            type: 'pie',
            radius: '55%',
            data: pieData,
            label: { formatter: '{b}: {c}' },
          },
        ],
      };
  }
}


    default:
      return {
        ...common,
        title: { text: `${type} chart is not configured` },
        series: [],
      };
  }
};
