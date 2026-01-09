
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from "@/lib/db";
import { users, pages, modules, sessions, accounts } from "@/lib/schema";
import { ne, eq, inArray } from "drizzle-orm";

async function main() {
    console.log("Cleaning up database (handling ALL FKs)...");

    try {
        // 1. Find users to delete
        const usersToDelete = await db.query.users.findMany({
            where: ne(users.username, 'demo'),
            columns: { id: true, username: true }
        });

        if (usersToDelete.length === 0) {
            console.log("No non-demo users found.");
            process.exit(0);
        }

        const userIds = usersToDelete.map(u => u.id);
        console.log(`Target Users (${usersToDelete.length}):`, usersToDelete.map(u => u.username));

        // 2. Find their pages
        const pagesToDelete = await db.query.pages.findMany({
            where: inArray(pages.userId, userIds),
            columns: { id: true }
        });

        const pageIds = pagesToDelete.map(p => p.id);

        // 3. Delete Modules for those pages
        if (pageIds.length > 0) {
            await db.delete(modules).where(inArray(modules.pageId, pageIds));
            console.log("Deleted modules.");

            // 4. Delete Pages
            await db.delete(pages).where(inArray(pages.id, pageIds));
            console.log(`Deleted ${pageIds.length} pages.`);
        }

        // 5. Delete Sessions & Accounts
        await db.delete(sessions).where(inArray(sessions.userId, userIds));
        console.log("Deleted sessions.");

        await db.delete(accounts).where(inArray(accounts.userId, userIds));
        console.log("Deleted accounts.");

        // 6. Delete Users
        await db.delete(users).where(inArray(users.id, userIds));
        console.log(`Deleted ${userIds.length} users.`);

    } catch (err) {
        console.error("Error cleaning up:", err);
    }

    process.exit(0);
}

main();
