import type { InitialStatusConfig, ValidExpressStatusConfig } from '../types/config.js';
import type { Server as NodeServer } from 'node:http';
import { Server, type Socket } from 'socket.io';
import { gatherOsMetrics } from './gather-os-metrics.js';
import type { OsMetrics } from '../types/os-metrics.js';

let io: Server | undefined;

export const socketIoInit = (server: NodeServer, config: InitialStatusConfig) => {
  if (io === undefined) {
    io = config.websocket ?? new Server(server);

    io.on('connection', (socket: Socket) => {
      addSocketEvents(socket, config as ValidExpressStatusConfig);
    });

    for (const span of config.spans) {
      span.os = [];
      span.responses = [];
      const interval = setInterval(() => {
        if (!span.os || !io) return;
        gatherOsMetrics(io, span as OsMetrics);
      }, span.interval * 1000);

      interval.unref();
    }
  }
};

const addSocketEvents = (socket: Socket, config: ValidExpressStatusConfig) => {
  socket.emit('esm_start', config.spans);
  socket.on('esm_change', () => {
    socket.emit('esm_start', config.spans);
  });
};
