import { query, mutation } from "convex/server";

export const get = query({
  args: { id: "string" },
  handler: async ({ db }, { id }) => {
    const brand = await db
      .query("brands")
      .filter(q => q.eq(q.field("id"), id))
      .first();
    return brand ?? null;
  },
});

export const getByUserId = query({
  args: { userId: "string" },
  handler: async ({ db }, { userId }) => {
    const brand = await db
      .query("brands")
      .filter(q => q.eq(q.field("userId"), userId))
      .first();
    return brand ?? null;
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
      .query("brands")
      .filter(q => q.eq(q.field("id"), data.id))
      .first();
    if (existing) return existing;
    const _id = await db.insert("brands", data);
    return await db.get(_id);
  },
});

export const update = mutation({
  args: {
    id: "string",
    data: "any",
  },
  handler: async ({ db }, { id, data }) => {
    const brand = await db
      .query("brands")
      .filter(q => q.eq(q.field("id"), id))
      .first();
    if (!brand) return null;
    await db.patch(brand._id, data);
    return await db.get(brand._id);
  },
});