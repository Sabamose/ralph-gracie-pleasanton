// Turn the inline Wix vectors into standalone SVG files: node tools/assets.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const out = "src/media/brand"; mkdirSync(out, { recursive: true });
const clean = (s) => s.replace(/\s(role|aria-hidden|aria-label|data-bbox|data-type|class|preserveAspectRatio)="[^"]*"/g, "").replace(/<\?xml[^>]*>/g, "");
const ensureNs = (s) => (s.includes('xmlns="http://www.w3.org/2000/svg"') ? s : s.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"'));

// 1. Logo (header)
writeFileSync(`${out}/logo.svg`, ensureNs(clean(readFileSync("import/svg/home/03-?.svg", "utf8"))));

// 2. Crest used in the badge strips (stored as a <symbol> in Wix's DOM store)
const store = readFileSync("import/svg/home/00-?.svg", "utf8");
const sym = store.match(/<symbol[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/symbol>/);
const crestBody = sym[2].replace(/var\(--svg-color-1,(#[0-9a-fA-F]+)\)/g, "$1");
writeFileSync(`${out}/crest-white.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${sym[1]}">${crestBody}</svg>`);

// 3. Watermark crest on the intro section: rgb(36,35,35) at 6% fill opacity
let wm = clean(readFileSync("import/svg/home/04-comp-m718711m.svg", "utf8"));
wm = ensureNs(wm).replace("<svg", '<svg fill="#242323" fill-opacity="0.06"');
writeFileSync(`${out}/crest-watermark.svg`, wm);

// 4. White crest flanking the Classes / Team page titles
writeFileSync(`${out}/crest-header.svg`, ensureNs(clean(readFileSync("import/svg/classes/03-comp-m725k2qz.svg", "utf8"))));

for (const f of ["logo", "crest-white", "crest-watermark", "crest-header"]) console.log(f, readFileSync(`${out}/${f}.svg`, "utf8").length, "bytes");
