
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const command = process.argv[2];
const arg = process.argv[3];

async function main() {
    // Dynamic import to ensure env vars are loaded BEFORE db connection is initialized
    const { db } = await import("../lib/db");
    const { invitations } = await import("../lib/schema");

    const url = process.env.DATABASE_URL;
    const token = process.env.DATABASE_AUTH_TOKEN;

    let connectionType = "Unknown";
    if (!url) {
        connectionType = "Missing DATABASE_URL";
    } else if (url.startsWith("file:")) {
        connectionType = "Local File (file:...)";
    } else if (url.includes("turso.io")) {
        connectionType = `Remote Turso (${url})`;
    } else {
        connectionType = `Custom (${url})`;
    }

    if (token) {
        connectionType += " [Auth Token Present]";
    }

    console.log("Using Database:", connectionType);

    if (!command) {
        console.log(`
Usage:
  npx tsx scripts/invites.ts list             - List all invites
  npx tsx scripts/invites.ts create <code>    - Create a specific code
  npx tsx scripts/invites.ts generate         - Generate a random code
  npx tsx scripts/invites.ts delete <code>    - Delete an invite
        `);
        process.exit(0);
    }

    if (command === "list") {
        const all = await db.query.invitations.findMany({
            orderBy: [desc(invitations.createdAt)],
            with: {
                user: true // assuming relation exists, if not it will ignore
            }
        });
        console.log("--- Invitations ---");
        all.forEach(inv => {
            console.log(`${inv.code} | Used: ${inv.isUsed} | ID: ${inv.id}`);
        });
        console.log("-------------------");
    }

    else if (command === "create" || command === "generate") {
        const code = command === "create" && arg ? arg : uuidv4().substring(0, 8);
        await db.insert(invitations).values({
            id: uuidv4(),
            code,
            isUsed: false,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log(`✅ Created invite: ${code}`);
    }

    else if (command === "delete") {
        if (!arg) {
            console.error("Please provide a code to delete.");
            process.exit(1);
        }
        await db.delete(invitations).where(eq(invitations.code, arg));
        console.log(`deleted invite: ${arg}`);
    }
}

main().catch(console.error);
