const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// Directories to skip during recursive find-and-replace
const SKIP_DIRS = new Set(["node_modules", "dist", ".now", "target", ".git"]);

function httpGet(url, auth) {
  const lib = url.startsWith("https") ? https : http;
  return new Promise((resolve, reject) => {
    const opts = {
      headers: {
        Authorization: "Basic " + Buffer.from(auth).toString("base64"),
      },
    };
    lib
      .get(url, opts, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          if (res.statusCode !== 200)
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          else resolve(JSON.parse(data));
        });
      })
      .on("error", reject);
  });
}

async function main() {
  const instanceUrl = process.argv[2];
  const user = process.argv[3];
  const pass = process.argv[4];
  if (!instanceUrl || !user || !pass) {
    console.error(
      "Usage: node scripts/setup-scope.js <instance-url> <user> <password>",
    );
    process.exit(1);
  }

  const auth = `${user}:${pass}`;
  const cleanUrl = instanceUrl.replace(/\/$/, "");
  const companyCodeUrl = `${cleanUrl}/api/now/table/sys_properties?sysparm_query=name=glide.appcreator.company.code&sysparm_fields=value`;

  console.log("Fetching company code...");
  const result = await httpGet(companyCodeUrl, auth);
  const records = result.result || [];
  const companyCode = records.length > 0 ? records[0].value : "";
  console.log(
    `Company code: ${companyCode || "(empty — no prefix restriction)"}`,
  );

  const configPath = path.join(ROOT, "sn-sdk", "now.config.json");
  const currentConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const currentScope = currentConfig.scope || "x_split";
  const currentAppName = currentScope.split("_").pop(); // "split" from "x_2053373_split" or "x_split"
  const oldScope = currentScope;
  const newScope = companyCode
    ? `x_${companyCode}_${currentAppName}`
    : `x_${currentAppName}`;

  if (oldScope === newScope) {
    console.log(
      "No change needed (scope already matches company code or code is empty).",
    );
    return;
  }

  console.log(`Renaming scope: ${oldScope} → ${newScope}`);

  // All source directories to process
  const dirs = [
    path.join(ROOT, "sn-sdk", "src"),
    path.join(ROOT, "sn"),
    path.join(ROOT, "frontend", "src"),
  ];

  for (const dir of dirs) {
    walkAndReplace(dir, oldScope, newScope);
  }

  // Individual config files outside the src/ trees
  const individualFiles = [
    path.join(ROOT, "sn-sdk", "now.config.json"),
    path.join(ROOT, "frontend", "vite.config.ts"),
  ];

  for (const filePath of individualFiles) {
    replaceInFile(filePath, oldScope, newScope);
  }

  // Also update sn/app.json
  const appJsonPath = path.join(ROOT, "sn", "app.json");
  replaceInFile(appJsonPath, oldScope, newScope);

  // Also update deploy.js
  const deployJsPath = path.join(ROOT, "deploy.js");
  replaceInFile(deployJsPath, oldScope, newScope);

  // Regenerate scopeId in now.config.json
  const { randomUUID } = require("crypto");
  const newScopeId = randomUUID().replace(/-/g, "");
  let config = fs.readFileSync(configPath, "utf8");
  config = config.replace(/("scopeId":\s*)"([^"]+)"/, `$1"${newScopeId}"`);
  fs.writeFileSync(configPath, config);
  console.log(`  Regenerated scopeId: ${newScopeId}`);

  console.log("\nDone! Clean build artifacts and run:");
  console.log(
    `  cd sn-sdk && rm -rf .now/ dist/app/ target/ && npx now-sdk build && npx now-sdk install`,
  );
}

function replaceInFile(filePath, oldStr, newStr) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  const count = (content.match(new RegExp(oldStr, "g")) || []).length;
  if (count > 0) {
    const updated = content.replace(new RegExp(oldStr, "g"), newStr);
    fs.writeFileSync(filePath, updated);
    console.log(`  ${path.relative(ROOT, filePath)} (${count} replacements)`);
  }
}

function walkAndReplace(dir, oldStr, newStr) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip build artifacts and dependencies
      if (SKIP_DIRS.has(entry.name)) continue;
      walkAndReplace(fullPath, oldStr, newStr);
    } else if (entry.isFile()) {
      replaceInFile(fullPath, oldStr, newStr);
    }
  }
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
