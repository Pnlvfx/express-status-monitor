# @frozenjs/express-status-monitor

[![express-status-monitor on npm](https://img.shields.io/npm/v/@frozenjs/express-status-monitor.svg)](https://www.npmjs.com/@frozenjs/express-status-monitor)
[![npm](https://img.shields.io/npm/dt/@frozenjs/express-status-monitor.svg)](https://img.shields.io/npm/dt/@frozenjs/express-status-monitor.svg)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A modern, TypeScript-ready, self-hosted monitoring solution for Express.js applications. Built with Socket.io and Chart.js to provide real-time server metrics with a clean, responsive interface.

This is a modernized version of express-status-monitor featuring:

- 🔧 **TypeScript support** with full type definitions
- 📦 **ES Module syntax** (ESM) support
- 🚀 **Modern JavaScript** features and patterns
- 📚 **Improved documentation** with comprehensive examples
- 🎨 **Enhanced UI** with better responsiveness

## Installation & setup

1. **Install the package:**

   ```bash
   npm install @frozenjs/express-status-monitor
   ```

2. **Add to your Express application:**

   ```typescript
   import express from 'express';
   import { statusMonitor } from '@frozenjs/express-status-monitor';

   const app = express();

   // Add status monitor middleware BEFORE other routes
   app.use(statusMonitor());

   app.listen(3000, () => {
     console.log('Server running on http://localhost:3000');
     console.log('Status monitor available at http://localhost:3000/status');
   });
   ```

3. **Access the monitoring dashboard:**
   Navigate to `http://localhost:3000/status` in your browser

## Options

Monitor can be configured by passing options object into `statusMonitor` constructor.

Default config:

```javascript
title: 'Express Status',  // Default title
theme: 'default.css',     // Default styles
path: '/status',
socketPath: '/socket.io', // In case you use a custom path
websocket: existingSocketIoInstance,
spans: [{
  interval: 1,            // Every second
  retention: 60           // Keep 60 datapoints in memory
}, {
  interval: 5,            // Every 5 seconds
  retention: 60
}, {
  interval: 15,           // Every 15 seconds
  retention: 60
}],
chartVisibility: {
  cpu: true,
  mem: true,
  load: true,
  eventLoop: true,
  heap: true,
  responseTime: true,
  rps: true,
  statusCodes: true
},
healthChecks: [],
ignoreStartsWith: '/admin'

```

## Health Checks

You can add a series of health checks to the configuration that will appear below the other stats. The health check will be considered successful if the endpoint returns a 200 status code.

```javascript
// config
healthChecks: [
  {
    protocol: 'http',
    host: 'localhost',
    path: '/admin/health/ex1',
    port: '3000',
  },
  {
    protocol: 'http',
    host: 'localhost',
    path: '/admin/health/ex2',
    port: '3000',
  },
];
```

![Health Checks](https://i.imgur.com/6tY4OhA.png 'Health Checks')

## Using module with socket.io in project

If you're using socket.io in your project, this module could break your project because this module by default will spawn its own socket.io instance. To mitigate that, fill websocket parameter with your main socket.io instance as well as port parameter.

## License

[MIT License](https://opensource.org/licenses/MIT) © [frozenjs](https://github.com/Pnlvfx)
