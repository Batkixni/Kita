'use server';

import { db } from "@/lib/db";
import { modules, pages } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { moduleSchema, updateModulePosSchema } from "@/lib/validations";

async function getSession() {
    return await auth.api.getSession({
        headers: await headers()
    });
}

// Helper: Verify User Owns Page
async function verifyPageOwnership(pageId: string) {
    const session = await getSession();

    // DEMO BYPASS: Check if page is demo page
    const page = await db.query.pages.findFirst({
        where: eq(pages.id, pageId),
        columns: { userId: true, slug: true }
    });

    if (page && (page.slug === 'demo' || page.userId === 'demo-user-id')) {
        return session || { user: { id: 'demo-user-id', username: 'demo' } }; // Return dummy session if needed
    }

    if (!session?.user) {
        console.error("verifyPageOwnership: No session found");
        throw new Error("Unauthorized");
    }

    if (!page || page.userId !== session.user.id) {
        throw new Error("Forbidden");
    }
    return session;
}

// Helper: Verify User Owns Module (via Page)
async function verifyModuleOwnership(moduleId: string) {
    const session = await getSession();

    const module = await db.query.modules.findFirst({
        where: eq(modules.id, moduleId),
        with: {
            page: {
                columns: { userId: true, slug: true }
            }
        }
    });

    // DEMO BYPASS
    if (module?.page && (module.page.slug === 'demo' || module.page.userId === 'demo-user-id')) {
        return { session: session || { user: { id: 'demo-user-id', username: 'demo' } }, module };
    }

    if (!session?.user) {
        console.error("verifyModuleOwnership: No session found. Headers cookie:", (await headers()).get('cookie'));
        throw new Error("Unauthorized");
    }

    // @ts-ignore - Relation defines page exists
    if (!module || !module.page || module.page.userId !== session.user.id) {
        throw new Error("Forbidden");
    }

    return { session, module };
}

export async function createModule(pageId: string, type: string, x: number, y: number, content: any, w: number = 2, h: number = 2) {
    // Validate Input
    const data = moduleSchema.parse({
        pageId,
        type,
        x, y, w, h,
        content
    });

    await verifyPageOwnership(pageId);

    // Find the lowest point in the current layout to avoid collision
    const existingModules = await db.query.modules.findMany({
        where: eq(modules.pageId, pageId),
        columns: { y: true, h: true }
    });

    let nextY = 0;
    if (existingModules.length > 0) {
        // Calculate max Y+H
        nextY = Math.max(...existingModules.map(m => m.y + m.h));
    }

    await db.insert(modules).values({
        id: randomUUID(),
        pageId,
        type: data.type,
        x: data.x, // Put at 0 (left)
        y: nextY,  // Put at bottom
        w: data.w,
        h: data.h,
        content: data.content,
        // Also initialize mobile X/Y to be unset (or bottom) so defaults pick it up correctly?
        // Let's leave them null, DraggableGrid defaults logic handles "New Default" well (y=Infinity).
        mobileX: null,
        mobileY: null, // this will make it appear at bottom on mobile too due to default logic
        mobileW: null,
        mobileH: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const session = await getSession();
    if (session) revalidatePath(`/${session.user.username}`);
}

export async function updateModulePosition(
    id: string,
    x: number,
    y: number,
    w: number,
    h: number,
    mobileX?: number | null,
    mobileY?: number | null,
    mobileW?: number | null,
    mobileH?: number | null
) {
    const data = updateModulePosSchema.parse({ id, x, y, w, h, mobileX, mobileY, mobileW, mobileH });
    const { session } = await verifyModuleOwnership(id);

    const updateData: any = {
        updatedAt: new Date()
    };

    // If mobile fields are present, update them. 
    // Logic: The client sends what it sees. 
    // If we are in desktop mode, client sends desktop x/y/w/h. 
    // If in mobile, client might send mobileX/Y... 
    // But wait, the schema validation ensures x/y/w/h are always present. 
    // The client should send the desktop values (preserving them) when updating mobile, coverage?
    // Actually, DraggableGrid's onLayoutChange sends the whole layout item. 
    // We should be careful not to overwrite desktop layout with mobile values if the client is confused.
    // The implementation plan says: determine desktop vs mobile and send correct payload.

    // We update fields if they are provided.
    // However, x/y/w/h are required by the schema/function signature.
    // So we always update desktop fields? 
    // If the user modifies MOBILE layout, we don't want to change DESKTOP x/y/w/h.
    // BUT the function signature requires x,y,w,h.
    // I should probably make x,y,w,h optional in the Action if I want to update independently, 
    // OR the client acts as the source of truth and sends back the current state of both.

    // Better approach matching the plan: 
    // The client always sends the current known state.
    // But RGL only gives us the "current layout".
    // If we are on mobile, RGL gives us the mobile positions (which might look like x=0, y=10...).
    // If we blindly save those as `x`,`y`, we break desktop.

    // So, we update:
    if (typeof mobileX !== 'undefined') updateData.mobileX = mobileX;
    if (typeof mobileY !== 'undefined') updateData.mobileY = mobileY;
    if (typeof mobileW !== 'undefined') updateData.mobileW = mobileW;
    if (typeof mobileH !== 'undefined') updateData.mobileH = mobileH;

    // Only update desktop if we intend to.
    // But the schema (and currently the signature) demands x,y.
    // We will just always update everything passed. 
    // The CLIENT is responsible for passing the correct 'desktop' values 
    // (even if invisible) when editing mobile, or vice versa.
    // Actually simpler: 
    // If we are editing mobile, we pass x=currentDesktopX, y=currentDesktopY, mobileX=newMobileX ...

    updateData.x = data.x;
    updateData.y = data.y;
    updateData.w = data.w;
    updateData.h = data.h;

    await db.update(modules)
        .set(updateData)
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
