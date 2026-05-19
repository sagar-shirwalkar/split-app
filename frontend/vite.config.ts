import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  base: "./",
  build: {
    outDir: "dist",
  },
  server: {
    proxy: {
      "/api/x_split": {
        target: process.env.VITE_SN_INSTANCE || "https://your-instance.service-now.com",
        changeOrigin: true,
      },
    },
  },
});
