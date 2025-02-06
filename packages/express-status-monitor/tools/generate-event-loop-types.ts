import path from 'node:path';
import fs from 'node:fs/promises';

const types = await fs.readFile('./node_modules/event-loop-stats/src/eventLoopStats.d.ts', { encoding: 'utf8' });
const lastIndex = types.lastIndexOf('}');

const file = process.argv[2];
if (!file) throw new Error('Please provide the output for the generated types.');

await fs.mkdir(path.dirname(file), { recursive: true });
await fs.writeFile(file, `${types.slice(0, lastIndex + 1)}\n`);
