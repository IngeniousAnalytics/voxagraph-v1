interface IParsedChartData {
  title: string;
  xCategory: string[];
  series: {
    name: string;
    data: any;
  }[];
  isCompatible: boolean;
  rawData?: any[];
}

export const parseChartData = (
  apiData: any,
  title: string,
  type: string,
  variant?: string,
): IParsedChartData => {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return { title, xCategory: [], series: [], isCompatible: false };
  }

  const firstItem = apiData[0];
  const keys = Object.keys(firstItem);

  if (type === 'table' || type === 'card') {
    return {
      title,
      xCategory: [],
      series: [],
      isCompatible: true,
      rawData: apiData,
    };
  }

  if (
    variant === 'stacked_bar' ||
    variant === 'stacked_line' ||
    variant === 'area_line' ||
    variant === 'step_line' ||
    variant === 'stacked_area' ||
    variant === '100_stacked_area'
  ) {
    const xKey = keys.find(
      (key) =>
        key.toLowerCase().includes('district') ||
        key.toLowerCase().includes('state') ||
        key.toLowerCase().includes('name')
    );
    const groupKey = keys.find(
      (key) =>
        key.toLowerCase().includes('category') ||
        key.toLowerCase().includes('type')
    );
    const valueKey = keys.find((key) => typeof firstItem[key] === 'number');

    if (!xKey || !groupKey || !valueKey) {
      return { title, xCategory: [], series: [], isCompatible: false };
    }

    const xCategories = Array.from(
      new Set(apiData.map((item: any) => item[xKey]))
    );
    const groups = Array.from(
      new Set(apiData.map((item: any) => item[groupKey]))
    );

    const categoryDataMap: Record<string, number[]> = {};

    groups.forEach((group) => {
      categoryDataMap[group] = xCategories.map((xVal) => {
        const found = apiData.find(
          (item: any) => item[xKey] === xVal && item[groupKey] === group
        );
        return found ? found[valueKey] : 0;
      });
    });

    if (variant === '100_stacked_area') {
      xCategories.forEach((_, index) => {
        const total = groups.reduce(
          (sum, group) => sum + (categoryDataMap[group][index] || 0),
          0
        );
        if (total > 0) {
          groups.forEach((group) => {
            categoryDataMap[group][index] = +(
              (categoryDataMap[group][index] / total) *
              100
            ).toFixed(2);
          });
        }
      });
    }

    const series = groups.map((group) => ({
      name: group,
      type: variant === 'stacked_bar' ? 'bar' : 'line',
      data: categoryDataMap[group],
      stack:
        variant === 'stacked_bar' ||
        variant === 'stacked_line' ||
        variant === 'stacked_area' ||
        variant === '100_stacked_area'
          ? 'total'
          : undefined,
      areaStyle:
        variant === 'stacked_line' ||
        variant === 'area_line' ||
        variant === 'stacked_area' ||
        variant === '100_stacked_area'
          ? {}
          : undefined,
      smooth: variant === 'step_line' ? false : true,
      step: variant === 'step_line' ? true : false,
    }));

    return {
      title,
      xCategory: xCategories,
      series,
      isCompatible: true,
    };
  }

  const xField =
    keys.find((key) => typeof firstItem[key] === 'string') ||
    keys.find((key) => typeof firstItem[key] === 'number');

  const numericFields = keys.filter(
    (key) => typeof firstItem[key] === 'number' && key !== xField
  );

  if (!xField || numericFields.length === 0) {
    return { title, xCategory: [], series: [], isCompatible: false };
  }

  const xCategory = apiData.map((item: any) => item[xField]);

  if (type === 'pie') {
    const pieData = apiData.map((item: any) => ({
      name: item[xField],
      data: item[numericFields[0]] ?? 0,
    }));

    return {
      title,
      xCategory: xCategory,
      series: pieData,
      isCompatible: true,
    };
  }

  const series = numericFields.map((field) => ({
    name: field,
    type: type as any,
    data: apiData.map((item: any) => item[field] ?? 0),
  }));

  return {
    title,
    xCategory,
    series,
    isCompatible: true,
  };
};

export const getPublishedParams = () => {
  const hash = window.location.hash;
  const queryStart = hash.indexOf('?');
  if (queryStart === -1) return null;

  const queryString = hash.substring(queryStart + 1);
  const params = new URLSearchParams(queryString);

  return {
    id: params.get('id'),
    name: params.get('name'),
    db: params.get('db_id'),
    user_id: params.get('user_id'),
  };
};
