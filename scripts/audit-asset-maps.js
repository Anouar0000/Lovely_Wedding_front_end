const fs = require("fs");
const path = require("path");
const https = require("https");

function collectFromFile(filePath) {
  const t = fs.readFileSync(filePath, "utf8");
  const assets = new Set();

  // plain "/assets/..."
  const rePlain = /["'`](\/assets\/[^"'`?]+)(?:\?[^"'`]*)?["'`]/g;
  let m;
  while ((m = rePlain.exec(t))) assets.add(m[1]);

  // template `${FIGMA}/file.ext` with FIGMA/BASE constants
  const baseMatch = t.match(/const\s+BASE\s*=\s*["'`]([^"'`]+)["'`]/);
  const figmaMatch = t.match(/const\s+FIGMA\s*=\s*`\$\{BASE\}\/([^`]+)`/) ||
    t.match(/const\s+FIGMA\s*=\s*["'`]([^"'`]+)["'`]/);
  const base = baseMatch ? baseMatch[1] : "";
  let figma = "";
  if (figmaMatch) {
    figma = figmaMatch[0].includes("${BASE}")
      ? `${base}/${figmaMatch[1]}`
      : figmaMatch[1];
  }

  const reTpl = /\$\{FIGMA\}\/([A-Za-z0-9._\-\/]+)/g;
  while ((m = reTpl.exec(t))) {
    if (figma) assets.add(`${figma}/${m[1]}`.replace(/\/+/g, "/").replace(":/", "://"));
  }
  const reBase = /\$\{BASE\}\/([A-Za-z0-9._\-\/]+)/g;
  while ((m = reBase.exec(t))) {
    if (base) assets.add(`${base}/${m[1]}`.replace(/\/+/g, "/"));
  }

  // Normalize accidental missing leading slash
  return [...assets].map((a) => (a.startsWith("/") ? a : `/${a}`));
}

function liveHead(asset) {
  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: "lovely-wedding-v2.web.app",
        path: asset,
        method: "HEAD",
        timeout: 15000,
      },
      (res) => resolve(res.statusCode || 0)
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
  const maps = [
    "src/components/home/homeDigitalAssets.js",
    "src/components/home/homePhysicalAssets.js",
  ].filter((f) => fs.existsSync(f));

  const all = new Set();
  for (const f of maps) {
    for (const a of collectFromFile(f)) all.add(a);
  }

  const missingLocal = [];
  for (const asset of [...all].sort()) {
    const local = path.join("public", asset.replace(/^\//, ""));
    if (!fs.existsSync(local)) missingLocal.push(asset);
  }

  console.log("MAP_ASSETS", all.size);
  console.log("MAP_MISSING_LOCAL", missingLocal.length);
  missingLocal.forEach((a) => console.log("MISS_LOCAL", a));

  let bad = 0;
  const list = [...all].sort();
  console.log("LIVE_ALL", list.length);
  for (const asset of list) {
    const code = await liveHead(asset);
    if (code !== 200) {
      bad += 1;
      console.log("LIVE_BAD", code, asset);
    }
  }
  console.log("LIVE_BAD_COUNT", bad);
})();
