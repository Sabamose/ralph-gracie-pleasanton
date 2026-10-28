// Group gallery media ids by album container, in page order: node tools/gallery.mjs > import/gallery.json
import { readFileSync } from "node:fs";
const h = readFileSync("import/html/gallery.html", "utf8");
const albums = [
  ["comp-m7jrzfxe", "Women's Self Defense Seminar - 2025"],
  ["comp-m7js7d7l", "Kids Belt Promotion - October 2024"],
  ["comp-m7js8z2l6", "Adults Belt Promotion - October 2024"],
  ["comp-m7jwwvb4", "Ralph Gracie Seminar - October 2024"],
  ["comp-mbpxhdns", "Rayron Gracie Seminar - March 2025 (adults)"],
  ["comp-mbpya7n1", "Ralph Gracie Seminar - October 2024 (kids)"],
];
const starts = albums.map(([c]) => ({ c, at: h.indexOf(`gallery-horizontal-scroll-${c}`) })).sort((a, b) => a.at - b.at);
const out = albums.map(([c, title]) => {
  const s = starts.find((x) => x.c === c); const next = starts.find((x) => x.at > s.at);
  const chunk = h.slice(s.at, next ? next.at : h.length);
  const ids = [...new Set([...chunk.matchAll(/static\.wixstatic\.com\/media\/(a6419c_[0-9a-f]{32}~mv2\.(?:jpe?g|png|webp|avif))/g)].map((m) => m[1]))];
  return { comp: c, title, ids };
});
console.log(JSON.stringify(out, null, 1));
console.error(out.map((a) => `${a.title}: ${a.ids.length}`).join("\n"));
