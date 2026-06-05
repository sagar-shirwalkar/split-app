// scripts/copy-bundle.js
const fs = require("fs");
const path = require("path");

const src = path.resolve(__dirname, "../frontend/dist");
const dest = path.resolve(__dirname, "../sn-sdk/src/client");

// Copy the built bundle
fs.copyFileSync(
  path.join(src, "split_app_main.jsx"),
  path.join(dest, "split_app_main.jsx"),
);

// Copy the HTML (has updated inline Tailwind CSS)
fs.copyFileSync(path.join(src, "index.html"), path.join(dest, "index.html"));

console.log("Copied frontend build to sn-sdk/src/client/");
