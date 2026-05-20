const fs = require("fs");

const html = fs.readFileSync("dist/index.html", "utf8");
const wrapped = `<?xml version="1.0" encoding="utf-8" ?>
<j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide" xmlns:j2="null" xmlns:g2="null">
<![CDATA[
${html}
]]>
</j:jelly>`;

fs.writeFileSync("dist/ui-page.xml", wrapped);
console.log("Wrote dist/ui-page.xml — paste this into the UI Page HTML field.");
