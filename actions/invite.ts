'use server';

import { db } from "@/lib/db";
import { invitations, users } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(1),
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    inviteCode: z.string().min(1)
});

export async function registerWithInvite(data: z.infer<typeof registerSchema>) {
    // 1. Validate Input
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        throw new Error(firstError ? firstError.message : "Invalid input");
    }
    const { name, username, email, password, inviteCode } = parsed.data;

    // 2. Check Invite Code
    const invite = await db.query.invitations.findFirst({
        where: and(
            eq(invitations.code, inviteCode),
            eq(invitations.isUsed, false)
        )
    });

    if (!invite) {
        throw new Error("Invalid or used invitation code.");
    }

    // 3. Register User (Server-Side)
    // We use auth.api.signUpEmail directly to ensure secure registration
    try {
        const user = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
                username // better-auth handles additional fields if configured
            } as any,
            headers: await headers() // Pass headers for IP/UA
        });

        if (!user) throw new Error("Registration failed.");

        // 4. Mark Invite as Used
        // We need to fetch the user ID. simpler to just mark used now.
        // Wait, signUpEmail returns the user object or session?
        // It usually returns { user, session } or just user?
        // Let's assume it returns { user: { id: ... } }
        // Actually better-auth returns promise<User | null> or similar.

        // If we can't get ID easily immediately, we can query by email.
        const newUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (newUser) {
            await db.update(invitations)
                .set({
                    isUsed: true,
                    usedBy: newUser.id,
                    updatedAt: new Date()
                })
                .where(eq(invitations.id, invite.id));
        }

        return { success: true };

    } catch (error: any) {
        // Handle specific DB errors
        const errorMessage = error.message || "";
        if (errorMessage.includes("UNIQUE constraint failed: user.username")) {
            throw new Error("Username is already taken. Please choose another one.");
        }
        if (errorMessage.includes("UNIQUE constraint failed: user.email")) {
            throw new Error("Email is already registered. Please sign in instead.");
        }

        // Better auth throws APIError
        throw new Error(error.body?.message || errorMessage || "Registration failed");
    }
}
