(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 350) { scrollTo(0, y); await new Promise(r => setTimeout(r, 110)); }
  scrollTo(0, 0); await new Promise(r => setTimeout(r, 400));
  const F = { e070466379b24dac90cd74171bd2f33f: "A500", c084e31adc9041c8831e2b6a21617659: "A900", "49d625cba3524def8af3c0a3b738d3ae": "A400", dceb9b269f364ecead3adaafd39233c8: "A800", "77de7426c4064d11ad692ed4ada50b2b": "A300", "6150b7a721d94a20bb8f2b39250a2891": "A700" };
  const ff = s => { s = s.split(",")[0].replace(/"/g, ""); const k = s.replace("wfont_90a441_", ""); return F[k] || s.replace("madefor-text-bold", "M700").replace("madefor-text", "M400"); };
  const mid = s => { const m = (s || "").match(/static\.wixstatic\.com\/media\/([^/?"')\s]+)/); return m ? m[1].replace("%7E", "~") : null; };
  const P = n => Math.round(n);
  const tops = [...document.querySelectorAll("main section")].filter(s => !s.parentElement.closest("section"));
  const lines = [];
  for (const s of tops) {
    const sr = s.getBoundingClientRect(); const top = sr.top + scrollY;
    const bgs = [...s.querySelectorAll('[data-testid="colorUnderlay"]')].map(b => getComputedStyle(b).backgroundColor).slice(0, 1);
    const bgi = [...s.querySelectorAll('[data-testid="bgLayers"] img')].map(i => mid(i.src) + " op" + getComputedStyle(i).opacity);
    const vid = [...s.querySelectorAll("[data-video-info]")].map(v => JSON.parse(v.getAttribute("data-video-info")).videoId);
    lines.push(`## ${s.id} top=${P(top)} h=${P(sr.height)} bg=${bgs.join()} ${bgi.length ? "bgimg=" + bgi.join(",") : ""} ${vid.length ? "video=" + vid : ""}`);
    const seen = new Set();
    s.querySelectorAll('[data-testid="richTextElement"], a, img, iframe').forEach(el => {
      if (el.closest('[data-testid="bgLayers"]')) return;
      const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return;
      const b = `[${P(r.left)},${P(r.top + scrollY - top)},${P(r.width)}x${P(r.height)}]`;
      if (el.matches('[data-testid="richTextElement"]')) {
        const first = el.querySelector("h1,h2,h3,h4,h5,h6,p,li") || el; const sp = first.querySelector("span[style*=font], span") || first;
        const cs = getComputedStyle(sp), pc = getComputedStyle(first);
        lines.push(`T ${b} ${first.tagName} ${ff(cs.fontFamily)} ${parseFloat(cs.fontSize).toFixed(1)}px ${cs.color.replace(/rgb\((\d+), (\d+), (\d+)\)/, "rgb($1,$2,$3)")} ${pc.textAlign} ls=${cs.letterSpacing} lh=${pc.lineHeight} :: ${el.innerText.replace(/\n{2,}/g, " ¶ ").replace(/\n/g, " / ")}`);
      } else if (el.tagName === "IMG") {
        lines.push(`I ${b} ${mid(el.src || el.currentSrc)} alt="${el.alt}" fit=${getComputedStyle(el).objectFit} op=${getComputedStyle(el).opacity}`);
      } else if (el.tagName === "IFRAME") {
        lines.push(`F ${b} ${el.src || el.dataset.src}`);
      } else {
        const t = el.textContent.trim(); const k = t + el.href; if (!t || seen.has(k)) return; seen.add(k);
        const cs = getComputedStyle(el);
        lines.push(`L ${b} "${t.slice(0, 60)}" -> ${(el.getAttribute("href") || "").slice(0, 200)} bg=${cs.backgroundColor} r=${cs.borderRadius}`);
      }
    });
  }
  return lines.join("\n");
})()
