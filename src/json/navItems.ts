import { INavItems } from 'src/types';
import { RiBarChartFill, RiDonutChartFill } from 'react-icons/ri';
import {
  GiPieSlice,
  GiNetworkBars,
  GiRadarDish,
  GiBarbecue,
} from 'react-icons/gi';
import {
  FaChartBar,
  FaChartArea,
  FaChartLine,
  FaChartPie,
  FaTree,
  FaLifeRing,
  FaRegCircle,
} from 'react-icons/fa';
import {
  MdShowChart,
  MdScatterPlot,
  MdBubbleChart,
  MdGridOn,
  MdTrendingFlat,
  MdRadar,
  MdViewCarousel,
  MdViewModule,
  MdOutlineDonutLarge,
  
} from 'react-icons/md';
import { BsGrid3X2Gap } from 'react-icons/bs';
import { AiFillFunnelPlot } from 'react-icons/ai';
import { PiGauge } from 'react-icons/pi';
import { FaGaugeHigh } from 'react-icons/fa6';

export const NAV_ITEM: INavItems[] = [
  {
    id: 1,
    title: 'Bar Charts',
    charts: [
      {
        id: 11,
        type: 'bar',
        label: 'Basic Bar Chart',
        variant: 'basic_bar',
        icon: RiBarChartFill,
      },
      {
        id: 12,
        type: 'bar',
        label: 'Stacked Bar Chart',
        variant: 'stacked_bar',
        icon: FaChartBar,
        stacking: 'normal',
      },
      {
        id: 13,
        type: 'bar',
        label: 'Bar Racing',
        variant: 'racing_bar',
        icon: GiBarbecue,
      },
    ],
  },
  {
    id: 2,
    title: 'Line Charts',
    charts: [
      {
        id: 21,
        type: 'line',
        label: 'Basic Line Chart',
        variant: 'basic_line',
        icon: FaChartLine,
      },
      {
        id: 22,
        type: 'line',
        label: 'Stacked Line Chart',
        variant: 'stacked_line',
        icon: GiNetworkBars,
        stacking: 'normal',
      },
      {
        id: 23,
        type: 'line',
        label: 'Area Line Chart',
        variant: 'area_line',
        icon: FaChartArea,
        areaStyle: {},
      },
      {
        id: 24,
        type: 'line',
        label: 'Smooth Line Chart',
        variant: 'smooth_line',
        icon: MdShowChart,
      },
      {
        id: 25,
        type: 'line',
        label: 'Step Line Chart',
        variant: 'step_line',
        icon: MdTrendingFlat,
        step: 'left',
      },
    ],
  },
  {
    id: 3,
    title: 'Area Charts',
    charts: [
      {
        id: 31,
        type: 'line',
        label: 'Basic Area Chart',
        variant: 'basic_area',
        icon: FaChartArea,
        areaStyle: {},
      },
      {
        id: 32,
        type: 'line',
        label: 'Stacked Area Chart',
        variant: 'stacked_area',
        icon: FaChartArea,
        stacking: 'normal',
        areaStyle: {},
      },
      {
        id: 33,
        type: 'line',
        label: '100% Stacked Area Chart',
        variant: '100_stacked_area',
        icon: GiPieSlice,
        stacking: 'percent',
        areaStyle: {},
      },
    ],
  },
  {
    id: 4,
    title: 'Pie & Donut Charts',
    charts: [
      {
        id: 41,
        type: 'pie',
        label: 'Basic Pie Chart',
        variant: 'basic_pie',
        icon: FaChartPie,
      },
      {
        id: 42,
        type: 'pie',
        label: 'Donut Chart',
        variant: 'donut',
        icon: RiDonutChartFill,
        radius: ['40%', '70%'],
      },
      {
        id: 43,
        type: 'pie',
        label: 'Rose Pie Chart',
        variant: 'rose_pie',
        icon: GiPieSlice,
        roseType: 'radius',
      },
      {
        id: 45,
        type: 'pie',
        label: 'Ring Pie Chart',
        variant: 'ring_pie',
        icon: FaLifeRing,
      },
       {
        id: 46,
        type: 'pie',
        label: 'Half Donut Chart',
        variant: 'half_donut',
        icon: MdOutlineDonutLarge,
      },
    ],
  },
  {
    id: 5,
    title: 'Scatter & Bubble Charts',
    charts: [
      {
        id: 51,
        type: 'scatter',
        label: 'Scatter Chart',
        variant: 'scatter',
        icon: MdScatterPlot,
      },
      {
        id: 52,
        type: 'scatter',
        label: 'Bubble Chart',
        variant: 'bubble',
        icon: MdBubbleChart,
        symbolSize: [10, 100],
      },
    ],
  },
  {
    id: 6,
    title: 'Radar Charts',
    charts: [
      {
        id: 61,
        type: 'radar',
        label: 'Radar Chart',
        variant: 'radar',
        icon: GiRadarDish,
      },
      {
        id: 62,
        type: 'radar',
        label: 'Filled Radar Chart',
        variant: 'filled_radar',
        icon: MdRadar,
        areaStyle: {},
      },
    ],
  },
  {
    id: 7,
    title: 'Heatmap & Treemaps',
    charts: [
      {
        id: 71,
        type: 'heatmap',
        label: 'Heatmap',
        variant: 'heatmap',
        icon: BsGrid3X2Gap,
      },
      {
        id: 72,
        type: 'treemap',
        label: 'Treemap',
        variant: 'treemap',
        icon: MdViewModule,
      },
    ],
  },
  {
    id: 8,
    title: 'Gauge Charts',
    charts: [
      {
        id: 81,
        type: 'gauge',
        label: 'Basic Gauge Chart',
        variant: 'basic_gauge',
        icon: FaGaugeHigh,
      },
      {
        id: 82,
        type: 'gauge',
        label: 'Angular Gauge',
        variant: 'angular_gauge',
        icon: PiGauge,
        angular: true,
      },
    ],
  },
  {
    id: 9,
    title: 'Special Charts',
    charts: [
      {
        id: 91,
        type: 'tree',
        label: 'Tree Chart',
        variant: 'tree',
        icon: FaTree,
      },
      {
        id: 92,
        type: 'funnel',
        label: 'Funnel Chart',
        variant: 'funnel',
        icon: AiFillFunnelPlot,
      },
    ],
  },
  {
    id: 10,
    title: 'Grid Charts',
    charts: [
      {
        id: 101,
        type: 'table',
        label: 'Table Chart',
        icon: MdGridOn,
      },
      {
        id: 102,
        type: 'card',
        label: 'Card',
        icon: MdViewCarousel,
      },
       {
        id: 103,
        type: 'text',
        label: 'Text',
        icon: MdGridOn,
      },

    ],
  },
];
