const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Configuration
const MODE = process.env.SEISMIC_LIT_MODE || "runtime"; // "runtime" or "bundled"
const ROOT = path.resolve(__dirname, "..", "..");
const FRONTEND_DIR = path.join(ROOT, "frontend");
const SEISMIC_DIR = path.resolve(__dirname, "..");
const HOST_DIR = path.join(SEISMIC_DIR, "x-snc-split-app-host");
const ASSETS_DIR = path.join(HOST_DIR, "assets");

console.log(`Building Seismic component in ${MODE} mode...`);

// Ensure assets directory exists
fs.mkdirSync(ASSETS_DIR, { recursive: true });

// Step 1: Build the frontend with Vite
console.log("Building frontend...");
execSync("npm run build", { cwd: FRONTEND_DIR, stdio: "inherit" });

const htmlPath = path.join(FRONTEND_DIR, "dist", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");

// Extract JS from <script> tag
const scriptMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.error("No script tag found in built HTML.");
  process.exit(1);
}
let js = scriptMatch[1];

// Extract CSS from <style> tag
const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
let css = styleMatch ? styleMatch[1] : "";

// Strip @layer properties{...} block (Jelly treats <percentage>, <length> as XML tags)
css = (function stripLayerProperties(input) {
  const idx = input.indexOf("@layer properties{");
  if (idx === -1) return input;
  let depth = 1;
  let i = idx + "@layer properties{".length;
  while (i < input.length && depth > 0) {
    if (input[i] === "{") depth++;
    if (input[i] === "}") depth--;
    i++;
  }
  return input.slice(0, idx) + input.slice(i);
})(css);

// Strip all @property rules (Jelly treats <percentage> as XML tag)
css = css.replace(/@property\s+--[\w-]+\s*\{[^}]*\}/g, "");

// Strip any remaining empty @layer properties declaration
css = css.replace(/@layer\s+properties;\s*/g, "");

if (MODE === "bundled") {
  // Bundled approach: Save JS and CSS as assets for Seismic component
  console.log("Building in BUNDLED mode - saving JS/CSS as assets");
  
  // Write JS file for asset
  const jsPath = path.join(ASSETS_DIR, "split_app_main.js");
  fs.writeFileSync(jsPath, js);
  
  // Write CSS file for asset
  const cssPath = path.join(ASSETS_DIR, "split_app.css");
  fs.writeFileSync(cssPath, css);
  
  console.log(`Generated: ${jsPath}`);
  console.log(`Generated: ${cssPath}`);
  
  // Generate HTML shell that references the assets AND sets data attribute for mode detection
  const shellHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>SplitApp</title>
    <sdk:now-ux-globals></sdk:now-ux-globals>
    <link rel="stylesheet" href="split_app.css"/>
    <script src="split_app_main.js" type="module"></script>
  </head>
  <body>
    <split-app data-lit-mode="bundled"></split-app>
  </body>
</html>`;

  const htmlOut = path.join(HOST_DIR, "index.html");
  fs.writeFileSync(htmlOut, shellHtml);
  console.log(`Generated: ${htmlOut}`);
  
} else {
  // Runtime approach: Save JS for sys_ui_script, HTML shell for UiPage (existing behavior)
  console.log("Building in RUNTIME mode - preserving existing behavior");
  
  // Write JS file for sys_ui_script
  const jsPath = path.join(HOST_DIR, "split_app_main.jsx");
  fs.writeFileSync(jsPath, js);
  
  // Generate HTML shell for UiPage (references external script)
  const shellHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>SplitApp</title>
    <sdk:now-ux-globals></sdk:now-ux-globals>
    <style>${css}</style>
    <script src="split_app_main.jsx?uxpcb=$[UxFrameworkScriptables.getFlushTimestamp()]" type="module"></script>
  </head>
  <body>
    <split-app></split-app>
  </body>
</html>`;

  const htmlOut = path.join(HOST_DIR, "index.html");
  fs.writeFileSync(htmlOut, shellHtml);
  console.log(`Generated: ${jsPath}`);
  console.log(`Generated: ${htmlOut}`);
}

console.log(`Seismic component build completed in ${MODE} mode!`);