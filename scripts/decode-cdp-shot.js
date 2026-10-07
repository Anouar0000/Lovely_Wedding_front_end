/* Décode une capture CDP (Page.captureScreenshot) vers un fichier image. */
const fs = require("fs");

const [, , jsonPath, outPath] = process.argv;
if (!jsonPath || !outPath) {
  console.error("usage: node decode-cdp-shot.js <cdp-response.json> <out.jpg>");
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const data = payload.data || (payload.result && payload.result.data);
if (!data) {
  console.error("Aucun champ 'data' dans", jsonPath);
  process.exit(1);
}

fs.writeFileSync(outPath, Buffer.from(data, "base64"));
console.log("ok", outPath, fs.statSync(outPath).size, "octets");
