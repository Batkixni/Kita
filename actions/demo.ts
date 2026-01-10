'use server';

import { db } from "@/lib/db";
import { users, pages, modules } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function startDemo() {
    // 1. Ensure Demo User Exists
    let user = await db.query.users.findFirst({
        where: eq(users.username, "demo")
    });

    if (!user) {
        await db.insert(users).values({
            id: "demo-user-id",
            name: "Demo User",
            email: "demo@example.com",
            username: "demo",
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    // 2. Ensure Demo Page Exists
    let page = await db.query.pages.findFirst({
        where: eq(pages.slug, "demo")
    });

    if (!page) {
        const pageId = randomUUID();
        await db.insert(pages).values({
            id: pageId,
            userId: "demo-user-id",
            slug: "demo",
            createdAt: new Date(),
            updatedAt: new Date(),
            themeConfig: {
                layoutMode: "center",
                radius: "0.625rem"
            }
        });

        await db.insert(modules).values({
            id: randomUUID(),
            pageId: pageId,
            type: "text",
            content: { text: "# Welcome to Kita Demo!\nTry editing this text." },
            x: 0, y: 0, w: 2, h: 2,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    // 3. Create Session manually using Better Auth API
    // We can use admin/programmatic sign in if supported, or manually insert session and set cookie.
    // Better Auth has 'api.signInEmail' but that requires password.
    // We can use 'createSession' which is internal/server-side likely. 
    // Wait, auth.api.createSession is available.

    // Actually, simple way: Just generate a token and set cookie?
    // Better Auth handles this via `auth.api.createSession`.

    // Note: createSession returns a session object and potential cookie headers?
    // Let's check docs or usage. Usually it sets headers if run in Server Action context?
    // If not, we might need to rely on `cookies()` from next/headers.

    // Workaround: We can't easily sign in without a password via standard API unless we set one.
    // BUT we can use `auth.api.createSession`!

    // 3. Create Session manually
    const { cookies } = await import("next/headers");
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    // Insert into DB
    const { sessions } = await import("@/lib/schema");

    await db.insert(sessions).values({
        id: randomUUID(),
        userId: "demo-user-id",
        token: token,
        expiresAt: expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
        ipAddress: "127.0.0.1",
        userAgent: "demo-agent"
    });

    // Set Cookie
    (await cookies()).set("better-auth.session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: expiresAt
    });

    redirect("/demo");

    // The createSession call should set the cookies on the response headers automagically if using the NextJS adapter correctly?
    // If not, we might need to manually set. 
    // However, since we are in a Server Action, `headers()` is read-only. We need `cookies()` to set cookies.
    // Better Auth v1 often handles this if we pass the request context or it uses async local storage.

    // Let's try redirecting. If cookie isn't set, we failed.
    redirect("/demo");
}
