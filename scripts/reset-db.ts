import { db } from "@/lib/db";
import { users, sessions, invitations, pages, modules } from "@/lib/schema";
import { sql } from "drizzle-orm";

async function reset() {
    console.log("⚠️  Resetting database...");

    try {
        // Delete in order to respect foreign keys if strict
        await db.delete(modules);
        await db.delete(pages);
        await db.delete(sessions);
        await db.delete(invitations);
        await db.delete(users);

        console.log("✅ Database reset successfully.");
    } catch (error) {
        console.error("❌ Failed to reset database:", error);
        process.exit(1);
    }
}

reset();
