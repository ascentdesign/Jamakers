import { query, mutation } from "convex/server";

export const getByRfq = query({
  args: { rfqId: "string" },
  handler: async ({ db }, { rfqId }) => {
    return await db
      .query("rfqResponses")
      .filter(q => q.eq(q.field("rfqId"), rfqId))
      .collect();
  },
});

export const getByManufacturer = query({
  args: { manufacturerId: "string" },
  handler: async ({ db }, { manufacturerId }) => {
    return await db
      .query("rfqResponses")
      .filter(q => q.eq(q.field("manufacturerId"), manufacturerId))
      .collect();
  },
});

export const create = mutation({
  args: {
    id: "string",
    rfqId: "string",
    manufacturerId: "string",
    message: "string?",
    price: "number?",
    currency: "string?",
  },
  handler: async ({ db }, data) => {
    const existing = await db
      .query("rfqResponses")
      .filter(q => q.eq(q.field("id"), data.id))
      .first();
    if (existing) return existing;
    const _id = await db.insert("rfqResponses", data);
    return await db.get(_id);
  },
});