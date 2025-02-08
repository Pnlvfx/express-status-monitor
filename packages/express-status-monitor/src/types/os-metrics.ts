import type { RetentionSpan } from './config.js';
import type { EventLoopStats } from '../types/event-loop-stats.js';
import type pidusage from 'pidusage';
import type v8 from 'node:v8';

export interface OsMetrics extends RetentionSpan {
  os: OsMetricsOS[];
  responses: OsMetricsResponse[];
}

interface OsMetricsOS extends pidusage.Status {
  load: number[];
  heap: v8.HeapInfo;
  loop?: EventLoopStats;
}

interface OsMetricsResponse {
  timestamp: number;
}
