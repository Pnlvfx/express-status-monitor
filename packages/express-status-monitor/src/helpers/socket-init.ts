import type { Server as NodeServer } from 'node:http';
import type { OsMetrics } from '../types/os-metrics.js';
import { Server, type Socket } from 'socket.io';
import { gatherOsMetrics } from './gather-os-metrics.js';

let io: Server | undefined;

interface SocketConfig {
  websocket?: Server;
  spans: OsMetrics[];
}

export const socketIoInit = (server: NodeServer, { websocket, spans }: SocketConfig) => {
  if (io === undefined) {
    io = websocket ?? new Server(server);

    io.on('connection', (socket: Socket) => {
      addSocketEvents(socket, spans);
    });

    for (const span of spans) {
      span.os = [];
      span.responses = [];
      const interval = setInterval(() => {
        if (!io) return;
        gatherOsMetrics(io, span);
      }, span.interval * 1000);

      interval.unref();
    }
  }
};

const addSocketEvents = (socket: Socket, spans: OsMetrics[]) => {
  socket.emit('esm_start', spans);
  socket.on('esm_change', () => {
    socket.emit('esm_start', spans);
  });
};
