'use server';

import { db } from "@/lib/db";
import { modules } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth"; // Assuming auth is from this path
import { headers } from "next/headers";

export async function createModule(pageId: string, type: string, x: number, y: number, content: any, w: number = 2, h: number = 2) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    await db.insert(modules).values({
        id: randomUUID(),
        pageId,
        type,
        x,
        y,
        w, // Use provided width or default
        h, // Use provided height or default
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    revalidatePath(`/${session.user.username}`);
}

export async function updateModulePosition(id: string, x: number, y: number, w: number, h: number) {
    await db.update(modules)
        .set({ x, y, w, h, updatedAt: new Date() })
        .where(eq(modules.id, id));
    revalidatePath('/[username]', 'page');
}

export async function updateModuleContent(id: string, content: any) {
    await db.update(modules)
        .set({ content, updatedAt: new Date() })
        .where(eq(modules.id, id));
    revalidatePath('/[username]', 'page');
}

export async function deleteModule(id: string) {
    await db.delete(modules).where(eq(modules.id, id));
    revalidatePath('/[username]', 'page');
}
