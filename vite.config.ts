import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "path";

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  build: {
    outDir: "vite-out",
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    // IIFE format produces a plain <script> (no type="module") so it works
    // correctly with both document.write() and blob URL decryption.
    rollupOptions: {
      output: {
        format: "iife",
        inlineDynamicImports: true,
      },
    },
  },
});
