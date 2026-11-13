const fs = require("fs");
const path = require("path");
const https = require("https");

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === "build" || e.name === ".git") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(jsx?|tsx?|css)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const files = walk(path.join(process.cwd(), "src"));
const re = /["'`](\/assets\/[^"'`?]+)(?:\?[^"'`]*)?["'`]/g;
const refs = new Map();

for (const f of files) {
  const t = fs.readFileSync(f, "utf8");
  let m;
  while ((m = re.exec(t))) {
    const asset = m[1];
    if (!refs.has(asset)) refs.set(asset, new Set());
    refs.get(asset).add(path.relative(process.cwd(), f).replace(/\\/g, "/"));
  }
}

const missing = [];
const present = [];
const svgRefs = [];

for (const [asset, from] of [...refs.entries()].sort()) {
  const local = path.join(process.cwd(), "public", asset.replace(/^\//, ""));
  const exists = fs.existsSync(local);
  const ext = path.extname(asset).toLowerCase();
  if (!exists) missing.push({ asset, from: [...from] });
  else present.push(asset);
  if (ext === ".svg") svgRefs.push({ asset, exists, from: [...from] });
}

function liveStatus(urlPath) {
  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: "lovely-wedding-v2.web.app",
        path: urlPath,
        method: "HEAD",
        timeout: 12000,
      },
      (res) => resolve(res.statusCode)
    );
    req.on("error", () => resolve(0));
    req.on("timeout", () => {
      req.destroy();
      resolve(0);
    });
    req.end();
  });
}

(async () => {
  console.log("TOTAL_PUBLIC_REFS", refs.size);
  console.log("MISSING_LOCAL", missing.length);
  missing.forEach((m) => console.log("MISS", m.asset, "<-", m.from.join(" | ")));
  console.log("SVG_STRING_REFS", svgRefs.length);
  svgRefs.forEach((s) => console.log(s.exists ? "SVG_OK" : "SVG_MISS", s.asset, "<-", s.from[0]));

  const critical = [
    ...svgRefs.map((s) => s.asset),
    "/assets/home-digital/figma/sur-mesure-stars.png",
    "/assets/home-digital/figma/sur-mesure-vip-badge.svg",
    "/assets/home-digital/figma/circle-check-rose.svg",
    "/assets/home-digital/figma/arrow-right-dark.svg",
    "/assets/digital/sidi-bousaid/entrance.mp4",
    "/assets/digital/club-capri/entrance.mp4",
    "/assets/digital/sakura-koi/entrance.mp4",
    "/assets/home-physical/figma/promo-card.png",
  ];
  const uniq = [...new Set(critical)];
  console.log("LIVE_CHECK", uniq.length);
  for (const asset of uniq) {
    const code = await liveStatus(asset);
    console.log(code === 200 ? "LIVE_OK" : `LIVE_${code}`, asset);
  }
})();
