# Print family/style/copyright/license from TTF name tables: python3 -I tools/fontname.py import/fonts/*.ttf
import sys, struct
def names(path):
    d = open(path, "rb").read()
    if d[:4] not in (b"\x00\x01\x00\x00", b"OTTO", b"true"): return {"err": d[:4]}
    n = struct.unpack(">H", d[4:6])[0]
    for i in range(n):
        tag, _, off, ln = struct.unpack(">4sIII", d[12 + 16*i: 28 + 16*i])
        if tag == b"name":
            t = d[off:off+ln]; cnt, so = struct.unpack(">HH", t[2:6]); out = {}
            for j in range(cnt):
                pid, eid, lid, nid, l, o = struct.unpack(">6H", t[6+12*j:18+12*j])
                if nid in (0, 1, 2, 4, 13, 14) and nid not in out:
                    raw = t[so+o: so+o+l]
                    out[nid] = raw.decode("utf-16-be", "ignore") if pid in (0, 3) else raw.decode("latin-1")
            return out
for p in sys.argv[1:]:
    o = names(p); short = p.split("/")[-1][:20]
    print(f"{short}  family={o.get(1)!r} style={o.get(2)!r} full={o.get(4)!r}")
    print(f"{'':20}  (c) {str(o.get(0))[:110]!r}")
    print(f"{'':20}  license {str(o.get(13) or o.get(14))[:110]!r}")
