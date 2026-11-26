// Tiny static server for local testing of the Kalandria statistics site.
// Serves app/ at http://localhost:8080 (or --port <n>). Standard library
// only; not part of the handed-in site, which runs from static files.

import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const port = Number(process.argv[process.argv.indexOf("--port") + 1] || 8080);
const root = join(import.meta.dirname, "app");
const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

createServer((req, res) => {
  const path = normalize("/" + (req.url || "/").split("?")[0].split("#")[0]);
  const file = join(root, path === "/" ? "index.html" : path);
  if (!file.startsWith(root) || !existsSync(file)) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Not found\n");
    return;
  }
  res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
}).listen(port, () => console.log(`Serving app/ at http://localhost:${port}`));
