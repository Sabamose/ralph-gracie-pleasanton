// Pull inline SVGs out of saved Wix HTML: node tools/svgs.mjs import/html/home.html import/svg/home
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const [, , src, outDir] = process.argv;
const html = readFileSync(src, "utf8");
mkdirSync(outDir, { recursive: true });
const re = /<svg[\s\S]*?<\/svg>/g; let m, i = 0; const seen = new Map();
while ((m = re.exec(html))) {
  const svg = m[0];
  if (svg.length < 150) continue;
  const before = html.slice(Math.max(0, m.index - 4000), m.index);
  const comps = [...before.matchAll(/id="(comp-[a-z0-9_]+)"/g)].map(x => x[1]);
  const comp = comps.at(-1) || "?";
  const key = svg.replace(/id="[^"]*"/g, "");
  if (seen.has(key)) { seen.get(key).n++; continue; }
  const vb = (svg.match(/viewBox="([^"]+)"/) || [])[1];
  const fills = [...new Set([...svg.matchAll(/fill="(#[0-9a-fA-F]{3,6})"/g)].map(x => x[1]))].join(" ");
  const file = `${outDir}/${String(i).padStart(2, "0")}-${comp}.svg`;
  writeFileSync(file, svg.includes("xmlns=") ? svg : svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"'));
  seen.set(key, { file, n: 1, len: svg.length, vb, fills });
  i++;
}
for (const v of seen.values()) console.log(`${v.file.split("/").pop().padEnd(34)} x${v.n}  ${String(v.len).padStart(6)}b  vb=${v.vb}  ${v.fills}`);
