// Run in a Wix page: returns every top-level section with its components, styles and media ids.
(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 350) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
  scrollTo(0, 0); await new Promise(r => setTimeout(r, 400));
  const mid = s => { const m = (s || "").match(/static\.wixstatic\.com\/media\/([^/?"')\s]+)/); return m ? m[1] : null; };
  const px = n => Math.round(n);
  const tops = [...document.querySelectorAll("header, footer, section")].filter(s => !s.parentElement.closest("section") && !s.closest("header section, footer section")) ;
  const out = [];
  for (const s of tops) {
    const sr = s.getBoundingClientRect(); const top = sr.top + scrollY;
    const sec = { tag: s.tagName, id: s.id, top: px(top), h: px(sr.height), bg: [], items: [] };
    s.querySelectorAll('[data-testid="bgLayers"] img, [data-testid="bgLayers"] video, [data-testid="colorUnderlay"], [data-testid="bgMedia"] img').forEach(b => {
      const cs = getComputedStyle(b);
      sec.bg.push(b.tagName === "IMG" ? "img:" + mid(b.src || b.currentSrc) + (cs.filter !== "none" ? " filter:" + cs.filter : "") + " fit:" + cs.objectFit
        : b.tagName === "VIDEO" ? "video:" + (b.currentSrc || b.src || b.poster)
        : "color:" + cs.backgroundColor + " op:" + cs.opacity);
    });
    const seen = new Set();
    s.querySelectorAll('[data-testid="richTextElement"], a, button, img, iframe, [data-testid="svgRoot"], [data-testid="linkElement"]').forEach(el => {
      if (el.closest('[data-testid="bgLayers"]')) return;
      const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return;
      const box = [px(r.left), px(r.top + scrollY - top), px(r.width), px(r.height)].join(",");
      if (el.matches('[data-testid="richTextElement"]')) {
        const first = el.querySelector("h1,h2,h3,h4,h5,h6,p,li") || el;
        const span = first.querySelector("span[style*=font], span") || first;
        const cs = getComputedStyle(span), pcs = getComputedStyle(first);
        sec.items.push({ t: "text", box, tag: first.tagName, ff: cs.fontFamily.split(",")[0].replace(/"/g, ""), fs: cs.fontSize, fw: cs.fontWeight, c: cs.color, al: pcs.textAlign, ls: cs.letterSpacing, lh: pcs.lineHeight, tt: cs.textTransform, html: el.innerHTML.length < 6000 ? el.innerText : el.innerText.slice(0, 6000) });
      } else if (el.tagName === "IMG") {
        const cs = getComputedStyle(el); const wrap = el.closest('[data-testid="imageX"], wix-image, [data-hook]') || el.parentElement;
        sec.items.push({ t: "img", box, id: mid(el.src || el.currentSrc), alt: el.alt, fit: cs.objectFit, radius: getComputedStyle(wrap).borderRadius, op: cs.opacity });
      } else if (el.tagName === "IFRAME") {
        sec.items.push({ t: "iframe", box, src: el.src || el.dataset.src });
      } else if (el.matches('[data-testid="svgRoot"]')) {
        const svg = el.querySelector("svg"); sec.items.push({ t: "svg", box, svg: svg ? svg.outerHTML.slice(0, 300) : "" });
      } else {
        const key = el.textContent.trim() + el.getAttribute("href"); if (seen.has(key) || (!el.textContent.trim() && !el.querySelector("img,svg"))) return; seen.add(key);
        const cs = getComputedStyle(el); const lab = el.querySelector("span") || el; const lcs = getComputedStyle(lab);
        sec.items.push({ t: el.tagName === "BUTTON" ? "button" : "link", box, text: el.textContent.trim().slice(0, 80), href: el.getAttribute("href"), bg: cs.backgroundColor, bc: cs.borderColor + " " + cs.borderWidth, radius: cs.borderRadius, ff: lcs.fontFamily.split(",")[0].replace(/"/g, ""), fs: lcs.fontSize, c: lcs.color });
      }
    });
    out.push(sec);
  }
  return { url: location.pathname, title: document.title, desc: document.querySelector('meta[name=description]')?.content, w: innerWidth, H: document.body.scrollHeight, out };
})()
