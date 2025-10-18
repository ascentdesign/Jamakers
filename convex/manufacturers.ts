import { query, mutation } from "convex/server";

export const get = query({
  args: { id: "string" },
  handler: async ({ db }, { id }) => {
    const manufacturer = await db
      .query("manufacturers")
      .filter(q => q.eq(q.field("id"), id))
      .first();
    return manufacturer ?? null;
  },
});

export const getByUserId = query({
  args: { userId: "string" },
  handler: async ({ db }, { userId }) => {
    const manufacturer = await db
      .query("manufacturers")
      .filter(q => q.eq(q.field("userId"), userId))
      .first();
    return manufacturer ?? null;
  },
});

export const search = query({
  args: { filters: "any" },
  handler: async ({ db }, { filters }) => {
    // Simple filter implementation; expand with indexes as needed
    let q = db.query("manufacturers");
    if (filters?.country) {
      q = q.filter(qry => qry.eq(qry.field("country"), filters.country));
    }
    if (filters?.industry) {
      q = q.filter(qry => qry.eq(qry.field("industry"), filters.industry));
    }
    return await q.collect();
  },
});

export const create = mutation({
  args: {
    id: "string",
    userId: "string",
    name: "string",
    description: "string?",
    industry: "string?",
    country: "string?",
    website: "string?",
  },
  handler: async ({ db }, data) => {
    const existing = await db
      .query("manufacturers")
      .filter(q => q.eq(q.field("id"), data.id))
      .first();
    if (existing) return existing;
    const _id = await db.insert("manufacturers", data);
    return await db.get(_id);
  },
});

export const update = mutation({
  args: {
    id: "string",
    data: "any",
  },
  handler: async ({ db }, { id, data }) => {
    const manufacturer = await db
      .query("manufacturers")
      .filter(q => q.eq(q.field("id"), id))
      .first();
    if (!manufacturer) return null;
    await db.patch(manufacturer._id, data);
    return await db.get(manufacturer._id);
  },
});