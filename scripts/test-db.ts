import { db } from "../server/db";
import * as schema from "../shared/schema";

async function main() {
  try {
    const rows = await db.select().from(schema.users).limit(1);
    console.log("DB connected. Sample users row:", rows[0] ?? null);
    process.exit(0);
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
}

main();