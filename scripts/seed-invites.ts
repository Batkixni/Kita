
import { db } from "../lib/db";
import { invitations } from "../lib/schema";
import { randomUUID } from "crypto";

async function main() {
    console.log("Seeding invites...");

    const codes = ["SORAI_KITA_917365", "KITA-DEV"];

    for (const code of codes) {
        await db.insert(invitations).values({
            id: randomUUID(),
            code,
            isUsed: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }).onConflictDoNothing();
        console.log(`Created invite: ${code}`);
    }
}

main().catch(console.error);
