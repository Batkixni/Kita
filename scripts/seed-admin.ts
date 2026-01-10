import { db } from "@/lib/db";
import { users, invitations } from "@/lib/schema";
import { randomUUID } from "crypto";

async function seed() {
    console.log("🌱 Seeding database...");

    try {
        // 1. Create Admin User (Optional - adjust as needed)
        // You might want to skip this if you prefer signing up normally

        // 2. Create Invitation Codes
        const codes = ["KITA-2024", "ADMIN-KEY", "EARLY-ACCESS"];

        console.log("Genering invitation codes:", codes);

        for (const code of codes) {
            await db.insert(invitations).values({
                id: randomUUID(),
                code: code,
                isUsed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        console.log("✅ Database seeded successfully.");
    } catch (error) {
        console.error("❌ Failed to seed database:", error);
        process.exit(1);
    }
}

seed();
