import type { ChartVisibility } from '../types/config.js';
import { defaultConfig } from './default-config.js';

export const mungeChartVisibility = (configChartVisibility: ChartVisibility) => {
  for (const k of Object.keys(defaultConfig.chartVisibility)) {
    const key = k as keyof ChartVisibility;
    if (configChartVisibility[key] === false) {
      defaultConfig.chartVisibility[key] = false;
    }
  }
  return defaultConfig.chartVisibility;
};
