import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    // In dev, the client may be served by Vite separately; don't crash the API.
    log(`static directory not found, skipping: ${distPath}`);
    return;
  }

  // Serve static assets for non-API paths only
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    return express.static(distPath)(req, res, next);
  });

  // Fall through to index.html for client-side routes (non-API only)
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}