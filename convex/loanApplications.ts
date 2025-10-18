import { query, mutation } from "convex/server";

export const create = mutation({
  args: {
    id: "string",
    applicantId: "string",
    applicantType: "string",
    loanProductId: "string?",
    amount: "number?",
    currency: "string?",
    status: "string?",
    metadata: "any?",
  },
  handler: async ({ db }, data) => {
    const existing = await db
      .query("loanApplications")
      .filter(q => q.eq(q.field("id"), data.id))
      .first();
    if (existing) return existing;
    const _id = await db.insert("loanApplications", data);
    return await db.get(_id);
  },
});

export const getByApplicant = query({
  args: { applicantId: "string" },
  handler: async ({ db }, { applicantId }) => {
    return await db
      .query("loanApplications")
      .filter(q => q.eq(q.field("applicantId"), applicantId))
      .collect();
  },
});