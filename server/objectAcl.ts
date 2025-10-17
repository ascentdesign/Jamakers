// Simplified ACL implementation for filesystem-backed object storage
// Reference: blueprint:javascript_object_storage

import fs from "fs";
import path from "path";

export enum ObjectPermission {
  READ = "read",
  WRITE = "write",
}

export interface ObjectAclPolicy {
  owner: string;
  visibility: "public" | "private";
  allowedUsers?: string[]; // Simplified: just a list of user IDs who can access
}

function isPermissionAllowed(
  requested: ObjectPermission,
  granted: ObjectPermission,
): boolean {
  if (requested === ObjectPermission.READ) {
    return [ObjectPermission.READ, ObjectPermission.WRITE].includes(granted);
  }

  return granted === ObjectPermission.WRITE;
}

export async function setObjectAclPolicy(
  objectFilePath: string,
  aclPolicy: ObjectAclPolicy,
): Promise<void> {
  if (!fs.existsSync(objectFilePath)) {
    throw new Error(`Object not found: ${objectFilePath}`);
  }
  const metaPath = `${objectFilePath}.acl.json`;
  await fs.promises.writeFile(metaPath, JSON.stringify(aclPolicy, null, 2), "utf-8");
}

export async function getObjectAclPolicy(
  objectFilePath: string,
): Promise<ObjectAclPolicy | null> {
  try {
    const metaPath = `${objectFilePath}.acl.json`;
    const content = await fs.promises.readFile(metaPath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function canAccessObject({
  userId,
  objectFilePath,
  requestedPermission,
}: {
  userId?: string;
  objectFilePath: string;
  requestedPermission: ObjectPermission;
}): Promise<boolean> {
  if (!fs.existsSync(objectFilePath)) return false;
  const aclPolicy = await getObjectAclPolicy(objectFilePath);
  if (!aclPolicy) {
    // No ACL policy means public read access
    return requestedPermission === ObjectPermission.READ;
  }

  // Public objects allow read access
  if (aclPolicy.visibility === "public" && requestedPermission === ObjectPermission.READ) {
    return true;
  }

  if (!userId) {
    return false;
  }

  // Owner has full access
  if (aclPolicy.owner === userId) {
    return true;
  }

  // Check if user is in allowed list
  if (aclPolicy.allowedUsers && aclPolicy.allowedUsers.includes(userId)) {
    return requestedPermission === ObjectPermission.READ;
  }

  return false;
}
