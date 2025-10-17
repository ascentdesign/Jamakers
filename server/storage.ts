import type {
  User,
  UpsertUser,
  Manufacturer,
  InsertManufacturer,
  Brand,
  InsertBrand,
  Project,
  InsertProject,
  Rfq,
  InsertRfq,
  RfqResponse,
  InsertRfqResponse,
  Message,
  InsertMessage,
  Review,
  InsertReview,
  Certification,
  InsertCertification,
  PortfolioItem,
  InsertPortfolioItem,
  VerificationRequest,
  InsertVerificationRequest,
  FinancingLead,
  InsertFinancingLead,
  Resource,
  InsertResource,
  Notification,
  InsertNotification,
  Course,
  CourseModule,
  CourseLesson,
  UserCourseEnrollment,
  UserLessonProgress,
  RawMaterial,
  InsertRawMaterial,
  RawMaterialSupplier,
  InsertRawMaterialSupplier,
  ProjectMaterial,
  InsertProjectMaterial,
  FinancialInstitution,
  InsertFinancialInstitution,
  LoanProduct,
  InsertLoanProduct,
  LoanApplication,
  InsertLoanApplication,
} from "@shared/schema";

import { MemoryStorage } from "./memoryStorage";

// Define a broad interface covering methods used throughout the app.
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUsersByRole(role: string): Promise<User[]>;

  // Manufacturers
  getManufacturer(id: string): Promise<Manufacturer | undefined>;
  getManufacturerByUserId(userId: string): Promise<Manufacturer | undefined>;
  createManufacturer(data: InsertManufacturer): Promise<Manufacturer>;
  updateManufacturer(id: string, data: Partial<InsertManufacturer>): Promise<Manufacturer | undefined>;
  searchManufacturers(filters: any): Promise<Manufacturer[]>;

  // Brands
  getBrand(id: string): Promise<Brand | undefined>;
  getBrandByUserId(userId: string): Promise<Brand | undefined>;
  createBrand(data: InsertBrand): Promise<Brand>;
  updateBrand(id: string, data: Partial<InsertBrand>): Promise<Brand | undefined>;

  // Projects
  getProject(id: string): Promise<Project | undefined>;
  getProjectsByBrand(brandId: string): Promise<Project[]>;
  getProjectsByManufacturer(manufacturerId: string): Promise<Project[]>;
  createProject(data: InsertProject): Promise<Project>;
  updateProject(id: string, data: Partial<InsertProject>): Promise<Project | undefined>;

  // RFQs
  getRfq(id: string): Promise<Rfq | undefined>;
  getRfqsByBrand(brandId: string): Promise<Rfq[]>;
  getActiveRfqs(): Promise<Rfq[]>;
  createRfq(data: InsertRfq): Promise<Rfq>;
  updateRfq(id: string, data: Partial<InsertRfq>): Promise<Rfq | undefined>;
  deleteRfq(id: string): Promise<boolean>;

  // RFQ Responses
  getRfqResponse(id: string): Promise<RfqResponse | undefined>;
  getRfqResponsesByRfq(rfqId: string): Promise<RfqResponse[]>;
  getRfqResponsesByManufacturer(manufacturerId: string): Promise<RfqResponse[]>;
  createRfqResponse(data: InsertRfqResponse): Promise<RfqResponse>;

  // Messages
  getMessage(id: string): Promise<Message | undefined>;
  getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]>;
  getMessageThreads(userId: string): Promise<Message[]>;
  createMessage(data: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<boolean>;

  // Reviews
  getReview(id: string): Promise<Review | undefined>;
  getReviewsByManufacturer(manufacturerId: string): Promise<Review[]>;
  createReview(data: InsertReview): Promise<Review>;
  updateReviewResponse(id: string, response: string): Promise<Review | undefined>;

  // Certifications
  getCertificationsByManufacturer(manufacturerId: string): Promise<Certification[]>;
  createCertification(data: InsertCertification): Promise<Certification>;
  verifyCertification(id: string): Promise<Certification | undefined>;

  // Portfolio
  getPortfolioItemsByManufacturer(manufacturerId: string): Promise<PortfolioItem[]>;
  createPortfolioItem(data: InsertPortfolioItem): Promise<PortfolioItem>;

  // Verification Requests
  getVerificationRequest(id: string): Promise<VerificationRequest | undefined>;
  getPendingVerifications(): Promise<VerificationRequest[]>;
  createVerificationRequest(data: InsertVerificationRequest): Promise<VerificationRequest>;
  updateVerificationStatus(id: string, status: "approved" | "rejected", reviewedBy: string, notes?: string): Promise<VerificationRequest | undefined>;

  // Financing Leads
  getFinancingLead(id: string): Promise<FinancingLead | undefined>;
  getFinancingLeadsByInstitution(institutionId: string): Promise<FinancingLead[]>;
  createFinancingLead(data: InsertFinancingLead): Promise<FinancingLead>;
  updateFinancingLeadStatus(id: string, status: string): Promise<FinancingLead | undefined>;

  // Resources
  getResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  incrementResourceView(id: string): Promise<boolean>;
  incrementResourceDownload(id: string): Promise<boolean>;

  // Notifications
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  createNotification(data: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<boolean>;

  // LMS
  getCourses(category?: string): Promise<Course[]>;
  getCourseWithModulesAndLessons(courseId: string): Promise<any>;
  enrollInCourse(userId: string, courseId: string): Promise<UserCourseEnrollment>;
  getCourseProgress(userId: string, courseId: string): Promise<any>;
  markLessonComplete(userId: string, lessonId: string): Promise<UserLessonProgress>;
  getUserEnrollments(userId: string): Promise<any[]>;

  // Raw Materials & Project Materials
  getRawMaterials(category?: string): Promise<RawMaterial[]>;
  getRawMaterial(id: string): Promise<RawMaterial | undefined>;
  getRawMaterialSuppliers(materialId: string): Promise<any[]>;
  createRawMaterial(data: InsertRawMaterial): Promise<RawMaterial>;
  createRawMaterialSupplier(data: InsertRawMaterialSupplier): Promise<RawMaterialSupplier>;
  getProjectMaterials(projectId: string): Promise<any[]>;
  addMaterialToProject(data: InsertProjectMaterial): Promise<ProjectMaterial>;
  removeMaterialFromProject(id: string): Promise<boolean>;
  updateProjectMaterialQuantity(id: string, quantity: number): Promise<ProjectMaterial | undefined>;
  getProjectMaterialsCost(projectId: string): Promise<{ totalCost: number; currency: string }>;

  // Creators & Designers
  getCreators(filters?: any): Promise<any[]>;
  getCreator(id: string): Promise<any | undefined>;
  getCreatorByUserId(userId: string): Promise<any | undefined>;
  createCreator(data: any): Promise<any>;
  updateCreator(id: string, data: any): Promise<any | undefined>;
  getDesigners(filters?: any): Promise<any[]>;
  getDesigner(id: string): Promise<any | undefined>;
  getDesignerByUserId(userId: string): Promise<any | undefined>;
  createDesigner(data: any): Promise<any>;
  updateDesigner(id: string, data: any): Promise<any | undefined>;
}

let instance: IStorage | null = null;

export function getStorage(): IStorage {
  if (!instance) {
    // For local dev, default to MemoryStorage. A DB-backed storage can be
    // plugged in later without changing call sites.
    instance = new MemoryStorage() as unknown as IStorage;
  }
  return instance;
}

// Backwards-compatible default export used in existing code.
export const storage: IStorage = getStorage();
