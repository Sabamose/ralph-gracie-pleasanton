// Local preview with Vercel-style clean URLs: node serve.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";

const root = join(process.cwd(), "site");
const port = Number(process.env.PORT || process.argv[2] || 4790);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".txt": "text/plain", ".json": "application/json" };

createServer(async (req, res) => {
  let p = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  if (p.endsWith("/")) p += "index.html";
  const candidates = [p, p + ".html"];
  for (const c of candidates) {
    const file = join(root, c);
    if (!file.startsWith(root)) break;
    try {
      if ((await stat(file)).isFile()) {
        res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
        return res.end(await readFile(file));
      }
    } catch {}
  }
  res.writeHead(404, { "content-type": "text/plain" }).end("Not found");
}).listen(port, () => console.log(`http://localhost:${port}`));
