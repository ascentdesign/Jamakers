import type { RequestHandler } from "express";
import { storage } from "../storage";

export const requireRole = (allowedRoles: string[]): RequestHandler => {
  return async (req: any, res, next) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user || !user.role) {
        return res.status(403).json({ message: "Access denied: No role assigned" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied: Insufficient permissions" });
      }

      // Attach user to request for downstream handlers
      req.authenticatedUser = user;
      next();
    } catch (error) {
      console.error("Error checking role:", error);
      res.status(500).json({ message: "Failed to authorize request" });
    }
  };
};

export const requireOwnership = (getOwnerId: (req: any) => Promise<string | undefined>): RequestHandler => {
  return async (req: any, res, next) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const ownerId = await getOwnerId(req);
      if (!ownerId) {
        return res.status(404).json({ message: "Resource not found" });
      }

      const user = await storage.getUser(userId);
      
      // Admin can access anything
      if (user?.role === 'admin') {
        req.authenticatedUser = user;
        return next();
      }

      // Check ownership
      if (ownerId !== userId) {
        return res.status(403).json({ message: "Access denied: Not the owner" });
      }

      req.authenticatedUser = user;
      next();
    } catch (error) {
      console.error("Error checking ownership:", error);
      res.status(500).json({ message: "Failed to authorize request" });
    }
  };
};

export const requireManufacturer: RequestHandler = async (req: any, res, next) => {
  try {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const manufacturer = await storage.getManufacturerByUserId(userId);
    if (!manufacturer) {
      return res.status(403).json({ message: "Access denied: Manufacturer profile required" });
    }

    req.manufacturer = manufacturer;
    next();
  } catch (error) {
    console.error("Error checking manufacturer:", error);
    res.status(500).json({ message: "Failed to authorize request" });
  }
};

export const requireBrand: RequestHandler = async (req: any, res, next) => {
  try {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const brand = await storage.getBrandByUserId(userId);
    if (!brand) {
      return res.status(403).json({ message: "Access denied: Brand profile required" });
    }

    req.brand = brand;
    next();
  } catch (error) {
    console.error("Error checking brand:", error);
    res.status(500).json({ message: "Failed to authorize request" });
  }
};
