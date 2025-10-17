import { randomUUID } from "crypto";
import {
  type User,
  type UpsertUser,
  type Manufacturer,
  type InsertManufacturer,
  type Brand,
  type InsertBrand,
  type Project,
  type InsertProject,
  type Rfq,
  type InsertRfq,
  type RfqResponse,
  type InsertRfqResponse,
  type Message,
  type InsertMessage,
  type Review,
  type InsertReview,
  type Certification,
  type InsertCertification,
  type PortfolioItem,
  type InsertPortfolioItem,
  type VerificationRequest,
  type InsertVerificationRequest,
  type FinancingLead,
  type InsertFinancingLead,
  type Resource,
  type InsertResource,
  type Notification,
  type InsertNotification,
  type Course,
  type CourseModule,
  type CourseLesson,
  type UserCourseEnrollment,
  type UserLessonProgress,
  type RawMaterial,
  type InsertRawMaterial,
  type RawMaterialSupplier,
  type InsertRawMaterialSupplier,
  type ProjectMaterial,
  type InsertProjectMaterial,
  type FinancialInstitution,
  type InsertFinancialInstitution,
  type LoanProduct,
  type InsertLoanProduct,
  type LoanApplication,
  type InsertLoanApplication,
} from "@shared/schema";

// Minimal in-memory storage for local development
// NOTE: This is not intended for production use.
export class MemoryStorage {
  private users: User[] = [];
  private manufacturers: Manufacturer[] = [];
  private brands: Brand[] = [];
  private projects: Project[] = [];
  private rfqs: Rfq[] = [];
  private rfqResponses: RfqResponse[] = [];
  private messages: Message[] = [];
  private reviews: Review[] = [];
  private certifications: Certification[] = [];
  private portfolioItems: PortfolioItem[] = [];
  private verificationRequests: VerificationRequest[] = [];
  private financingLeads: FinancingLead[] = [];
  private resources: Resource[] = [];
  private notifications: Notification[] = [];
  private courses: Course[] = [];
  private courseModules: CourseModule[] = [];
  private courseLessons: CourseLesson[] = [];
  private enrollments: UserCourseEnrollment[] = [];
  private lessonProgress: UserLessonProgress[] = [];
  private rawMaterials: RawMaterial[] = [];
  private rawMaterialSuppliers: RawMaterialSupplier[] = [];
  private projectMaterials: ProjectMaterial[] = [];
  private financialInstitutions: FinancialInstitution[] = [];
  private loanProducts: LoanProduct[] = [];
  private loanApplications: LoanApplication[] = [];

  // Helpers
  private now() { return new Date(); }

  private assignId<T extends { id?: string }>(obj: T): T & { id: string } {
    return { ...(obj as any), id: obj.id || randomUUID() };
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = this.users.find(u => u.id === userData.id);
    if (existing) {
      const updated: User = { ...existing, ...userData, updatedAt: this.now() } as any;
      this.users = this.users.map(u => u.id === existing.id ? updated : u);
      return updated;
    }
    const created: User = {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      role: userData.role as any,
      currency: (userData as any).currency || 'USD',
      createdAt: this.now(),
      updatedAt: this.now(),
    } as any;
    this.users.push(created);
    return created;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return this.users.filter(u => u.role === (role as any));
  }

  // Manufacturers
  async getManufacturer(id: string): Promise<Manufacturer | undefined> {
    return this.manufacturers.find(m => m.id === id);
  }

  async getManufacturerByUserId(userId: string): Promise<Manufacturer | undefined> {
    return this.manufacturers.find(m => m.userId === userId);
  }

  async createManufacturer(data: InsertManufacturer): Promise<Manufacturer> {
    const withId = this.assignId(data);
    const manufacturer: Manufacturer = {
      ...(withId as any),
      verificationStatus: (data as any).verificationStatus || 'pending',
      averageRating: (data as any).averageRating || 0,
      totalReviews: (data as any).totalReviews || 0,
      createdAt: this.now(),
      updatedAt: this.now(),
    } as any;
    this.manufacturers.push(manufacturer);
    return manufacturer;
  }

