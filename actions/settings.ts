'use server';

import { db } from "@/lib/db";
import { users, pages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateProfile(userId: string, data: { name?: string, bio?: string, image?: string }) {
    await db.update(users)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(users.id, userId));
    revalidatePath('/[username]', 'page');
}

export async function updatePageTheme(pageId: string, theme: any) {
    await db.update(pages)
        .set({ themeConfig: theme, updatedAt: new Date() })
        .where(eq(pages.id, pageId));
    revalidatePath('/[username]', 'page');
}
