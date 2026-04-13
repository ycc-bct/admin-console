#!/usr/bin/env node
/**
 * Post-processes vite-out/index.html so the inlined IIFE script executes
 * correctly after staticrypt blob-URL decryption.
 *
 * Problem: vite-plugin-singlefile inlines the JS as an IIFE but keeps the
 * original <script type="module" crossorigin> tag in <head>.
 *   - type="module" defers execution until after DOM is parsed (good),
 *     but module scripts have restrictions in blob URL context.
 *   - Stripping type="module" makes it a synchronous parser-blocking script
 *     that runs before <body> is parsed → getElementById("root") returns
 *     null → React never mounts → blank page.
 *
 * Fix: strip type="module" crossorigin, then move the script to just before
 * </body> so it runs after the DOM is fully built, like a deferred script.
 */
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "vite-out", "index.html");
let html = fs.readFileSync(file, "utf8");

// 1. Extract the inlined IIFE script from <head>
//    It starts with <script type="module" crossorigin> and contains a (function(){
const moduleScriptRe = /<script\s+type="module"\s+crossorigin>([\s\S]*?)<\/script>/;
const match = html.match(moduleScriptRe);
if (!match) {
  console.warn("⚠️  No <script type=\"module\" crossorigin> found — nothing to fix");
  process.exit(0);
}

const scriptContent = match[1];

// 2. Remove the original script from <head>
html = html.replace(moduleScriptRe, "");

// 3. Insert it as a plain <script> just before </body>
html = html.replace("</body>", `<script>${scriptContent}</script>\n</body>`);

fs.writeFileSync(file, html, "utf8");
console.log("✅  Moved IIFE script to bottom of <body> (removed type=\"module\" crossorigin)");
