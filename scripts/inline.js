#!/usr/bin/env node
/**
 * Bundles the Next.js static export into a single self-contained HTML file.
 * Inlines all CSS (with fonts as base64), all JS, and all image assets.
 */
const fs   = require("fs");
const path = require("path");

const outDir     = path.join(__dirname, "..", "out");
const inputHtml  = path.join(outDir, "index.html");
const outputFile = path.join(__dirname, "..", "bundled.html");

if (!fs.existsSync(inputHtml)) {
  console.error("❌  out/index.html not found — run `npm run build` first");
  process.exit(1);
}

let html = fs.readFileSync(inputHtml, "utf8");

// ─── helpers ──────────────────────────────────────────────────────────────────

function resolveOut(href) {
  // Strip query strings / hashes, resolve against out/
  const clean = href.split("?")[0].split("#")[0];
  return path.join(outDir, clean);
}

function toDataUri(filePath) {
  const ext  = path.extname(filePath).toLowerCase().slice(1);
  const mime = {
    woff2: "font/woff2", woff: "font/woff", ttf: "font/ttf",
    svg:   "image/svg+xml", png: "image/png",
    jpg:   "image/jpeg",   jpeg: "image/jpeg",
    ico:   "image/x-icon",
  }[ext] || "application/octet-stream";
  const data = fs.readFileSync(filePath).toString("base64");
  return `data:${mime};base64,${data}`;
}

/** Inline url(...) font/image references inside CSS */
function inlineAssetsInCss(css, cssPath) {
  return css.replace(/url\(\s*['"]?([^'"\)\s]+)['"]?\s*\)/g, (match, ref) => {
    if (ref.startsWith("data:")) return match; // already inlined
    const resolved = ref.startsWith("/")
      ? path.join(outDir, ref)
      : path.resolve(path.dirname(cssPath), ref);
    if (!fs.existsSync(resolved)) return match;
    return `url('${toDataUri(resolved)}')`;
  });
}

// ─── 1. inline <link rel="stylesheet"> ────────────────────────────────────────
html = html.replace(
  /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*\/?>/g,
  (match, href) => {
    const filePath = resolveOut(href);
    if (!fs.existsSync(filePath)) { console.warn("⚠️  CSS not found:", href); return match; }
    let css = fs.readFileSync(filePath, "utf8");
    css = inlineAssetsInCss(css, filePath);
    return `<style>${css}</style>`;
  }
);
// also handle href-before-rel order
html = html.replace(
  /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']stylesheet["'][^>]*\/?>/g,
  (match, href) => {
    const filePath = resolveOut(href);
    if (!fs.existsSync(filePath)) { console.warn("⚠️  CSS not found:", href); return match; }
    let css = fs.readFileSync(filePath, "utf8");
    css = inlineAssetsInCss(css, filePath);
    return `<style>${css}</style>`;
  }
);

// ─── 2. inline <script src="..."> ─────────────────────────────────────────────
html = html.replace(
  /<script([^>]*?)\ssrc=["']([^"']+)["']([^>]*)><\/script>/g,
  (match, before, src, after) => {
    const filePath = resolveOut(src);
    if (!fs.existsSync(filePath)) { console.warn("⚠️  JS not found:", src); return match; }
    const js = fs.readFileSync(filePath, "utf8");
    // strip src attr, keep other attrs (defer, async, type, nonce …)
    const attrs = (before + " " + after)
      .replace(/\s*src=["'][^"']*["']/g, "")
      .trim();
    return `<script${attrs ? " " + attrs : ""}>${js}</script>`;
  }
);

// ─── 3. inline /assets/ images referenced in the HTML (logo SVGs etc.) ────────
html = html.replace(/src=["'](\/assets\/[^"']+)["']/g, (match, src) => {
  const filePath = path.join(outDir, src);
  if (!fs.existsSync(filePath)) return match;
  return `src="${toDataUri(filePath)}"`;
});

// ─── 4. write output ──────────────────────────────────────────────────────────
fs.writeFileSync(outputFile, html, "utf8");
const kb = (fs.statSync(outputFile).size / 1024).toFixed(1);
console.log(`✅  Bundled → bundled.html  (${kb} KB)`);
