/**
 * build-seismic.cjs
 *
 * Builds the Seismic wrapper with the current Lit bundle version
 * inlined as `process.env.SN_SPLIT_VERSION`. The version is read
 * from `.split-bundle-version` (written by `build-frontend.cjs`).
 *
 * If the version file is missing, the build proceeds with an empty
 * version string and the host falls back to a Date.now() query
 * param (always-fresh, but disables ETag caching).
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const WRAPPER_DIR = path.join(ROOT, "seismic-wrapper");
const VERSION_FILE = path.join(ROOT, ".split-bundle-version");

function readVersion() {
  if (!fs.existsSync(VERSION_FILE)) return "";
  return fs.readFileSync(VERSION_FILE, "utf8").trim();
}

function main() {
  const version = readVersion();
  if (!version) {
    console.warn(
      "WARNING: no .split-bundle-version found. Run `npm run build:lit` first.",
    );
  } else {
    console.log(`Inlining bundle version: ${version}`);
  }

  const env = {
    ...process.env,
    SN_SPLIT_VERSION: version,
  };

  execSync("snc ui-component build", {
    cwd: WRAPPER_DIR,
    stdio: "inherit",
    env,
  });
}

main();
