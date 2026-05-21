const https = require("https");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function httpGet(url, auth) {
  return new Promise((resolve, reject) => {
    const opts = { headers: { Authorization: "Basic " + Buffer.from(auth).toString("base64") } };
    https.get(url, opts, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        if (res.statusCode !== 200) reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        else resolve(JSON.parse(data));
      });
    }).on("error", reject);
  });
}

async function main() {
  const instanceUrl = process.argv[2];
  const user = process.argv[3];
  const pass = process.argv[4];
  if (!instanceUrl || !user || !pass) {
    console.error("Usage: node scripts/setup-scope.js <instance-url> <user> <password>");
    process.exit(1);
  }

  const auth = `${user}:${pass}`;
  const cleanUrl = instanceUrl.replace(/\/$/, "");
  const companyCodeUrl = `${cleanUrl}/api/now/table/sys_properties?sysparm_query=name=glide.appcreator.company.code&sysparm_fields=value`;

  console.log("Fetching company code...");
  const result = await httpGet(companyCodeUrl, auth);
  const records = result.result || [];
  const companyCode = records.length > 0 ? records[0].value : "";
  console.log(`Company code: ${companyCode || "(empty — no prefix restriction)"}`);

  const configPath = path.join(ROOT, "sn-sdk", "now.config.json");
  const currentConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const currentScope = currentConfig.scope || "x_split";
  const currentAppName = currentScope.split("_").pop(); // "split" from "x_2053373_split" or "x_split"
  const oldScope = currentScope;
  const newScope = companyCode ? `x_${companyCode}_${currentAppName}` : `x_${currentAppName}`;

  if (oldScope === newScope) {
    console.log("No change needed (scope already matches company code or code is empty).");
    return;
  }

  console.log(`Renaming scope: ${oldScope} → ${newScope}`);

  const dirs = [
    path.join(ROOT, "sn-sdk", "src"),
    path.join(ROOT, "sn"),
  ];

  for (const dir of dirs) {
    walkAndReplace(dir, oldScope, newScope);
  }

  // Also update sn-sdk/now.config.json scope
  let config = fs.readFileSync(configPath, "utf8");
  config = config.replace(new RegExp(`"scope":\\s*"${oldScope}"`), `"scope": "${newScope}"`);
  fs.writeFileSync(configPath, config);
  console.log(`  Updated: sn-sdk/now.config.json`);

  // Also update sn/app.json
  const appJsonPath = path.join(ROOT, "sn", "app.json");
  if (fs.existsSync(appJsonPath)) {
    let appJson = fs.readFileSync(appJsonPath, "utf8");
    appJson = appJson.replace(new RegExp(`"scope":\\s*"${oldScope}"`), `"scope": "${newScope}"`);
    fs.writeFileSync(appJsonPath, appJson);
    console.log(`  Updated: sn/app.json`);
  }

  // Also update deploy.js (which references x_split in some dialogs)
  const deployJsPath = path.join(ROOT, "deploy.js");
  if (fs.existsSync(deployJsPath)) {
    let deployJs = fs.readFileSync(deployJsPath, "utf8");
    const replaced = deployJs.replace(new RegExp(oldScope, "g"), newScope);
    if (replaced !== deployJs) {
      fs.writeFileSync(deployJsPath, replaced);
      console.log(`  Updated: deploy.js`);
    }
  }

  // Regenerate scopeId in now.config.json
  const { randomUUID } = require("crypto");
  const newScopeId = randomUUID().replace(/-/g, "");
  config = fs.readFileSync(configPath, "utf8");
  config = config.replace(/("scopeId":\s*)"([^"]+)"/, `$1"${newScopeId}"`);
  fs.writeFileSync(configPath, config);
  console.log(`  Regenerated scopeId: ${newScopeId}`);

  console.log("\nDone! Clean build artifacts and run:");
  console.log(`  cd sn-sdk && rm -rf .now/ dist/app/ target/ && npx now-sdk build && npx now-sdk install`);
}

function walkAndReplace(dir, oldStr, newStr) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAndReplace(fullPath, oldStr, newStr);
    } else if (entry.isFile()) {
      const content = fs.readFileSync(fullPath, "utf8");
      const count = (content.match(new RegExp(oldStr, "g")) || []).length;
      if (count > 0) {
        const updated = content.replace(new RegExp(oldStr, "g"), newStr);
        fs.writeFileSync(fullPath, updated);
        console.log(`  ${path.relative(ROOT, fullPath)} (${count} replacements)`);
      }
    }
  }
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
