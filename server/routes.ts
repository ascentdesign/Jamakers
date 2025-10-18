// Reference: blueprint:javascript_log_in_with_replit, blueprint:javascript_object_storage, blueprint:javascript_openai_ai_integrations

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { requireRole, requireOwnership, requireManufacturer, requireBrand } from "./middleware/authorization";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import { getChatbotResponse } from "./ai";
import {
  insertManufacturerSchema,
  insertBrandSchema,
  insertProjectSchema,
  insertRfqSchema,
  insertRfqResponseSchema,
  insertMessageSchema,
  insertReviewSchema,
  insertCertificationSchema,
  insertPortfolioItemSchema,
  insertVerificationRequestSchema,
  insertFinancingLeadSchema,
  insertNotificationSchema,
  insertProjectMaterialSchema,
  updateManufacturerSchema,
  updateBrandSchema,
  updateProjectSchema,
  updateRfqSchema,
} from "@shared/schema";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // ===========================================================================
  // AUTH ROUTES
  // ===========================================================================
  
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ===========================================================================
  // PROFILE ROUTES
  // ===========================================================================
  
  app.get('/api/profile/manufacturer', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const manufacturer = await storage.getManufacturerByUserId(userId);
      if (!manufacturer) {
        return res.status(404).json({ message: "Manufacturer profile not found" });
      }
      res.json(manufacturer);
    } catch (error) {
      console.error("Error fetching manufacturer profile:", error);
      res.status(500).json({ message: "Failed to fetch manufacturer profile" });
    }
  });

  app.get('/api/profile/brand', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const brand = await storage.getBrandByUserId(userId);
      if (!brand) {
        return res.status(404).json({ message: "Brand profile not found" });
      }
      res.json(brand);
    } catch (error) {
      console.error("Error fetching brand profile:", error);
      res.status(500).json({ message: "Failed to fetch brand profile" });
    }
  });

  // ===========================================================================
  // MANUFACTURER ROUTES
  // ===========================================================================

  app.get('/api/manufacturers', async (req, res) => {
    try {
      const filters = req.query;
      const manufacturers = await storage.searchManufacturers(filters);
      res.json(manufacturers);
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
      res.status(500).json({ message: "Failed to fetch manufacturers" });
    }
  });

  app.get('/api/manufacturers/:id', async (req, res) => {
    try {
      const manufacturer = await storage.getManufacturer(req.params.id);
      if (!manufacturer) {
        return res.status(404).json({ message: "Manufacturer not found" });
      }
      res.json(manufacturer);
    } catch (error) {
      console.error("Error fetching manufacturer:", error);
      res.status(500).json({ message: "Failed to fetch manufacturer" });
    }
  });

  app.post('/api/manufacturers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertManufacturerSchema.parse({ ...req.body, userId });
      const manufacturer = await storage.createManufacturer(validatedData);
      res.status(201).json(manufacturer);
    } catch (error: any) {
      console.error("Error creating manufacturer:", error);
      res.status(400).json({ message: error.message || "Failed to create manufacturer" });
    }
  });

  // Helper for manufacturer update handler
  const updateManufacturerHandler = async (req: any, res: any) => {
    try {
      // Validate request body - use updateSchema to exclude sensitive fields
      const validatedData = updateManufacturerSchema.partial().parse(req.body);
      const updatedManufacturer = await storage.updateManufacturer(req.params.id, validatedData);
      if (!updatedManufacturer) {
        return res.status(404).json({ message: "Manufacturer not found" });
      }
      res.json(updatedManufacturer);
    } catch (error: any) {
      console.error("Error updating manufacturer:", error);
      res.status(400).json({ message: error.message || "Failed to update manufacturer" });
    }
  };

  const manufacturerOwnership = requireOwnership(async (req) => {
    const manufacturer = await storage.getManufacturer(req.params.id);
    return manufacturer?.userId;
  });

  app.put('/api/manufacturers/:id', isAuthenticated, manufacturerOwnership, updateManufacturerHandler);
  app.patch('/api/manufacturers/:id', isAuthenticated, manufacturerOwnership, updateManufacturerHandler);

  app.get('/api/manufacturers/:id/portfolio', async (req, res) => {
    try {
      const portfolioItems = await storage.getPortfolioItemsByManufacturer(req.params.id);
      res.json(portfolioItems);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  app.get('/api/manufacturers/:id/certifications', async (req, res) => {
    try {
      const certifications = await storage.getCertificationsByManufacturer(req.params.id);
      res.json(certifications);
    } catch (error) {
      console.error("Error fetching certifications:", error);
      res.status(500).json({ message: "Failed to fetch certifications" });
    }
  });

  app.get('/api/manufacturers/:id/reviews', async (req, res) => {
    try {
      const reviews = await storage.getReviewsByManufacturer(req.params.id);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // ===========================================================================
  // BRAND ROUTES
  // ===========================================================================

  app.get('/api/brands/:id', async (req, res) => {
    try {
      const brand = await storage.getBrand(req.params.id);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      console.error("Error fetching brand:", error);
      res.status(500).json({ message: "Failed to fetch brand" });
    }
  });

  app.post('/api/brands', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertBrandSchema.parse({ ...req.body, userId });
      const brand = await storage.createBrand(validatedData);
      res.status(201).json(brand);
    } catch (error: any) {
      console.error("Error creating brand:", error);
      res.status(400).json({ message: error.message || "Failed to create brand" });
    }
  });

  // Helper for brand update handler
  const updateBrandHandler = async (req: any, res: any) => {
    try {
      // Validate request body - use updateSchema to exclude sensitive fields
      const validatedData = updateBrandSchema.partial().parse(req.body);
      const updatedBrand = await storage.updateBrand(req.params.id, validatedData);
      if (!updatedBrand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json(updatedBrand);
    } catch (error: any) {
      console.error("Error updating brand:", error);
      res.status(400).json({ message: error.message || "Failed to update brand" });
    }
  };

  const brandOwnership = requireOwnership(async (req) => {
    const brand = await storage.getBrand(req.params.id);
    return brand?.userId;
  });

  app.put('/api/brands/:id', isAuthenticated, brandOwnership, updateBrandHandler);
  app.patch('/api/brands/:id', isAuthenticated, brandOwnership, updateBrandHandler);

  // ===========================================================================
  // RFQ ROUTES
  // ===========================================================================

  app.get('/api/rfqs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role === 'brand') {
        const brand = await storage.getBrandByUserId(userId);
        if (brand) {
          const rfqs = await storage.getRfqsByBrand(brand.id);
          return res.json(rfqs);
        }
      } else if (user?.role === 'manufacturer') {
        const rfqs = await storage.getActiveRfqs();
        return res.json(rfqs);
      }
      
      res.json([]);
    } catch (error) {
      console.error("Error fetching RFQs:", error);
      res.status(500).json({ message: "Failed to fetch RFQs" });
    }
  });

  app.get('/api/rfqs/:id', async (req, res) => {
    try {
      const rfq = await storage.getRfq(req.params.id);
      if (!rfq) {
        return res.status(404).json({ message: "RFQ not found" });
      }
      res.json(rfq);
    } catch (error) {
      console.error("Error fetching RFQ:", error);
      res.status(500).json({ message: "Failed to fetch RFQ" });
    }
  });

  app.post('/api/rfqs', isAuthenticated, requireBrand, async (req: any, res) => {
    try {
      const brand = req.brand;
      const validatedData = insertRfqSchema.parse({ ...req.body, brandId: brand.id });
      const rfq = await storage.createRfq(validatedData);
      res.status(201).json(rfq);
    } catch (error: any) {
      console.error("Error creating RFQ:", error);
      res.status(400).json({ message: error.message || "Failed to create RFQ" });
    }
  });

  // Helper for RFQ update handler
  const updateRfqHandler = async (req: any, res: any) => {
    try {
      // Validate request body - use updateSchema to exclude sensitive fields
      const validatedData = updateRfqSchema.partial().parse(req.body);
      const updatedRfq = await storage.updateRfq(req.params.id, validatedData);
      if (!updatedRfq) {
        return res.status(404).json({ message: "RFQ not found" });
      }
      res.json(updatedRfq);
    } catch (error: any) {
      console.error("Error updating RFQ:", error);
      res.status(400).json({ message: error.message || "Failed to update RFQ" });
    }
  };

  const rfqOwnership = requireOwnership(async (req) => {
    const rfq = await storage.getRfq(req.params.id);
    if (!rfq) return undefined;
    const brand = await storage.getBrand(rfq.brandId);
    return brand?.userId;
  });

  app.put('/api/rfqs/:id', isAuthenticated, rfqOwnership, updateRfqHandler);
  app.patch('/api/rfqs/:id', isAuthenticated, rfqOwnership, updateRfqHandler);

  app.delete('/api/rfqs/:id', isAuthenticated, requireOwnership(async (req) => {
    const rfq = await storage.getRfq(req.params.id);
    if (!rfq) return undefined;
    const brand = await storage.getBrand(rfq.brandId);
    return brand?.userId;
  }), async (req, res) => {
    try {
      const deleted = await storage.deleteRfq(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "RFQ not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting RFQ:", error);
      res.status(500).json({ message: "Failed to delete RFQ" });
    }
  });

  app.get('/api/rfqs/:id/responses', async (req, res) => {
    try {
      const responses = await storage.getRfqResponsesByRfq(req.params.id);
      res.json(responses);
    } catch (error) {
      console.error("Error fetching RFQ responses:", error);
      res.status(500).json({ message: "Failed to fetch RFQ responses" });
    }
  });

  app.post('/api/rfqs/:id/responses', isAuthenticated, requireManufacturer, async (req: any, res) => {
    try {
      const manufacturer = req.manufacturer;
      const validatedData = insertRfqResponseSchema.parse({
        ...req.body,
        rfqId: req.params.id,
        manufacturerId: manufacturer.id,
      });
      
      const response = await storage.createRfqResponse(validatedData);
      res.status(201).json(response);
    } catch (error: any) {
      console.error("Error creating RFQ response:", error);
      res.status(400).json({ message: error.message || "Failed to create RFQ response" });
    }
  });

  // ===========================================================================
  // CREATOR ROUTES
  // ===========================================================================

  app.get('/api/creators', async (req, res) => {
    try {
      const availableForHire = req.query.availableForHire === 'true' ? true : req.query.availableForHire === 'false' ? false : undefined;
      const creators = await storage.getCreators({ availableForHire });
      res.json(creators);
    } catch (error) {
      console.error("Error fetching creators:", error);
      res.status(500).json({ message: "Failed to fetch creators" });
    }
  });

  app.get('/api/creators/:id', async (req, res) => {
    try {
      const creator = await storage.getCreator(req.params.id);
      if (!creator) {
        return res.status(404).json({ message: "Creator not found" });
      }
      res.json(creator);
    } catch (error) {
      console.error("Error fetching creator:", error);
      res.status(500).json({ message: "Failed to fetch creator" });
    }
  });

  // ===========================================================================
  // DESIGNER ROUTES
  // ===========================================================================

  app.get('/api/designers', async (req, res) => {
    try {
      const availableForHire = req.query.availableForHire === 'true' ? true : req.query.availableForHire === 'false' ? false : undefined;
      const designers = await storage.getDesigners({ availableForHire });
      res.json(designers);
    } catch (error) {
      console.error("Error fetching designers:", error);
      res.status(500).json({ message: "Failed to fetch designers" });
    }
  });

  app.get('/api/designers/:id', async (req, res) => {
    try {
      const designer = await storage.getDesigner(req.params.id);
      if (!designer) {
        return res.status(404).json({ message: "Designer not found" });
      }
      res.json(designer);
    } catch (error) {
      console.error("Error fetching designer:", error);
      res.status(500).json({ message: "Failed to fetch designer" });
    }
  });

  // ===========================================================================
  // FINANCE ROUTES
  // ===========================================================================

  app.get('/api/finance/lenders', async (req, res) => {
    try {
      const lenders = await storage.getFinancialInstitutions();
      res.json(lenders);
    } catch (error) {
      console.error("Error fetching lenders:", error);
      res.status(500).json({ message: "Failed to fetch lenders" });
    }
  });

  app.get('/api/finance/lenders/:id', async (req, res) => {
    try {
      const lender = await storage.getFinancialInstitution(req.params.id);
      if (!lender) {
        return res.status(404).json({ message: "Lender not found" });
      }
      res.json(lender);
    } catch (error) {
      console.error("Error fetching lender:", error);
      res.status(500).json({ message: "Failed to fetch lender" });
    }
  });

  app.get('/api/finance/lenders/:id/loan-products', async (req, res) => {
    try {
      const loanProducts = await storage.getLoanProductsByInstitution(req.params.id);
      res.json(loanProducts);
    } catch (error) {
      console.error("Error fetching loan products:", error);
      res.status(500).json({ message: "Failed to fetch loan products" });
    }
  });

  app.post('/api/finance/loan-applications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const validatedData = {
        ...req.body,
        applicantId: userId,
        applicantType: user.role,
      };
      
      const application = await storage.createLoanApplication(validatedData);
      res.status(201).json(application);
    } catch (error: any) {
      console.error("Error creating loan application:", error);
      res.status(400).json({ message: error.message || "Failed to create loan application" });
    }
  });

  app.get('/api/finance/loan-applications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const applications = await storage.getLoanApplicationsByApplicant(userId);
      res.json(applications);
    } catch (error) {
      console.error("Error fetching loan applications:", error);
      res.status(500).json({ message: "Failed to fetch loan applications" });
    }
  });

  // ===========================================================================
  // PROJECT ROUTES
  // ===========================================================================

  app.get('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role === 'brand') {
        const brand = await storage.getBrandByUserId(userId);
        if (brand) {
          const projects = await storage.getProjectsByBrand(brand.id);
          return res.json(projects);
        }
      } else if (user?.role === 'manufacturer') {
        const manufacturer = await storage.getManufacturerByUserId(userId);
        if (manufacturer) {
          const projects = await storage.getProjectsByManufacturer(manufacturer.id);
          return res.json(projects);
        }
      }
      
      res.json([]);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/:id', isAuthenticated, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post('/api/projects', isAuthenticated, requireBrand, async (req: any, res) => {
    try {
      const brand = req.brand;
      const userId = req.user.claims.sub;
      
      // Ensure brandId in body matches user's brand
      const validatedData = insertProjectSchema.parse({
        ...req.body,
        brandId: brand.id, // Override with authenticated user's brand
      });
      
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error: any) {
      console.error("Error creating project:", error);
      res.status(400).json({ message: error.message || "Failed to create project" });
    }
  });

  // Helper for project update handler
  const updateProjectHandler = async (req: any, res: any) => {
    try {
      // Validate request body - use updateSchema to exclude sensitive fields
      const validatedData = updateProjectSchema.partial().parse(req.body);
      const updatedProject = await storage.updateProject(req.params.id, validatedData);
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(updatedProject);
    } catch (error: any) {
      console.error("Error updating project:", error);
      res.status(400).json({ message: error.message || "Failed to update project" });
    }
  };

  const projectOwnership = requireOwnership(async (req) => {
    const project = await storage.getProject(req.params.id);
    if (!project) return undefined;
    const brand = await storage.getBrand(project.brandId);
    return brand?.userId;
  });

  app.put('/api/projects/:id', isAuthenticated, projectOwnership, updateProjectHandler);
  app.patch('/api/projects/:id', isAuthenticated, projectOwnership, updateProjectHandler);

  // ===========================================================================
  // MESSAGE ROUTES
  // ===========================================================================

  app.get('/api/messages/threads', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const threads = await storage.getMessageThreads(userId);
      res.json(threads);
    } catch (error) {
      console.error("Error fetching message threads:", error);
      res.status(500).json({ message: "Failed to fetch message threads" });
    }
  });

  app.get('/api/messages/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const currentUserId = req.user.claims.sub;
      const otherUserId = req.params.userId;
      const messages = await storage.getMessagesBetweenUsers(currentUserId, otherUserId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const senderId = req.user.claims.sub;
      const validatedData = insertMessageSchema.parse({ ...req.body, senderId });
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error: any) {
      console.error("Error creating message:", error);
      res.status(400).json({ message: error.message || "Failed to create message" });
    }
  });

  app.put('/api/messages/:id/read', isAuthenticated, async (req, res) => {
    try {
      const marked = await storage.markMessageAsRead(req.params.id);
      if (!marked) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // ===========================================================================
  // REVIEW ROUTES
  // ===========================================================================

  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const reviewerId = req.user.claims.sub;
      const validatedData = insertReviewSchema.parse({ ...req.body, reviewerId });
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error: any) {
      console.error("Error creating review:", error);
      res.status(400).json({ message: error.message || "Failed to create review" });
    }
  });

  app.put('/api/reviews/:id/response', isAuthenticated, requireOwnership(async (req) => {
    const review = await storage.getReview(req.params.id);
    if (!review) return undefined;
    const manufacturer = await storage.getManufacturer(review.manufacturerId);
    return manufacturer?.userId;
  }), async (req: any, res) => {
    try {
      const { response } = req.body;
      if (!response || typeof response !== 'string') {
        return res.status(400).json({ message: "Response text is required" });
      }
      const updatedReview = await storage.updateReviewResponse(req.params.id, response);
      if (!updatedReview) {
        return res.status(404).json({ message: "Review not found" });
      }
      res.json(updatedReview);
    } catch (error) {
      console.error("Error updating review response:", error);
      res.status(500).json({ message: "Failed to update review response" });
    }
  });

  // ===========================================================================
  // CERTIFICATION & PORTFOLIO ROUTES
  // ===========================================================================

  app.post('/api/certifications', isAuthenticated, requireManufacturer, async (req: any, res) => {
    try {
      const manufacturer = req.manufacturer;
      
      // Ensure manufacturerId matches authenticated user's manufacturer
      const validatedData = insertCertificationSchema.parse({
        ...req.body,
        manufacturerId: manufacturer.id, // Override with authenticated user's manufacturer
      });
      
      const certification = await storage.createCertification(validatedData);
      res.status(201).json(certification);
    } catch (error: any) {
      console.error("Error creating certification:", error);
      res.status(400).json({ message: error.message || "Failed to create certification" });
    }
  });

  app.post('/api/portfolio', isAuthenticated, requireManufacturer, async (req: any, res) => {
    try {
      const manufacturer = req.manufacturer;
      
      // Ensure manufacturerId matches authenticated user's manufacturer
      const validatedData = insertPortfolioItemSchema.parse({
        ...req.body,
        manufacturerId: manufacturer.id, // Override with authenticated user's manufacturer
      });
      
      const item = await storage.createPortfolioItem(validatedData);
      res.status(201).json(item);
    } catch (error: any) {
      console.error("Error creating portfolio item:", error);
      res.status(400).json({ message: error.message || "Failed to create portfolio item" });
    }
  });

  // ===========================================================================
  // VERIFICATION ROUTES
  // ===========================================================================

  app.get('/api/verifications', isAuthenticated, async (req, res) => {
    try {
      const verifications = await storage.getPendingVerifications();
      res.json(verifications);
    } catch (error) {
      console.error("Error fetching verifications:", error);
      res.status(500).json({ message: "Failed to fetch verifications" });
    }
  });

  app.post('/api/verifications', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertVerificationRequestSchema.parse(req.body);
      const request = await storage.createVerificationRequest(validatedData);
      res.status(201).json(request);
    } catch (error: any) {
      console.error("Error creating verification request:", error);
      res.status(400).json({ message: error.message || "Failed to create verification request" });
    }
  });

  app.put('/api/verifications/:id/approve', isAuthenticated, requireRole(['admin']), async (req: any, res) => {
    try {
      const reviewedBy = req.user.claims.sub;
      const { notes } = req.body;
      const updated = await storage.updateVerificationStatus(req.params.id, 'approved', reviewedBy, notes);
      if (!updated) {
        return res.status(404).json({ message: "Verification request not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error approving verification:", error);
      res.status(500).json({ message: "Failed to approve verification" });
    }
  });

  app.put('/api/verifications/:id/reject', isAuthenticated, requireRole(['admin']), async (req: any, res) => {
    try {
      const reviewedBy = req.user.claims.sub;
      const { notes } = req.body;
      const updated = await storage.updateVerificationStatus(req.params.id, 'rejected', reviewedBy, notes);
      if (!updated) {
        return res.status(404).json({ message: "Verification request not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error rejecting verification:", error);
      res.status(500).json({ message: "Failed to reject verification" });
    }
  });

  // ===========================================================================
  // FINANCING ROUTES
  // ===========================================================================

  app.get('/api/financing/leads', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role === 'financial_institution') {
        // Get institution and their leads
        const leads = await storage.getFinancingLeadsByInstitution(userId);
        return res.json(leads);
      }
      
      res.json([]);
    } catch (error) {
      console.error("Error fetching financing leads:", error);
      res.status(500).json({ message: "Failed to fetch financing leads" });
    }
  });

  app.post('/api/financing/leads', isAuthenticated, async (req: any, res) => {
    try {
      const applicantId = req.user.claims.sub;
      const validatedData = insertFinancingLeadSchema.parse({ ...req.body, applicantId });
      const lead = await storage.createFinancingLead(validatedData);
      res.status(201).json(lead);
    } catch (error: any) {
      console.error("Error creating financing lead:", error);
      res.status(400).json({ message: error.message || "Failed to create financing lead" });
    }
  });

  app.put('/api/financing/leads/:id', isAuthenticated, requireRole(['financial_institution', 'admin']), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = req.authenticatedUser;
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }
      
      // Load the lead to verify ownership
      const lead = await storage.getFinancingLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ message: "Financing lead not found" });
      }
      
      // Verify ownership (admin can bypass)
      if (user.role !== 'admin' && lead.institutionId !== userId) {
        return res.status(403).json({ message: "Access denied: Not your financing lead" });
      }
      
      const updated = await storage.updateFinancingLeadStatus(req.params.id, status);
      res.json(updated);
    } catch (error) {
      console.error("Error updating financing lead:", error);
      res.status(500).json({ message: "Failed to update financing lead" });
    }
  });

  // ===========================================================================
  // RESOURCE ROUTES
  // ===========================================================================

  app.get('/api/resources', async (req, res) => {
    try {
      const { category } = req.query;
      const resources = category
        ? await storage.getResourcesByCategory(category as string)
        : await storage.getResources();
      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.post('/api/resources/:id/view', async (req, res) => {
    try {
      await storage.incrementResourceView(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error incrementing resource view:", error);
      res.status(500).json({ message: "Failed to increment resource view" });
    }
  });

  app.post('/api/resources/:id/download', async (req, res) => {
    try {
      await storage.incrementResourceDownload(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error incrementing resource download:", error);
      res.status(500).json({ message: "Failed to increment resource download" });
    }
  });

  // ===========================================================================
  // NOTIFICATION ROUTES
  // ===========================================================================

  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotificationsByUser(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.put('/api/notifications/:id/read', isAuthenticated, async (req, res) => {
    try {
      const marked = await storage.markNotificationAsRead(req.params.id);
      if (!marked) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // ===========================================================================
  // OBJECT STORAGE ROUTES
  // ===========================================================================

  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/objects/:objectPath(*)", isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub;
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
        requestedPermission: ObjectPermission.READ,
      });
      if (!canAccess) {
        return res.sendStatus(401);
      }
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const { uploadUrl, publicUrl } = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadUrl, publicUrl });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Handle actual binary upload to local filesystem
  app.put("/api/objects/upload/:id", isAuthenticated, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const privateDir = objectStorageService.getPrivateObjectDir();
      const uploadDir = require('path').join(privateDir, 'uploads');
      if (!require('fs').existsSync(uploadDir)) {
        require('fs').mkdirSync(uploadDir, { recursive: true });
      }
      const targetPath = require('path').join(uploadDir, req.params.id);
      const writeStream = require('fs').createWriteStream(targetPath);

      req.pipe(writeStream);
      writeStream.on('finish', () => {
        res.status(201).json({ path: `/objects/uploads/${req.params.id}` });
      });
      writeStream.on('error', (err: any) => {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Failed to upload file' });
      });
    } catch (error) {
      console.error("Error handling upload:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // ===========================================================================
  // AI CHATBOT ROUTES
  // ===========================================================================

  app.post('/api/chat', isAuthenticated, async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await getChatbotResponse(message, conversationHistory);
      res.json({ response });
    } catch (error) {
      console.error("Error generating chat response:", error);
      res.status(500).json({ message: "Failed to generate response" });
    }
  });

  // ===========================================================================
  // LMS (LEARNING MANAGEMENT SYSTEM) ROUTES
  // ===========================================================================

  // Get all courses (with optional filtering)
  app.get('/api/courses', async (req, res) => {
    try {
      const { category } = req.query;
      const courses = await storage.getCourses(category as string);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Get course details with modules and lessons
  app.get('/api/courses/:id', async (req, res) => {
    try {
      const courseDetails = await storage.getCourseWithModulesAndLessons(req.params.id);
      if (!courseDetails) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(courseDetails);
    } catch (error) {
      console.error("Error fetching course details:", error);
      res.status(500).json({ message: "Failed to fetch course details" });
    }
  });

  // Enroll in a course
  app.post('/api/courses/:id/enroll', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courseId = req.params.id;
      const enrollment = await storage.enrollInCourse(userId, courseId);
      res.status(201).json(enrollment);
    } catch (error: any) {
      console.error("Error enrolling in course:", error);
      res.status(400).json({ message: error.message || "Failed to enroll in course" });
    }
  });

  // Get user's progress in a course
  app.get('/api/courses/:id/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courseId = req.params.id;
      const progress = await storage.getCourseProgress(userId, courseId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching course progress:", error);
      res.status(500).json({ message: "Failed to fetch course progress" });
    }
  });

  // Mark a lesson as complete
  app.post('/api/lessons/:id/complete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const lessonId = req.params.id;
      const progress = await storage.markLessonComplete(userId, lessonId);
      res.json(progress);
    } catch (error: any) {
      console.error("Error marking lesson complete:", error);
      res.status(400).json({ message: error.message || "Failed to mark lesson complete" });
    }
  });

  // Get user's enrolled courses
  app.get('/api/enrollments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const enrollments = await storage.getUserEnrollments(userId);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  // ===========================================================================
  // RAW MATERIALS ROUTES
  // ===========================================================================

  // Get all raw materials (with optional category filtering)
  app.get('/api/raw-materials', async (req, res) => {
    try {
      const { category } = req.query;
      const materials = await storage.getRawMaterials(category as string);
      res.json(materials);
    } catch (error) {
      console.error("Error fetching raw materials:", error);
      res.status(500).json({ message: "Failed to fetch raw materials" });
    }
  });

  // Get raw material details
  app.get('/api/raw-materials/:id', async (req, res) => {
    try {
      const material = await storage.getRawMaterial(req.params.id);
      if (!material) {
        return res.status(404).json({ message: "Raw material not found" });
      }
      res.json(material);
    } catch (error) {
      console.error("Error fetching raw material:", error);
      res.status(500).json({ message: "Failed to fetch raw material" });
    }
  });

  // Get suppliers for a raw material
  app.get('/api/raw-materials/:id/suppliers', async (req, res) => {
    try {
      const suppliers = await storage.getRawMaterialSuppliers(req.params.id);
      res.json(suppliers);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  // ===========================================================================
  // PROJECT MATERIALS ROUTES
  // ===========================================================================

  // Get materials for a project
  app.get('/api/projects/:id/materials', isAuthenticated, async (req, res) => {
    try {
      const materials = await storage.getProjectMaterials(req.params.id);
      res.json(materials);
    } catch (error) {
      console.error("Error fetching project materials:", error);
      res.status(500).json({ message: "Failed to fetch project materials" });
    }
  });

  // Add material to project
  app.post('/api/projects/:id/materials', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = req.params.id;
      const data = insertProjectMaterialSchema.parse({
        ...req.body,
        projectId,
      });
      const material = await storage.addMaterialToProject(data);
      res.json(material);
    } catch (error: any) {
      console.error("Error adding material to project:", error);
      res.status(400).json({ message: error.message || "Failed to add material" });
    }
  });

  // Update material quantity
  app.patch('/api/project-materials/:id', isAuthenticated, async (req, res) => {
    try {
      const { quantity } = req.body;
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: "Valid quantity required" });
      }
      const material = await storage.updateProjectMaterialQuantity(req.params.id, quantity);
      if (!material) {
        return res.status(404).json({ message: "Material not found" });
      }
      res.json(material);
    } catch (error) {
      console.error("Error updating material quantity:", error);
      res.status(500).json({ message: "Failed to update material quantity" });
    }
  });

  // Remove material from project
  app.delete('/api/project-materials/:id', isAuthenticated, async (req, res) => {
    try {
      const success = await storage.removeMaterialFromProject(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Material not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing material:", error);
      res.status(500).json({ message: "Failed to remove material" });
    }
  });

  // Get project materials total cost
  app.get('/api/projects/:id/materials/cost', isAuthenticated, async (req, res) => {
    try {
      const cost = await storage.getProjectMaterialsCost(req.params.id);
      res.json(cost);
    } catch (error) {
      console.error("Error calculating materials cost:", error);
      res.status(500).json({ message: "Failed to calculate cost" });
    }
  });

  // ==========================================================================
  // CMS: Landing configuration
  // ==========================================================================
  const objectService = new ObjectStorageService();
  const CMS_DIR = path.join(objectService.getPrivateObjectDir(), 'cms');
  if (!fs.existsSync(CMS_DIR)) {
    fs.mkdirSync(CMS_DIR, { recursive: true });
  }
  const CMS_FILE = path.join(CMS_DIR, 'landing.json');

  const defaultLandingConfig = {
    header: { brandName: "JA Makers", showSignIn: true, showRegister: true },
    hero: {
      enabled: false,
      title: "Connect with Verified Manufacturers",
      subtitle: "The premier manufacturing hub in Jamaica",
      ctaText: "Get Started",
      ctaLink: "/signup",
    },
    sections: {
      loginEnabled: true,
      featuresEnabled: true,
      howItWorksEnabled: true,
      footerEnabled: true,
    },
    cta: { joinEnabled: true, joinLink: "/brands/create" },
    visibility: "public",
    owner: "system",
    allowedUsers: [],
  };

  // Public: read landing config
  app.get('/api/cms/landing', async (req, res) => {
    try {
      if (!fs.existsSync(CMS_FILE)) {
        return res.json(defaultLandingConfig);
      }
      const raw = fs.readFileSync(CMS_FILE, 'utf8');
      const data = JSON.parse(raw);
      return res.json({ ...defaultLandingConfig, ...data });
    } catch (error) {
      console.error("Error reading landing CMS config:", error);
      return res.status(500).json({ message: "Failed to read landing configuration" });
    }
  });

  // Admin: update landing config
  app.put('/api/cms/landing', isAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const existing = fs.existsSync(CMS_FILE)
        ? JSON.parse(fs.readFileSync(CMS_FILE, 'utf8'))
        : defaultLandingConfig;

      const updated = {
        ...existing,
        ...req.body,
        header: { ...existing.header, ...(req.body?.header || {}) },
        hero: { ...existing.hero, ...(req.body?.hero || {}) },
        sections: { ...existing.sections, ...(req.body?.sections || {}) },
        cta: { ...existing.cta, ...(req.body?.cta || {}) },
      };

      fs.writeFileSync(CMS_FILE, JSON.stringify(updated, null, 2), 'utf8');
      return res.json(updated);
    } catch (error: any) {
      console.error("Error writing landing CMS config:", error);
      return res.status(400).json({ message: error.message || "Failed to save landing configuration" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
