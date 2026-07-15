#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, extname, join, relative, resolve } from "node:path";

const supportedExtensions = new Set([
  ".avif", ".bmp", ".gif", ".heic", ".heif", ".jpeg", ".jpg", ".png", ".tif", ".tiff", ".webp",
]);

function usage() {
  console.log(`Usage: node scripts/find-duplicate-images.mjs [directory]

Recursively scans images and groups files whose decoded pixels are identical.
The default directory is public/assets/img/gallery.`);
}

function collectImages(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".")) return [];
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectImages(path);
    if (!entry.isFile() || !supportedExtensions.has(extname(entry.name).toLowerCase())) return [];
    return [path];
  });
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  usage();
  process.exit(0);
}
if (args.length > 1) {
  usage();
  process.exit(1);
}

const root = resolve(args[0] ?? "public/assets/img/gallery");
try {
  if (!statSync(root).isDirectory()) throw new Error("not a directory");
} catch {
  console.error(`エラー: ディレクトリが見つかりません: ${root}`);
  process.exit(1);
}

const files = collectImages(root).sort((a, b) => a.localeCompare(b, "ja"));
const temporaryDirectory = mkdtempSync(join(tmpdir(), "aegis-image-check-"));
const groups = new Map();
const failures = [];

try {
  for (const [index, file] of files.entries()) {
    const normalized = join(temporaryDirectory, `${index}.png`);
    try {
      // sips decodes each supported format and writes a canonical PNG. Hashing that
      // output compares rendered pixels instead of the original file bytes/name.
      execFileSync("sips", ["-s", "format", "png", file, "--out", normalized], {
        stdio: "ignore",
      });
      const hash = createHash("sha256").update(readFileSync(normalized)).digest("hex");
      const group = groups.get(hash) ?? [];
      group.push(file);
      groups.set(hash, group);
    } catch (error) {
      failures.push([file, error]);
    }
  }
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}

const duplicates = [...groups.values()].filter((group) => group.length > 1);
console.log(`検査先: ${root}`);
console.log(`画像数: ${files.length}`);
if (duplicates.length === 0) {
  console.log("結果: ピクセルが完全一致する重複画像はありません。");
} else {
  console.log(`結果: ${duplicates.length} 組の重複を検出しました。`);
  duplicates.forEach((group, index) => {
    console.log(`\n[重複 ${index + 1}] ${group.length} ファイル`);
    group.forEach((file) => console.log(`  - ${relative(root, file) || basename(file)}`));
  });
}

if (failures.length > 0) {
  console.error(`\n読み込みできなかった画像: ${failures.length}`);
  failures.forEach(([file]) => console.error(`  - ${file}`));
  process.exit(1);
}
