import type { Server } from 'socket.io';
import type { OsMetrics } from './os-metrics.js';

interface Shared {
  title: string;
  theme: string;
  path: string;
  socketPath: string;
  chartVisibility: ChartVisibility;
  healthChecks: HealthCheck[];
  ignoreStartsWith: string;
  websocket?: Server;
  port?: number;
}

export interface ValidExpressStatusConfig extends Shared {
  spans: OsMetrics[];
}

export interface ExpressStatusConfig extends Partial<Shared> {
  spans?: RetentionSpan[];
}

export interface ChartVisibility {
  cpu?: boolean;
  mem?: boolean;
  load?: boolean;
  /** @default true */
  eventLoop?: boolean;
  heap?: boolean;
  responseTime?: boolean;
  rps?: boolean;
  statusCodes?: boolean;
}

export interface RetentionSpan {
  interval: number;
  retention: number;
}

export interface HealthCheck {
  protocol: string;
  host: string;
  path: string;
  port: string | number;
}
