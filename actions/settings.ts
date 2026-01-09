'use server';

import { db } from "@/lib/db";
import { users, pages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getSession() {
    return await auth.api.getSession({
        headers: await headers()
    });
}

export async function updateProfile(userId: string, data: { name?: string, bio?: string, image?: string }) {
    const session = await getSession();
    if (!session || session.user.id !== userId) {
        throw new Error("Unauthorized");
    }

    await db.update(users)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(users.id, userId));

    revalidatePath(`/${session.user.username}`);
}

export async function updatePageTheme(pageId: string, theme: any) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    // Verify ownership
    const page = await db.query.pages.findFirst({
        where: eq(pages.id, pageId),
        columns: { userId: true }
    });

    if (!page || page.userId !== session.user.id) {
        throw new Error("Forbidden");
    }

    await db.update(pages)
        .set({ themeConfig: theme, updatedAt: new Date() })
        .where(eq(pages.id, pageId));

    revalidatePath(`/${session.user.username}`);
}

export async function updatePageHero(pageId: string, heroConfig: any) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    // Verify ownership
    const page = await db.query.pages.findFirst({
        where: eq(pages.id, pageId),
        columns: { userId: true }
    });

    if (!page || page.userId !== session.user.id) {
        throw new Error("Forbidden");
    }

    await db.update(pages)
        .set({ heroConfig: heroConfig, updatedAt: new Date() })
        .where(eq(pages.id, pageId));

    revalidatePath(`/${session.user.username}`);
}
