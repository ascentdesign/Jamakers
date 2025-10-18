import { query, mutation } from "convex/server";

export const get = query({
  args: { id: "string" },
  handler: async ({ db }, { id }) => {
    const user = await db
      .query("users")
      .filter(q => q.eq(q.field("id"), id))
      .first();
    return user ?? null;
  },
});

export const getByRole = query({
  args: { role: "string" },
  handler: async ({ db }, { role }) => {
    const users = await db
      .query("users")
      .filter(q => q.eq(q.field("role"), role))
      .collect();
    return users;
  },
});

export const upsert = mutation({
  args: {
    id: "string",
    email: "string",
    displayName: "string",
    role: "string",
    profileImageUrl: "string?",
  },
  handler: async ({ db }, user) => {
    const existing = await db
      .query("users")
      .filter(q => q.eq(q.field("id"), user.id))
      .first();

    if (existing) {
      await db.patch(existing._id, user);
      const updated = await db.get(existing._id);
      return updated;
    } else {
      const _id = await db.insert("users", user);
      const created = await db.get(_id);
      return created;
    }
  },
});