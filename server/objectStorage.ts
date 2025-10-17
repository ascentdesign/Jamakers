// Reference: blueprint:javascript_object_storage (refactored to filesystem-backed storage)

import fs from "fs";
import path from "path";
import { Response } from "express";
import { randomUUID } from "crypto";
import {
  ObjectAclPolicy,
  ObjectPermission,
  canAccessObject,
  getObjectAclPolicy,
  setObjectAclPolicy,
} from "./objectAcl";

export type LocalFile = {
  absolutePath: string;
};

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export class ObjectStorageService {
  constructor() {}

  getPublicObjectSearchPaths(): Array<string> {
    const defaultDir = path.resolve(process.cwd(), "public_objects");
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || defaultDir;
    const paths = Array.from(
      new Set(
        pathsStr
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p.length > 0)
          .map((p) => path.resolve(process.cwd(), p))
      )
    );
    // Ensure directories exist
    for (const p of paths) {
      if (!fs.existsSync(p)) {
        fs.mkdirSync(p, { recursive: true });
      }
    }
    return paths;
  }

  getPrivateObjectDir(): string {
    const defaultDir = path.resolve(process.cwd(), "private_objects");
    const dir = process.env.PRIVATE_OBJECT_DIR || defaultDir;
    const abs = path.resolve(process.cwd(), dir);
    if (!fs.existsSync(abs)) {
      fs.mkdirSync(abs, { recursive: true });
    }
    return abs;
  }

  async searchPublicObject(filePath: string): Promise<LocalFile | null> {
    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const fullPath = path.resolve(searchPath, filePath);
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        return { absolutePath: fullPath };
      }
    }

    return null;
  }

  async downloadObject(file: LocalFile, res: Response, cacheTtlSec: number = 3600) {
    try {
      const aclPolicy = await getObjectAclPolicy(file.absolutePath);
      const isPublic = aclPolicy?.visibility === "public";
      const stat = fs.statSync(file.absolutePath);
      res.set({
        "Content-Type": getContentType(file.absolutePath),
        "Content-Length": String(stat.size),
        "Cache-Control": `${isPublic ? "public" : "private"}, max-age=${cacheTtlSec}`,
      });

      const stream = fs.createReadStream(file.absolutePath);

      stream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error streaming file" });
        }
      });

      stream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  }

  async getObjectEntityUploadURL(): Promise<{ uploadUrl: string; publicUrl: string }> {
    const privateObjectDir = this.getPrivateObjectDir();
    const objectId = randomUUID();
    const uploadDir = path.join(privateObjectDir, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const targetPath = path.join(uploadDir, objectId);
    // We return a local PUT endpoint that will write to targetPath
    const uploadUrl = `/api/objects/upload/${objectId}`;
    const publicUrl = `/objects/uploads/${objectId}`;
    // Pre-create empty file metadata sidecar for ACL if needed later
    return { uploadUrl, publicUrl };
  }

  async getObjectEntityFile(objectPath: string): Promise<LocalFile> {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }

    const parts = objectPath.slice(1).split("/");
    if (parts.length < 2) {
      throw new ObjectNotFoundError();
    }

    const entityId = parts.slice(1).join("/");
    const entityDir = this.getPrivateObjectDir();
    const objectEntityPath = path.join(entityDir, entityId);
    if (!fs.existsSync(objectEntityPath) || !fs.statSync(objectEntityPath).isFile()) {
      throw new ObjectNotFoundError();
    }
    return { absolutePath: objectEntityPath };
  }

  normalizeObjectEntityPath(rawPath: string): string {
    // For filesystem storage, assume rawPath is an absolute path inside private dir
    const privateDir = this.getPrivateObjectDir();
    const abs = path.resolve(rawPath);
    if (!abs.startsWith(privateDir)) {
      return rawPath;
    }
    const entityId = path.relative(privateDir, abs).replace(/\\/g, "/");
    return `/objects/${entityId}`;
  }

  async trySetObjectEntityAclPolicy(
    rawPath: string,
    aclPolicy: ObjectAclPolicy
  ): Promise<string> {
    const normalizedPath = this.normalizeObjectEntityPath(rawPath);
    if (!normalizedPath.startsWith("/")) {
      return normalizedPath;
    }

    const objectFile = await this.getObjectEntityFile(normalizedPath);
    await setObjectAclPolicy(objectFile.absolutePath, aclPolicy);
    return normalizedPath;
  }

  async canAccessObjectEntity({
    userId,
    objectFile,
    requestedPermission,
  }: {
    userId?: string;
    objectFile: LocalFile;
    requestedPermission?: ObjectPermission;
  }): Promise<boolean> {
    return canAccessObject({
      userId,
      objectFilePath: objectFile.absolutePath,
      requestedPermission: requestedPermission ?? ObjectPermission.READ,
    });
  }
}

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".pdf":
      return "application/pdf";
    case ".txt":
      return "text/plain";
    case ".json":
      return "application/json";
    default:
      return "application/octet-stream";
  }
}
