#!/usr/bin/env node
// Serves the Corner Shop demo locally. No dependencies, Node.js 18+.
//   node serve.mjs              → http://localhost:4173/
//   node serve.mjs --port 8080  → another port

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)));
const portFlag = process.argv.indexOf('--port');
const PORT = Number(portFlag > -1 ? process.argv[portFlag + 1] : (process.env.PORT ?? 4173));

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

async function fileInfo(path) {
  try {
    return await stat(path);
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    let filePath = resolve(ROOT, `.${pathname}`);
    if (filePath !== ROOT && !filePath.startsWith(ROOT + sep)) {
      response.writeHead(403).end();
      return;
    }

    let info = await fileInfo(filePath);
    if (info?.isDirectory()) {
      if (!pathname.endsWith('/')) {
        response.writeHead(301, { Location: `${pathname}/${url.search}` }).end();
        return;
      }
      filePath = join(filePath, 'index.html');
      info = await fileInfo(filePath);
    }
    if (!info?.isFile()) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
      return;
    }

    response.writeHead(200, {
      'Content-Type': TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(await readFile(filePath));
  } catch {
    response.writeHead(500).end();
  }
});

server.listen(PORT, '127.0.0.1', () => {
  const { port } = server.address();
  console.log(`Corner Shop is running at http://localhost:${port}/`);
  console.log('Press Ctrl+C to stop.');
});
