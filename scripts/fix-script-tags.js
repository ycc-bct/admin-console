#!/usr/bin/env node
/**
 * Post-processes vite-out/index.html to remove type="module" and crossorigin
 * from inlined IIFE scripts.
 *
 * vite-plugin-singlefile inlines the JS as an IIFE but keeps the original
 * <script type="module" crossorigin> attributes. The HTML spec prohibits
 * module scripts from executing via document.write(), so staticrypt's
 * decryption callback would silently fail. Stripping these attributes turns
 * the tag into a plain <script> that executes normally.
 */
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "vite-out", "index.html");
let html = fs.readFileSync(file, "utf8");

const before = (html.match(/<script\s+type="module"\s+crossorigin>/g) || []).length;
html = html.replace(/<script\s+type="module"\s+crossorigin>/g, "<script>");
const after = (html.match(/<script\s+type="module"\s+crossorigin>/g) || []).length;

fs.writeFileSync(file, html, "utf8");
console.log(`✅  Stripped type="module" crossorigin from ${before - after} script tag(s)`);
