import { query, mutation } from "convex/server";

export const get = query({
  args: { id: "string" },
  handler: async ({ db }, { id }) => {
    const rfq = await db
      .query("rfqs")
      .filter(q => q.eq(q.field("id"), id))
      .first();
    return rfq ?? null;
  },
});

export const getByBrand = query({
  args: { brandId: "string" },
  handler: async ({ db }, { brandId }) => {
    return await db
      .query("rfqs")
      .filter(q => q.eq(q.field("brandId"), brandId))
      .collect();
  },
});

export const getActive = query({
  args: {},
  handler: async ({ db }) => {
    return await db.query("rfqs").collect();
  },
});

export const create = mutation({
  args: {
    id: "string",
    brandId: "string",
    title: "string",
    description: "string?",
    quantity: "number?",
    unit: "string?",
    dueDate: "string?",
  },
  handler: async ({ db }, data) => {
    const existing = await db
      .query("rfqs")
      .filter(q => q.eq(q.field("id"), data.id))
      .first();
    if (existing) return existing;
    const _id = await db.insert("rfqs", data);
    return await db.get(_id);
  },
});

export const update = mutation({
  args: { id: "string", data: "any" },
  handler: async ({ db }, { id, data }) => {
    const rfq = await db
      .query("rfqs")
      .filter(q => q.eq(q.field("id"), id))
      .first();
    if (!rfq) return null;
    await db.patch(rfq._id, data);
    return await db.get(rfq._id);
  },
});

export const remove = mutation({
  args: { id: "string" },
  handler: async ({ db }, { id }) => {
    const rfq = await db
      .query("rfqs")
      .filter(q => q.eq(q.field("id"), id))
      .first();
    if (!rfq) return false;
    await db.delete(rfq._id);
    return true;
  },
});