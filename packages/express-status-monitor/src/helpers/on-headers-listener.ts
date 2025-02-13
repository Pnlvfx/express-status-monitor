import type { OsMetrics } from '../types/os-metrics.js';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const onHeadersListener = (statusCode: number, startTime: [number, number], spans: OsMetrics[]) => {
  const diff = process.hrtime(startTime);
  const responseTime = (diff[0] * 1e3 + diff[1]) * 1e-6;
  const category = Math.floor(statusCode / 100);

  for (const span of spans) {
    const last = span.responses.at(-1);

    if (last !== undefined && last.timestamp / 1000 + span.interval > Date.now() / 1000) {
      last[category] = last[category] === undefined ? 1 : last[category]++;
      last.count += 1;
      last.mean += (responseTime - last.mean) / last.count;
    } else {
      span.responses.push({
        2: category === 2 ? 1 : 0,
        3: category === 3 ? 1 : 0,
        4: category === 4 ? 1 : 0,
        5: category === 5 ? 1 : 0,
        count: 1,
        mean: responseTime,
        timestamp: Date.now(),
      });
    }
  }
};
