import type { ExpressStatusConfig } from './types/config.js';
import type { Request, Response, NextFunction } from 'express';
import type { SocketRequest } from './types/request.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import Handlebars from 'handlebars';
import onHeaders from 'on-headers';
import { socketIoInit } from './helpers/socket-init.js';
import { healthChecker } from './helpers/health-checker.js';
import { onHeadersListener } from './helpers/on-headers-listener.js';
import { mungeChartVisibility } from './helpers/validate.js';
import { defaultConfig } from './helpers/default-config.js';

export const statusMonitor = async ({
  chartVisibility = defaultConfig.chartVisibility,
  healthChecks = defaultConfig.healthChecks,
  ignoreStartsWith = defaultConfig.ignoreStartsWith,
  path: configPath = defaultConfig.path,
  socketPath = defaultConfig.socketPath,
  spans = defaultConfig.spans,
  theme = defaultConfig.theme,
  title = defaultConfig.title,
  port,
  websocket,
}: ExpressStatusConfig = {}) => {
  chartVisibility = mungeChartVisibility(chartVisibility);
  const bodyClasses = [];

  for (const [key, value] of Object.entries(chartVisibility)) {
    if (!value) {
      bodyClasses.push(`hide-${key}`);
    }
  }

  const data = {
    title,
    port,
    socketPath,
    bodyClasses: bodyClasses.join(' '),
    script: await fs.readFile(path.join(import.meta.dirname, '../public/javascripts/app.js')),
    style: await fs.readFile(path.join(import.meta.dirname, '../public/stylesheets/', theme)),
  };

  const htmlTmpl = await fs.readFile(path.join(import.meta.dirname, '../public/index.html'));
  const render = Handlebars.compile(htmlTmpl.toString());

  const middleware = async (socketRequest: Request, res: Response, next: NextFunction) => {
    const req = socketRequest as SocketRequest;
    /** @ts-expect-error spans will change from RetentionSpan[] to OsMetrics[] */
    socketIoInit(req.socket.server, { websocket, spans });
    const startTime = process.hrtime();

    if (req.path === configPath) {
      const results = await healthChecker(healthChecks);
      res.send(render({ ...data, healthCheckResults: results }));
    } else {
      if (!req.path.startsWith(ignoreStartsWith)) {
        onHeaders(res, () => {
          /** @ts-expect-error spans will change from RetentionSpan[] to OsMetrics[] */
          onHeadersListener(res.statusCode, startTime, spans);
        });
      }

      next();
    }
  };

  middleware.middleware = middleware;

  middleware.pageRoute = async (_req: Request, res: Response) => {
    const results = await healthChecker(healthChecks);
    res.send(render({ ...data, healthCheckResults: results }));
  };

  return middleware;
};
