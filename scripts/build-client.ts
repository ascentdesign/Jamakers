import { build } from "esbuild";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const root = path.resolve(process.cwd());
const clientRoot = path.join(root, "client");
const srcRoot = path.join(clientRoot, "src");
const outDir = path.join(root, "dist", "public");
const assetsDir = path.join(outDir, "assets");

function ensureDirs() {
  fs.mkdirSync(assetsDir, { recursive: true });
}

async function buildClient() {
  ensureDirs();

  const isProd = process.env.NODE_ENV === "production";

  await build({
    entryPoints: [path.join(srcRoot, "main.tsx")],
    bundle: true,
    format: "esm",
    splitting: true,
    sourcemap: !isProd,
    minify: isProd,
    target: "es2020",
    outdir: assetsDir,
    jsx: "automatic",
    loader: {
      ".png": "file",
      ".jpg": "file",
      ".jpeg": "file",
      ".svg": "file",
      ".webp": "file",
      ".gif": "file",
    },
    logLevel: "info",
  });

  // Build CSS via Tailwind CLI (separate file)
  const cssInput = path.join(srcRoot, "index.css");
  const cssOutput = path.join(assetsDir, "tailwind.css");
  const tailwindCommand = `npx tailwindcss -i "${cssInput}" -o "${cssOutput}" ${isProd ? "--minify" : ""}`;
  const tailwind = spawnSync(tailwindCommand, {
    stdio: "inherit",
    cwd: root,
    env: process.env,
    shell: true,
  });
  if (tailwind.status !== 0) {
    throw new Error("Tailwind build failed");
  }

  // Transform and copy index.html to reference built assets
  const indexSrc = path.join(clientRoot, "index.html");
  const indexDest = path.join(outDir, "index.html");
  const html = fs.readFileSync(indexSrc, "utf-8");
  const transformed = html.replace(
    /<script\s+type="module"\s+src="\/src\/main\.tsx"><\/script>/,
    `<link rel="stylesheet" href="/assets/tailwind.css">\n    <link rel="stylesheet" href="/assets/main.css">\n    <script type="module" src="/assets/main.js"></script>`,
  );
  fs.writeFileSync(indexDest, transformed, "utf-8");
}

buildClient().catch((err) => {
  console.error(err);
  process.exit(1);
});