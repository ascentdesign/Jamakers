// Minimal hand-authored function references to avoid requiring convex codegen.
// This matches our local convex functions structure.
export const api = {
  users: {
    get: { path: "users:get" } as any,
    upsert: { path: "users:upsert" } as any,
    getByRole: { path: "users:getByRole" } as any,
  },
  manufacturers: {
    get: { path: "manufacturers:get" } as any,
    getByUserId: { path: "manufacturers:getByUserId" } as any,
    search: { path: "manufacturers:search" } as any,
    create: { path: "manufacturers:create" } as any,
    update: { path: "manufacturers:update" } as any,
  },
  brands: {
    get: { path: "brands:get" } as any,
    getByUserId: { path: "brands:getByUserId" } as any,
    create: { path: "brands:create" } as any,
    update: { path: "brands:update" } as any,
  },
  rfqs: {
    get: { path: "rfqs:get" } as any,
    getByBrand: { path: "rfqs:getByBrand" } as any,
    getActive: { path: "rfqs:getActive" } as any,
    create: { path: "rfqs:create" } as any,
    update: { path: "rfqs:update" } as any,
    remove: { path: "rfqs:remove" } as any,
  },
  rfqResponses: {
    getByRfq: { path: "rfqResponses:getByRfq" } as any,
    getByManufacturer: { path: "rfqResponses:getByManufacturer" } as any,
    create: { path: "rfqResponses:create" } as any,
  },
  projects: {
    getByBrand: { path: "projects:getByBrand" } as any,
    getByManufacturer: { path: "projects:getByManufacturer" } as any,
    create: { path: "projects:create" } as any,
    update: { path: "projects:update" } as any,
  },
  loanApplications: {
    create: { path: "loanApplications:create" } as any,
    getByApplicant: { path: "loanApplications:getByApplicant" } as any,
  },
} as const;