import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const INSTANCE = process.env.VITE_SN_INSTANCE || "http://localhost:8080";
const INSTANCE_ID = process.env.VITE_SN_INSTANCE_ID || "";
const BUILD_MODE = process.env.BUILD_MODE || "single";

export default defineConfig({
  plugins: [
    tailwindcss(),
    // Strip @property rules that cause .jsdbx parsing issues
    {
      name: "strip-css-at-property",
      enforce: "post", // run after Tailwind processes the CSS
      transform(code, id) {
        if (id.endsWith(".css") || id.includes(".css?inline")) {
          return code.replace(/@property\s+--[\w-]+\s*\{[^}]*\}/g, "");
        }
      },
    },
    ...(BUILD_MODE === "single" ? [viteSingleFile()] : []),
  ],
  base: "./",
  build: {
    outDir: "dist",
    ...(BUILD_MODE === "split" && {
      rollupOptions: {
        output: {
          entryFileNames: "split_app_main.jsx",
          format: "es",
        },
      },
    }),
  },
  server: {
    proxy: {
      "/api/x_snc_split": {
        target: INSTANCE,
        changeOrigin: true,
        rewrite: INSTANCE_ID
          ? (path) =>
              path.replace(
                "/api/x_snc_split",
                `/api/${INSTANCE_ID}/x_snc_split`,
              )
          : undefined,
      },
    },
  },
});
