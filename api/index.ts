import express from "express";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { registerRoutes } from "../server/routes";

let initialized = false;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function init() {
  if (!initialized) {
    await registerRoutes(app);
    initialized = true;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await init();
  return (app as any)(req, res);
}