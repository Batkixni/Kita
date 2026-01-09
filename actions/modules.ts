'use server';

import { db } from "@/lib/db";
import { modules, pages } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getSession() {
    return await auth.api.getSession({
        headers: await headers()
    });
}

// Helper: Verify User Owns Page
async function verifyPageOwnership(pageId: string) {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const page = await db.query.pages.findFirst({
        where: eq(pages.id, pageId),
        columns: { userId: true }
    });

    if (!page || page.userId !== session.user.id) {
        throw new Error("Forbidden");
    }
    return session;
}

// Helper: Verify User Owns Module (via Page)
async function verifyModuleOwnership(moduleId: string) {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const module = await db.query.modules.findFirst({
        where: eq(modules.id, moduleId),
        with: {
            page: {
                columns: { userId: true }
            }
        }
    });

    // @ts-ignore - Relation defines page exists
    if (!module || !module.page || module.page.userId !== session.user.id) {
        throw new Error("Forbidden");
    }

    return { session, module };
}

export async function createModule(pageId: string, type: string, x: number, y: number, content: any, w: number = 2, h: number = 2) {
    await verifyPageOwnership(pageId);

    await db.insert(modules).values({
        id: randomUUID(),
        pageId,
        type,
        x,
        y,
        w,
        h,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const session = await getSession();
    if (session) revalidatePath(`/${session.user.username}`);
}

export async function updateModulePosition(id: string, x: number, y: number, w: number, h: number) {
    const { session } = await verifyModuleOwnership(id);

    await db.update(modules)
        .set({ x, y, w, h, updatedAt: new Date() })
        .where(eq(modules.id, id));

    revalidatePath(`/${session.user.username}`);
}

export async function updateModuleContent(id: string, content: any) {
    const { session } = await verifyModuleOwnership(id);

    await db.update(modules)
        .set({ content, updatedAt: new Date() })
        .where(eq(modules.id, id));

    revalidatePath(`/${session.user.username}`);
}

export async function deleteModule(id: string) {
    const { session } = await verifyModuleOwnership(id);

    await db.delete(modules).where(eq(modules.id, id));

    revalidatePath(`/${session.user.username}`);
}
