import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const INSTANCE = process.env.VITE_SN_INSTANCE || "http://localhost:8080";
const INSTANCE_ID = process.env.VITE_SN_INSTANCE_ID || "";
const BUILD_MODE = process.env.BUILD_MODE || "single"; // "single" | "split"

export default defineConfig({
  plugins: [
    tailwindcss(),
    // Only use viteSingleFile for existing UI Page deploy path
    ...(BUILD_MODE === "single" ? [viteSingleFile()] : []),
  ],
  base: "./",
  build: {
    outDir: "dist",
    // When building for Seismic/split mode, output separate JS file
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
