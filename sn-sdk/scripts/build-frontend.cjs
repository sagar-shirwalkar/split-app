const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const FRONTEND_DIR = path.join(ROOT, "frontend");
const SDK_DIR = path.resolve(__dirname, "..");
const OUT_FILE = path.join(SDK_DIR, "src", "fluent", "ui-page.now.ts");

function getCurrentScope() {
  const configPath = path.join(SDK_DIR, "now.config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  return config.scope || "x_split";
}

function getHtml() {
  const distXml = path.join(FRONTEND_DIR, "dist", "ui-page.xml");
  const fallback = path.join(FRONTEND_DIR, "dist", "index.html");

  if (fs.existsSync(distXml)) {
    const xml = fs.readFileSync(distXml, "utf8");
    const m = xml.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
    if (m) return m[1].trim();
  }
  if (fs.existsSync(fallback)) {
    return fs.readFileSync(fallback, "utf8");
  }
  return null;
}

function stripModuleAttrs(html) {
  return html
    .replace(/<script\s+type="module"\s+crossorigin>/g, "<script>")
    .replace(/<script\s+crossorigin\s+type="module"\s*>/g, "<script>");
}

function main() {
  console.log("Building frontend...");
  execSync("npm run build:ui-page", { cwd: FRONTEND_DIR, stdio: "inherit" });

  const html = getHtml();
  if (!html) {
    console.error("No built frontend found.");
    process.exit(1);
  }

  const cleaned = stripModuleAttrs(html);
  const scope = getCurrentScope();
  const escaped = cleaned
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\${/g, "\\${");

  const content = `import { UiPage } from "@servicenow/sdk/core";

UiPage({
  $id: Now.ID["split-ui-page"],
  endpoint: \`${scope}_split_app.do\`,
  direct: true,
  html: \`${escaped}\`,
  category: "general",
  description: "Split App — track shared expenses and settle up with friends",
});
`;

  fs.writeFileSync(OUT_FILE, content);
  console.log(`Generated: ${OUT_FILE}`);
}

main();
