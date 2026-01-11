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
    try {
        // 1. Validate Input
        const parsed = registerSchema.safeParse(data);
        if (!parsed.success) {
            const firstError = parsed.error.issues[0];
            return { success: false, error: firstError ? firstError.message : "Invalid input" };
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
            return { success: false, error: "Invalid or used invitation code." };
        }

        // 3. Register User (Server-Side)
        // We use auth.api.signUpEmail directly to ensure secure registration
        let user;
        try {
            user = await auth.api.signUpEmail({
                body: {
                    email,
                    password,
                    name,
                    username
                } as any,
                headers: await headers()
            });
        } catch (apiError: any) {
            const errorMessage = apiError.message || "";
            if (errorMessage.includes("UNIQUE constraint failed: user.username")) {
                return { success: false, error: "Username is already taken." };
            }
            if (errorMessage.includes("UNIQUE constraint failed: user.email")) {
                return { success: false, error: "Email is already registered." };
            }
            return { success: false, error: apiError.body?.message || errorMessage || "Registration failed" };
        }

        if (!user) return { success: false, error: "Registration failed." };

        // 4. Mark Invite as Used
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
        console.error("Register Invite Error:", error);
        return { success: false, error: error.message || "Something went wrong" };
    }
}
