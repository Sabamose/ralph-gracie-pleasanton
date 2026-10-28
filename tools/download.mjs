// Download every Wix media asset for the migration: node tools/download.mjs
// Images come from Wix's image service at display size as WebP; videos as MP4.
import { mkdirSync, writeFileSync, existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = "src/media";
const IMG = "https://static.wixstatic.com/media";
const VID = "https://video.wixstatic.com/video";

// [output path, wix media id, max width, max height, format]
const images = [
  ["home/hero.webp", "a6419c_a31599d10bc347e2b8897b1476bf80be~mv2.jpg", 1920, 1920],
  ["home/ralph-gracie.webp", "a6419c_3e0fef0a5471442ca2ffc2cf64ec5c40~mv2.jpg", 1000, 1000],
  ["home/slide-1.webp", "a6419c_2acb019da982450fab2ed5c39b09df0d~mv2.png", 1800, 904],
  ["home/slide-2.webp", "a6419c_63e4132aed41480e9294cbbdb13ac7b5~mv2.jpg", 1800, 904],
  ["home/slide-3.webp", "a6419c_2c952484b8064667b6e7a4c40935de88~mv2.jpg", 1800, 904],
  ["home/slide-4.webp", "a6419c_49a32d37bd134176a1d7a5a546ffd688~mv2.jpg", 1800, 904],
  ["home/slide-5.webp", "a6419c_2bff21e3fdf24aab855b91af458e1d7d~mv2.jpg", 1800, 904],
  ["home/strip-01.webp", "a6419c_368be6bad5c54a28903666698505413c~mv2.jpg", 1400, 764],
  ["home/strip-02.webp", "a6419c_313019754b2e40a78ec4289795c3030a~mv2.jpg", 1400, 764],
  ["home/strip-03.webp", "a6419c_0be4c75d57874af1a3e5d12e8b4acd21~mv2.jpg", 1400, 764],
  ["home/strip-04.webp", "a6419c_40ed7f5cf95a45e0b7ba011b5053bc3b~mv2.jpg", 1400, 764],
  ["home/strip-05.webp", "a6419c_2bff21e3fdf24aab855b91af458e1d7d~mv2.jpg", 1400, 764],
  ["home/strip-06.webp", "a6419c_52c73ec167f74f9eb2b4847e1b145d8e~mv2.jpg", 1400, 764],
  ["home/strip-07.webp", "a6419c_2c952484b8064667b6e7a4c40935de88~mv2.jpg", 1400, 764],
  ["home/strip-08.webp", "a6419c_05f921d41c1542ffae3c3a0346daaad3~mv2.jpg", 1400, 764],
  ["home/strip-09.webp", "a6419c_49a32d37bd134176a1d7a5a546ffd688~mv2.jpg", 1400, 764],
  ["home/strip-10.webp", "a6419c_f5f464586fb54df8a25453a306492e74~mv2.avif", 1400, 764],
  ["home/contact-poster.webp", "a6419c_1ba463f4abec44fd80043e9bae5b3958f000.jpg", 960, 1700],
  ["classes/bjj.webp", "a6419c_f4fc397145954ef789f6ece6d2d0cf4f~mv2.jpg", 1400, 1400],
  ["classes/no-gi.webp", "a6419c_e40b4eee0cba4caba02bbd6ecf5b94ef~mv2.jpeg", 1400, 1400],
  ["classes/muay-thai.webp", "a6419c_8668a00518d44e588e259663bc827340~mv2.jpg", 1400, 1400],
  ["classes/conditioning-a.webp", "a6419c_123b095472534456bff20ea2e9facf73~mv2.jpg", 1400, 1400],
  ["classes/conditioning-b.webp", "a6419c_6243eb8796e743c6959dcb691555b06d~mv2.jpeg", 1400, 1400],
  ["classes/kids.webp", "a6419c_e271d48f74ae4ddcae24a3f366938198~mv2.jpg", 1400, 1500],
  ["classes/women.webp", "a6419c_e2c2ab010351410bb7bd627f77022e11~mv2.jpg", 1400, 1100],
  ["team/marcio-moreira.webp", "a6419c_7e698308e1de4d87bca2afcab3dcd726~mv2.jpg", 800, 800],
  ["team/zack-johnson.webp", "a6419c_7fdb4b0611694533819624ee3355a9b6~mv2.jpg", 800, 800],
  ["team/jay-radhakrishnan.webp", "a6419c_0ccc33f30fe04f70a990fb4280595316~mv2.jpeg", 800, 800],
  ["team/carlos-roa.webp", "a6419c_be8e5f17f5c74806ade2b8457745a08c~mv2.jpg", 800, 800],
  ["team/chris.webp", "a6419c_1d1d564aa340462cbdf8a92652b6ae1f~mv2.jpg", 800, 800],
  ["team/ralph-zavala.webp", "a6419c_222ade14ae38458abbd0a596d52f62f9~mv2.jpg", 800, 800],
  ["team/miguel.webp", "a6419c_a784beb6543c41518d51577652315c5c~mv2.jpg", 600, 600],
  ["team/pedro.webp", "a6419c_75b3c2827d944fc4952ae8e91101b8d9~mv2.jpg", 600, 600],
  ["team/gunnar.webp", "a6419c_32a0fd751ad248098d93c1aa63a0464c~mv2.jpeg", 600, 600],
  ["schedule/poster.webp", "a6419c_17b705c7086e4c05a02415c53aa054e9f000.jpg", 1080, 1920],
  ["schedule/timetable.webp", "a6419c_a8e8c2941eb0469ebb4f6e13f99c70bc~mv2.png", 2006, 1574, 95],
  ["brand/favicon.png", "a6419c_7d1669a02f64481b942825f02d86f20a~mv2.png", 192, 192],
  ["brand/og.jpg", "a6419c_c99a9bba6dfe4badbbe70aca7893bc8b~mv2.png", 1200, 1200],
];

const videos = [
  ["home/contact.mp4", "a6419c_1ba463f4abec44fd80043e9bae5b3958", ["480p", "360p"]],
  ["schedule/background.mp4", "a6419c_17b705c7086e4c05a02415c53aa054e9", ["720p", "480p"]],
];

// Gallery: full size for the viewer + a thumbnail for the strips
const gallery = JSON.parse(readFileSync("import/gallery.json", "utf8"));
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
for (const a of gallery) {
  a.ids.forEach((id, i) => {
    const n = String(i + 1).padStart(2, "0");
    images.push([`gallery/${slug(a.title)}/${n}.webp`, id, 1800, 1400]);
    images.push([`gallery/${slug(a.title)}/${n}-thumb.webp`, id, 1100, 600, 80]);
  });
}

const url = ([path, id, w, h, q = 85]) => {
  const ext = path.split(".").pop();
  return `${IMG}/${id}/v1/fit/w_${w},h_${h},q_${q}/file.${ext}`;
};

async function get(u, dest) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(u);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const buf = Buffer.from(await r.arrayBuffer());
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, buf);
      return buf.length;
    } catch (e) {
      if (attempt === 3) throw e;
      await new Promise((r) => setTimeout(r, 600 * attempt));
    }
  }
}

