import express from 'express';
import { statusMonitor } from '@goatjs/express-status-monitor';

const app = express();
app.disable('x-powered-by');

app.use(await statusMonitor());
app.use(express.urlencoded({ extended: true, limit: '500mb' }));
app.use(express.json({ limit: '500mb' }));
app.set('trust proxy', true);

app.listen(4000);

// eslint-disable-next-line no-console
console.log('Server listening to port', 4000);