  async updateManufacturer(id: string, data: Partial<InsertManufacturer>): Promise<Manufacturer | undefined> {
    const existing = this.manufacturers.find(m => m.id === id);
    if (!existing) return undefined;
    const updated: Manufacturer = { ...existing, ...(data as any), updatedAt: this.now() } as any;
    this.manufacturers = this.manufacturers.map(m => m.id === id ? updated : m);
    return updated;
  }

  async searchManufacturers(_filters: any): Promise<Manufacturer[]> {
    return this.manufacturers;
  }

  // Brands
  async getBrand(id: string): Promise<Brand | undefined> {
    return this.brands.find(b => b.id === id);
  }

  async getBrandByUserId(userId: string): Promise<Brand | undefined> {
    return this.brands.find(b => b.userId === userId);
  }

  async createBrand(data: InsertBrand): Promise<Brand> {
    const withId = this.assignId(data);
    const brand: Brand = {
      ...(withId as any),
      createdAt: this.now(),
      updatedAt: this.now(),
    } as any;
    this.brands.push(brand);
    return brand;
  }

  async updateBrand(id: string, data: Partial<InsertBrand>): Promise<Brand | undefined> {
    const existing = this.brands.find(b => b.id === id);
    if (!existing) return undefined;
    const updated: Brand = { ...existing, ...(data as any), updatedAt: this.now() } as any;
    this.brands = this.brands.map(b => b.id === id ? updated : b);
    return updated;
  }

