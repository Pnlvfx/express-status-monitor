import type { EventLoopStats } from 'event-loop-stats';
interface EventLoop {
  sense: () => EventLoopStats;
}

export const getEventLoopStats = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, unicorn/prefer-module
    const eventLoopStats = require('event-loop-stats') as EventLoop;
    return eventLoopStats;
  } catch {
    // eslint-disable-next-line no-console
    console.warn('Ignoring event loop metrics, to include event loop metrics run npm install event-loop-stats');
    return;
  }
};