const jobs = images.map((m) => async () => {
  const dest = join(OUT, m[0]);
  if (existsSync(dest) && statSync(dest).size > 0) return [m[0], "cached"];
  return [m[0], await get(url(m), dest)];
});
for (const [path, id, qualities] of videos) {
  jobs.push(async () => {
    const dest = join(OUT, path);
    if (existsSync(dest) && statSync(dest).size > 0) return [path, "cached"];
    for (const q of qualities) {
      try { return [path + ` (${q})`, await get(`${VID}/${id}/${q}/mp4/file.mp4`, dest)]; } catch (_) {}
    }
    throw new Error("no video quality available for " + id);
  });
}

let done = 0, bytes = 0; const failed = [];
const worker = async () => {
  while (jobs.length) {
    const job = jobs.shift();
    try { const [p, n] = await job(); done++; if (typeof n === "number") bytes += n; if (!p.includes("/gallery/") || done % 40 === 0) console.log(`${String(done).padStart(3)}  ${p}  ${typeof n === "number" ? (n / 1024).toFixed(0) + " KB" : n}`); }
    catch (e) { failed.push(e.message); }
  }
};
await Promise.all(Array.from({ length: 8 }, worker));
console.log(`\n${done} files, ${(bytes / 1048576).toFixed(1)} MB downloaded${failed.length ? `, ${failed.length} FAILED:\n` + failed.join("\n") : ", 0 failed"}`);
