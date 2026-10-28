// Extract every Wix rich-text block (by component id) from saved pages: node tools/texts.mjs
import { readFileSync, writeFileSync } from "node:fs";
const ENT = { nbsp: " ", amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", ndash: "\u2013", mdash: "\u2014", rsquo: "\u2019", lsquo: "\u2018", rdquo: "\u201d", ldquo: "\u201c", hellip: "\u2026", bull: "\u2022", middot: "\u00b7", copy: "\u00a9", eacute: "\u00e9", aacute: "\u00e1", ccedil: "\u00e7" };
const decode = (s) => s.replace(/&([a-z]+);/g, (m, n) => ENT[n] ?? m).replace(/&#160;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/[​﻿]/g, "");
const all = {};
for (const page of ["home", "classes", "team", "gallery", "schedule", "schedule-1"]) {
  const h = readFileSync(`import/html/${page}.html`, "utf8");
  const re = /<div id="(comp-[a-z0-9_-]+)"[^>]*data-testid="richTextElement"[^>]*>([\s\S]*?)<\/div>/g;
  const blocks = {}; let m;
  while ((m = re.exec(h))) {
    const paras = [...m[2].matchAll(/<(p|h[1-6]|li)\b[^>]*>([\s\S]*?)<\/\1>/g)].map((x) => decode(x[2].replace(/<br\s*\/?>/g, "\n").replace(/<[^>]+>/g, "")).replace(/[ \t]+/g, " ").trim());
    blocks[m[1]] = { tag: (m[2].match(/<(p|h[1-6]|li)\b/) || [])[1], paras };
  }
  all[page] = blocks;
  console.log(`== ${page}`);
  for (const [id, b] of Object.entries(blocks)) console.log(`  ${id} ${b.tag} [${b.paras.length}] ${b.paras.filter(Boolean)[0]?.slice(0, 60) ?? ""}`);
}
writeFileSync("import/texts.json", JSON.stringify(all, null, 1));
