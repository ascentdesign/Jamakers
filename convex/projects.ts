import { query, mutation } from "convex/server";

export const getByBrand = query({
  args: { brandId: "string" },
  handler: async ({ db }, { brandId }) => {
    return await db
      .query("projects")
      .filter(q => q.eq(q.field("brandId"), brandId))
      .collect();
  },
});

export const getByManufacturer = query({
  args: { manufacturerId: "string" },
  handler: async ({ db }, { manufacturerId }) => {
    return await db
      .query("projects")
      .filter(q => q.eq(q.field("manufacturerId"), manufacturerId))
      .collect();
  },
});

export const create = mutation({
  args: {
    id: "string",
    brandId: "string",
    manufacturerId: "string?",
    title: "string",
    description: "string?",
    status: "string?",
  },
  handler: async ({ db }, data) => {
    const existing = await db
      .query("projects")
      .filter(q => q.eq(q.field("id"), data.id))
      .first();
    if (existing) return existing;
    const _id = await db.insert("projects", data);
    return await db.get(_id);
  },
});

export const update = mutation({
  args: { id: "string", data: "any" },
  handler: async ({ db }, { id, data }) => {
    const project = await db
      .query("projects")
      .filter(q => q.eq(q.field("id"), id))
      .first();
    if (!project) return null;
    await db.patch(project._id, data);
    return await db.get(project._id);
  },
});