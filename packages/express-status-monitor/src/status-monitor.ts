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
import { validate } from './helpers/validate.js';

export const statusMonitor = async (config: ExpressStatusConfig = {}) => {
  const validatedConfig = validate(config);
  const bodyClasses = [];

  for (const [key, value] of Object.entries(validatedConfig.chartVisibility)) {
    if (!value) {
      bodyClasses.push(`hide-${key}`);
    }
  }

  const data = {
    title: validatedConfig.title,
    port: validatedConfig.port,
    socketPath: validatedConfig.socketPath,
    bodyClasses: bodyClasses.join(' '),
    script: await fs.readFile(path.join(import.meta.dirname, '../public/javascripts/app.js')),
    style: await fs.readFile(path.join(import.meta.dirname, '../public/stylesheets/', validatedConfig.theme)),
  };

  const htmlTmpl = await fs.readFile(path.join(import.meta.dirname, '../public/index.html'));
  const render = Handlebars.compile(htmlTmpl.toString());

  const middleware = async (socketRequest: Request, res: Response, next: NextFunction) => {
    const req = socketRequest as SocketRequest;
    socketIoInit(req.socket.server, validatedConfig);
    const startTime = process.hrtime();

    if (req.path === validatedConfig.path) {
      const results = await healthChecker(validatedConfig.healthChecks);
      res.send(render({ ...data, healthCheckResults: results }));
    } else {
      if (!req.path.startsWith(validatedConfig.ignoreStartsWith)) {
        onHeaders(res, () => {
          onHeadersListener(res.statusCode, startTime, validatedConfig.spans);
        });
      }

      next();
    }
  };

  middleware.middleware = middleware;
  middleware.pageRoute = async (_req: Request, res: Response) => {
    const results = await healthChecker(validatedConfig.healthChecks);
    res.send(render({ ...data, healthCheckResults: results }));
  };

  return middleware;
};
