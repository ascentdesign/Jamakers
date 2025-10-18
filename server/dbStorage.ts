import { eq } from 'drizzle-orm'
// Do not import db at top-level; lazily import to avoid requiring DATABASE_URL in dev
import { MemoryStorage } from './memoryStorage'
import {
  users,
  brands,
  loanApplications,
  type User,
  type UpsertUser,
  type Brand,
  type InsertBrand,
  type LoanApplication,
  type InsertLoanApplication,
} from '@shared/schema'

export class DbStorage extends MemoryStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const { db } = await import('./db')
    const rows = await db.select().from(users).where(eq(users.id, id)).limit(1)
    return rows[0]
  }

  async getUsersByRole(role: string): Promise<User[]> {
    const { db } = await import('./db')
    const rows = await db.select().from(users).where(eq(users.role, role))
    return rows
  }

  async upsertUser(data: UpsertUser): Promise<User> {
    const { db } = await import('./db')
    const result = await db
      .insert(users)
      .values(data)
      .onConflictDoUpdate({ target: users.id, set: {
        email: data.email ?? undefined,
        firstName: data.firstName ?? undefined,
        lastName: data.lastName ?? undefined,
        profileImageUrl: data.profileImageUrl ?? undefined,
        role: data.role ?? undefined,
        currency: data.currency ?? undefined,
      } })
      .returning()
    return result[0]
  }

  // Brands
  async getBrand(id: string): Promise<Brand | undefined> {
    const { db } = await import('./db')
    const rows = await db.select().from(brands).where(eq(brands.id, id)).limit(1)
    return rows[0]
  }

  async getBrandByUserId(userId: string): Promise<Brand | undefined> {
    const { db } = await import('./db')
    const rows = await db.select().from(brands).where(eq(brands.userId, userId)).limit(1)
    return rows[0]
  }

  async createBrand(data: InsertBrand): Promise<Brand> {
    const { db } = await import('./db')
    const result = await db.insert(brands).values(data).returning()
    return result[0]
  }

  async updateBrand(id: string, data: Partial<InsertBrand>): Promise<Brand | undefined> {
    const { db } = await import('./db')
    const result = await db.update(brands).set(data).where(eq(brands.id, id)).returning()
    return result[0]
  }

  // Loans
  async createLoanApplication(data: InsertLoanApplication): Promise<LoanApplication> {
    const { db } = await import('./db')
    const res = await db.insert(loanApplications).values(data).returning()
    return res[0]
  }

  async getLoanApplicationsByApplicant(applicantId: string): Promise<LoanApplication[]> {
    const { db } = await import('./db')
    const rows = await db.select().from(loanApplications).where(eq(loanApplications.applicantId, applicantId))
    return rows
  }
}