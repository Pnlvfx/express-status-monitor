import type { Request } from 'express';
import type { Server } from 'node:http';

export interface SocketRequest extends Request {
  socket: Request['socket'] & { server: Server };
}
