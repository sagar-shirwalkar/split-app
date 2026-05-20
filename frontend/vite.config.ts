import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const INSTANCE = process.env.VITE_SN_INSTANCE || "https://your-instance.service-now.com";
const INSTANCE_ID = process.env.VITE_SN_INSTANCE_ID || "";

export default defineConfig({
  plugins: [tailwindcss(), viteSingleFile()],
  base: "./",
  build: {
    outDir: "dist",
  },
  server: {
    proxy: {
      "/api/x_split": {
        target: INSTANCE,
        changeOrigin: true,
        rewrite: INSTANCE_ID
          ? (path) => path.replace("/api/x_split", `/api/${INSTANCE_ID}/x_split`)
          : undefined,
      },
    },
  },
});