  // Projects
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.find(p => p.id === id);
  }

  async getProjectsByBrand(brandId: string): Promise<Project[]> {
    return this.projects.filter(p => p.brandId === brandId);
  }

  async getProjectsByManufacturer(manufacturerId: string): Promise<Project[]> {
    return this.projects.filter(p => p.manufacturerId === manufacturerId);
  }

  async createProject(data: InsertProject): Promise<Project> {
    const withId = this.assignId(data);
    const project: Project = {
      ...(withId as any),
      status: (data as any).status || 'draft',
      createdAt: this.now(),
      updatedAt: this.now(),
    } as any;
    this.projects.push(project);
    return project;
  }

  async updateProject(id: string, data: Partial<InsertProject>): Promise<Project | undefined> {
    const existing = this.projects.find(p => p.id === id);
    if (!existing) return undefined;
    const updated: Project = { ...existing, ...(data as any), updatedAt: this.now() } as any;
    this.projects = this.projects.map(p => p.id === id ? updated : p);
    return updated;
  }

  // RFQs
  async getRfq(id: string): Promise<Rfq | undefined> {
    return this.rfqs.find(r => r.id === id);
  }

  async getRfqsByBrand(brandId: string): Promise<Rfq[]> {
    return this.rfqs.filter(r => r.brandId === brandId);
  }

  async getActiveRfqs(): Promise<Rfq[]> {
    return this.rfqs.filter(r => (r as any).status !== 'closed');
  }

  async createRfq(data: InsertRfq): Promise<Rfq> {
    const withId = this.assignId(data);
    const rfq: Rfq = {
      ...(withId as any),
      status: (data as any).status || 'active',
      createdAt: this.now(),
      updatedAt: this.now(),
    } as any;
    this.rfqs.push(rfq);
    return rfq;
  }

  async updateRfq(id: string, data: Partial<InsertRfq>): Promise<Rfq | undefined> {
    const existing = this.rfqs.find(r => r.id === id);
    if (!existing) return undefined;
    const updated: Rfq = { ...existing, ...(data as any), updatedAt: this.now() } as any;
    this.rfqs = this.rfqs.map(r => r.id === id ? updated : r);
    return updated;
  }

  async deleteRfq(id: string): Promise<boolean> {
    const before = this.rfqs.length;
    this.rfqs = this.rfqs.filter(r => r.id !== id);
    return this.rfqs.length < before;
  }

  // RFQ Responses
  async getRfqResponse(id: string): Promise<RfqResponse | undefined> {
    return this.rfqResponses.find(rr => rr.id === id);
  }

  async getRfqResponsesByRfq(rfqId: string): Promise<RfqResponse[]> {
    return this.rfqResponses.filter(rr => rr.rfqId === rfqId);
  }

  async getRfqResponsesByManufacturer(manufacturerId: string): Promise<RfqResponse[]> {
    return this.rfqResponses.filter(rr => rr.manufacturerId === manufacturerId);
  }

  async createRfqResponse(data: InsertRfqResponse): Promise<RfqResponse> {
    const withId = this.assignId(data);
    const response: RfqResponse = {
      ...(withId as any),
      createdAt: this.now(),
      updatedAt: this.now(),
    } as any;
    this.rfqResponses.push(response);
    return response;
  }

  // Messages
  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.find(m => m.id === id);
  }

  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
    return this.messages.filter(m => (m as any).senderId === userId1 && (m as any).recipientId === userId2 || (m as any).senderId === userId2 && (m as any).recipientId === userId1);
  }

  async getMessageThreads(userId: string): Promise<Message[]> {
    return this.messages.filter(m => (m as any).senderId === userId || (m as any).recipientId === userId);
  }

  async createMessage(data: InsertMessage): Promise<Message> {
    const withId = this.assignId(data);
    const message: Message = { ...(withId as any), createdAt: this.now(), updatedAt: this.now(), status: (data as any).status || 'sent' } as any;
    this.messages.push(message);
    return message;
  }

  async markMessageAsRead(id: string): Promise<boolean> {
    const existing = this.messages.find(m => m.id === id);
    if (!existing) return false;
    const updated: Message = { ...existing, status: 'read' as any, updatedAt: this.now() } as any;
    this.messages = this.messages.map(m => m.id === id ? updated : m);
    return true;
  }

  // Reviews
  async getReview(id: string): Promise<Review | undefined> {
    return this.reviews.find(r => r.id === id);
  }

  async getReviewsByManufacturer(manufacturerId: string): Promise<Review[]> {
    return this.reviews.filter(r => (r as any).manufacturerId === manufacturerId);
  }

  async createReview(data: InsertReview): Promise<Review> {
    const withId = this.assignId(data);
    const review: Review = { ...(withId as any), createdAt: this.now(), updatedAt: this.now() } as any;
    this.reviews.push(review);
    return review;
  }

  async updateReviewResponse(id: string, response: string): Promise<Review | undefined> {
    const existing = this.reviews.find(r => r.id === id);
    if (!existing) return undefined;
    const updated: Review = { ...existing, response: response as any, updatedAt: this.now() } as any;
    this.reviews = this.reviews.map(r => r.id === id ? updated : r);
    return updated;
  }

  // Certifications
  async getCertificationsByManufacturer(manufacturerId: string): Promise<Certification[]> {
    return this.certifications.filter(c => (c as any).manufacturerId === manufacturerId);
  }

  async createCertification(data: InsertCertification): Promise<Certification> {
    const withId = this.assignId(data);
    const cert: Certification = { ...(withId as any), createdAt: this.now(), updatedAt: this.now() } as any;
    this.certifications.push(cert);
    return cert;
  }

  async verifyCertification(id: string): Promise<Certification | undefined> {
    const existing = this.certifications.find(c => c.id === id);
    if (!existing) return undefined;
    const updated: Certification = { ...existing, verifiedAt: this.now() } as any;
    this.certifications = this.certifications.map(c => c.id === id ? updated : c);
    return updated;
  }

  // Portfolio
  async getPortfolioItemsByManufacturer(manufacturerId: string): Promise<PortfolioItem[]> {
    return this.portfolioItems.filter(p => (p as any).manufacturerId === manufacturerId);
  }

  async createPortfolioItem(data: InsertPortfolioItem): Promise<PortfolioItem> {
    const withId = this.assignId(data);
    const item: PortfolioItem = { ...(withId as any), createdAt: this.now(), updatedAt: this.now() } as any;
    this.portfolioItems.push(item);
    return item;
  }

  // Verification Requests
  async getVerificationRequest(id: string): Promise<VerificationRequest | undefined> {
    return this.verificationRequests.find(v => v.id === id);
  }

  async getPendingVerifications(): Promise<VerificationRequest[]> {
    return this.verificationRequests.filter(v => (v as any).status === 'pending');
  }

  async createVerificationRequest(data: InsertVerificationRequest): Promise<VerificationRequest> {
    const withId = this.assignId(data);
    const req: VerificationRequest = { ...(withId as any), createdAt: this.now(), updatedAt: this.now(), status: (data as any).status || 'pending' } as any;
    this.verificationRequests.push(req);
    return req;
  }

  async updateVerificationStatus(id: string, status: 'approved' | 'rejected', reviewedBy: string, notes?: string): Promise<VerificationRequest | undefined> {
    const existing = this.verificationRequests.find(v => v.id === id);
    if (!existing) return undefined;
    const updated: VerificationRequest = { ...existing, status: status as any, reviewedBy: reviewedBy as any, notes: notes as any, updatedAt: this.now() } as any;
    this.verificationRequests = this.verificationRequests.map(v => v.id === id ? updated : v);
    return updated;
  }

  // Financing Leads
  async getFinancingLead(id: string): Promise<FinancingLead | undefined> {
    return this.financingLeads.find(f => f.id === id);
  }

  async getFinancingLeadsByInstitution(institutionId: string): Promise<FinancingLead[]> {
    return this.financingLeads.filter(f => (f as any).institutionId === institutionId);
  }

  async createFinancingLead(data: InsertFinancingLead): Promise<FinancingLead> {
    const withId = this.assignId(data);
    const lead: FinancingLead = { ...(withId as any), createdAt: this.now(), updatedAt: this.now(), status: (data as any).status || 'new' } as any;
    this.financingLeads.push(lead);
    return lead;
  }

  async updateFinancingLeadStatus(id: string, status: string): Promise<FinancingLead | undefined> {
    const existing = this.financingLeads.find(f => f.id === id);
    if (!existing) return undefined;
    const updated: FinancingLead = { ...existing, status: status as any, updatedAt: this.now() } as any;
    this.financingLeads = this.financingLeads.map(f => f.id === id ? updated : f);
    return updated;
  }

  // Resources
  async getResources(): Promise<Resource[]> {
    return this.resources;
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return this.resources.filter(r => (r as any).category === category);
  }

  async incrementResourceView(id: string): Promise<boolean> {
    const existing = this.resources.find(r => r.id === id);
    if (!existing) return false;
    (existing as any).views = ((existing as any).views || 0) + 1;
    return true;
  }

  async incrementResourceDownload(id: string): Promise<boolean> {
    const existing = this.resources.find(r => r.id === id);
    if (!existing) return false;
    (existing as any).downloads = ((existing as any).downloads || 0) + 1;
    return true;
  }

  // Notifications
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return this.notifications.filter(n => (n as any).userId === userId);
  }

  async createNotification(data: InsertNotification): Promise<Notification> {
    const withId = this.assignId(data);
    const notif: Notification = { ...(withId as any), createdAt: this.now(), updatedAt: this.now(), isRead: (data as any).isRead || false } as any;
    this.notifications.push(notif);
    return notif;
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    const existing = this.notifications.find(n => n.id === id);
    if (!existing) return false;
    const updated: Notification = { ...existing, isRead: true as any, updatedAt: this.now() } as any;
    this.notifications = this.notifications.map(n => n.id === id ? updated : n);
    return true;
  }

  // LMS (minimal stubs)
  async getCourses(_category?: string): Promise<Course[]> {
    return this.courses;
  }

  async getCourseWithModulesAndLessons(_courseId: string): Promise<any> {
    return null;
  }

  async enrollInCourse(userId: string, courseId: string): Promise<UserCourseEnrollment> {
    const enrollment: UserCourseEnrollment = { id: randomUUID(), userId, courseId, enrolledAt: this.now() } as any;
    this.enrollments.push(enrollment);
    return enrollment;
  }

  async getCourseProgress(_userId: string, _courseId: string): Promise<any> {
    return { progressPercentage: 0, completedLessons: 0, totalLessons: 0 };
  }

  async markLessonComplete(userId: string, lessonId: string): Promise<UserLessonProgress> {
    const progress: UserLessonProgress = { id: randomUUID(), userId, lessonId, isCompleted: true, createdAt: this.now(), completedAt: this.now() } as any;
    this.lessonProgress.push(progress);
    return progress;
  }

  async getUserEnrollments(userId: string): Promise<any[]> {
    return this.enrollments.filter(e => e.userId === userId);
  }

  // Raw materials and project materials (minimal)
  async getRawMaterials(_category?: string): Promise<RawMaterial[]> { return this.rawMaterials; }
  async getRawMaterial(id: string): Promise<RawMaterial | undefined> { return this.rawMaterials.find(r => r.id === id); }
  async getRawMaterialSuppliers(materialId: string): Promise<any[]> { return this.rawMaterialSuppliers.filter(s => (s as any).rawMaterialId === materialId) as any; }
  async createRawMaterial(data: InsertRawMaterial): Promise<RawMaterial> { const withId = this.assignId(data); const rm: RawMaterial = { ...(withId as any), createdAt: this.now(), updatedAt: this.now() } as any; this.rawMaterials.push(rm); return rm; }
  async createRawMaterialSupplier(data: InsertRawMaterialSupplier): Promise<RawMaterialSupplier> { const withId = this.assignId(data); const s: RawMaterialSupplier = { ...(withId as any), createdAt: this.now(), updatedAt: this.now() } as any; this.rawMaterialSuppliers.push(s); return s; }

  async getProjectMaterials(projectId: string): Promise<any[]> { return this.projectMaterials.filter(pm => pm.projectId === projectId) as any; }
  async addMaterialToProject(data: InsertProjectMaterial): Promise<ProjectMaterial> { const withId = this.assignId(data); const pm: ProjectMaterial = { ...(withId as any), createdAt: this.now(), updatedAt: this.now(), totalCost: (data as any).totalCost || 0 } as any; this.projectMaterials.push(pm); return pm; }
  async removeMaterialFromProject(id: string): Promise<boolean> { const before = this.projectMaterials.length; this.projectMaterials = this.projectMaterials.filter(pm => pm.id !== id); return this.projectMaterials.length < before; }
  async updateProjectMaterialQuantity(id: string, quantity: number): Promise<ProjectMaterial | undefined> { const existing = this.projectMaterials.find(pm => pm.id === id); if (!existing) return undefined; const updated: ProjectMaterial = { ...existing, quantity, updatedAt: this.now() } as any; this.projectMaterials = this.projectMaterials.map(pm => pm.id === id ? updated : pm); return updated; }
  async getProjectMaterialsCost(projectId: string): Promise<{ totalCost: number; currency: string }> { const items = (this.projectMaterials.filter(pm => pm.projectId === projectId) as any); const total = items.reduce((sum: number, pm: any) => sum + (pm.totalCost || 0), 0); return { totalCost: total, currency: 'USD' }; }

  // Creators
  async getCreators(filters?: any): Promise<any[]> { if (!filters || filters.availableForHire === undefined) return this.candidates(this.creatorsData()); return this.candidates(this.creatorsData().filter(c => c.availableForHire === filters.availableForHire)); }
  async getCreator(id: string): Promise<any | undefined> { return this.creatorsData().find(c => c.id === id); }
  async getCreatorByUserId(userId: string): Promise<any | undefined> { return this.creatorsData().find(c => c.userId === userId); }
  async createCreator(data: any): Promise<any> { const created = { id: randomUUID(), createdAt: this.now(), updatedAt: this.now(), ...data }; this._creators.push(created); return created; }
  async updateCreator(id: string, data: any): Promise<any | undefined> { const existing = this._creators.find(c => c.id === id); if (!existing) return undefined; const updated = { ...existing, ...data, updatedAt: this.now() }; this._creators = this._creators.map(c => c.id === id ? updated : c); return updated; }

  // Designers
  async getDesigners(filters?: any): Promise<any[]> { if (!filters || filters.availableForHire === undefined) return this.candidates(this.designersData()); return this.candidates(this.designersData().filter(d => d.availableForHire === filters.availableForHire)); }
  async getDesigner(id: string): Promise<any | undefined> { return this.designersData().find(d => d.id === id); }
  async getDesignerByUserId(userId: string): Promise<any | undefined> { return this.designersData().find(d => d.userId === userId); }
  async createDesigner(data: any): Promise<any> { const created = { id: randomUUID(), createdAt: this.now(), updatedAt: this.now(), ...data }; this._designers.push(created); return created; }
  async updateDesigner(id: string, data: any): Promise<any | undefined> { const existing = this._designers.find(d => d.id === id); if (!existing) return undefined; const updated = { ...existing, ...data, updatedAt: this.now() }; this._designers = this._designers.map(d => d.id === id ? updated : d); return updated; }

  // Financial Institutions & Loans (minimal)
  async getFinancialInstitutions(): Promise<FinancialInstitution[]> { return this.financialInstitutions; }
  async getFinancialInstitution(id: string): Promise<FinancialInstitution | undefined> { return this.financialInstitutions.find(fi => fi.id === id); }
  async createFinancialInstitution(data: InsertFinancialInstitution): Promise<FinancialInstitution> { const withId = this.assignId(data); const fi: FinancialInstitution = { ...(withId as any), createdAt: this.now(), updatedAt: this.now() } as any; this.financialInstitutions.push(fi); return fi; }
  async updateFinancialInstitution(id: string, data: Partial<InsertFinancialInstitution>): Promise<FinancialInstitution | undefined> { const existing = this.financialInstitutions.find(fi => fi.id === id); if (!existing) return undefined; const updated: FinancialInstitution = { ...existing, ...(data as any), updatedAt: this.now() } as any; this.financialInstitutions = this.financialInstitutions.map(fi => fi.id === id ? updated : fi); return updated; }
  async getLoanProducts(): Promise<LoanProduct[]> { return this.loanProducts; }
  async getLoanProductsByInstitution(institutionId: string): Promise<LoanProduct[]> { return this.loanProducts.filter(lp => lp.lenderId === institutionId); }
  async createLoanProduct(data: InsertLoanProduct): Promise<LoanProduct> { const withId = this.assignId(data); const lp: LoanProduct = { ...(withId as any), createdAt: this.now(), updatedAt: this.now(), isActive: (data as any).isActive ?? true } as any; this.loanProducts.push(lp); return lp; }
  async updateLoanProduct(id: string, data: Partial<InsertLoanProduct>): Promise<LoanProduct | undefined> { const existing = this.loanProducts.find(lp => lp.id === id); if (!existing) return undefined; const updated: LoanProduct = { ...existing, ...(data as any), updatedAt: this.now() } as any; this.loanProducts = this.loanProducts.map(lp => lp.id === id ? updated : lp); return updated; }
  async getLoanApplication(id: string): Promise<LoanApplication | undefined> { return this.loanApplications.find(la => la.id === id); }
  async getLoanApplicationsByApplicant(applicantId: string): Promise<LoanApplication[]> { return this.loanApplications.filter(la => la.applicantId === applicantId); }
  async getLoanApplicationsByInstitution(institutionId: string): Promise<LoanApplication[]> { return this.loanApplications.filter(la => (la as any).institutionId === institutionId); }
  async createLoanApplication(data: InsertLoanApplication): Promise<LoanApplication> { const withId = this.assignId(data); const la: LoanApplication = { ...(withId as any), createdAt: this.now(), updatedAt: this.now(), status: (data as any).status || 'draft' } as any; this.loanApplications.push(la); return la; }
  async updateLoanApplicationStatus(id: string, status: string): Promise<LoanApplication | undefined> { const existing = this.loanApplications.find(la => la.id === id); if (!existing) return undefined; const updated: LoanApplication = { ...existing, status: status as any, updatedAt: this.now() } as any; this.loanApplications = this.loanApplications.map(la => la.id === id ? updated : la); return updated; }

  // Internal seed for creators/designers when none exist (simple placeholders)
  private _creators: any[] = [];
  private _designers: any[] = [];

  private creatorsData(): any[] { return this._creators; }
  private designersData(): any[] { return this._designers; }
  private candidates<T>(arr: T[]): T[] { return arr; }
}