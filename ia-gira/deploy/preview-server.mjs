import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer, request as httpRequest } from 'node:http';
import { extname, join, normalize } from 'node:path';

const host = process.env.PREVIEW_HOST || '192.168.1.145';
const port = Number(process.env.PREVIEW_PORT || 8088);
const root = process.env.SITE_ROOT || '/opt/ia-gira/site';
const apiHost = process.env.API_HOST || '127.0.0.1';
const apiPort = Number(process.env.API_PORT || 8787);
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://gira.lonquensur.cl';

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function headers(contentType) {
  return {
    'content-type': contentType,
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'referrer-policy': 'same-origin',
    'content-security-policy': "default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'",
  };
}

function proxyApi(clientRequest, clientResponse, pathname) {
  const upstreamPath = pathname.replace(/^\/api/, '') || '/';
  const upstreamHeaders = {
    'content-type': clientRequest.headers['content-type'] || 'application/json',
    origin: allowedOrigin,
  };
  if (clientRequest.headers['content-length']) {
    upstreamHeaders['content-length'] = clientRequest.headers['content-length'];
  }
  const upstream = httpRequest({
    hostname: apiHost,
    port: apiPort,
    method: clientRequest.method,
    path: upstreamPath,
    headers: upstreamHeaders,
    timeout: 35_000,
  }, (response) => {
    const responseHeaders = { ...response.headers };
    delete responseHeaders['access-control-allow-origin'];
    delete responseHeaders['vary'];
    clientResponse.writeHead(response.statusCode || 502, responseHeaders);
    response.pipe(clientResponse);
  });
  upstream.on('timeout', () => upstream.destroy(new Error('API timeout')));
  upstream.on('error', () => {
    if (!clientResponse.headersSent) {
      clientResponse.writeHead(502, headers('application/json; charset=utf-8'));
      clientResponse.end(JSON.stringify({ error: 'El asistente no está disponible temporalmente' }));
    }
  });
  clientRequest.pipe(upstream);
}

async function serveStatic(response, pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { decoded = '/'; }
  const clean = normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');
  let file = join(root, clean);
  try {
    let info = await stat(file);
    if (info.isDirectory()) {
      file = join(file, 'index.html');
      info = await stat(file);
    }
    if (!info.isFile() || !file.startsWith(root + '/')) throw new Error('not found');
    response.writeHead(200, headers(mime[extname(file).toLowerCase()] || 'application/octet-stream'));
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404, headers('text/plain; charset=utf-8'));
    response.end('Página no encontrada');
  }
}

const server = createServer((request, response) => {
  const url = new URL(request.url || '/', `http://${host}:${port}`);
  if (url.pathname.startsWith('/api/')) return proxyApi(request, response, url.pathname);
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, headers('text/plain; charset=utf-8'));
    return response.end('Método no permitido');
  }
  return serveStatic(response, url.pathname);
});

server.listen(port, host, () => {
  console.log(`Vista previa disponible en http://${host}:${port}`);
});
