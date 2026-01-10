import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { pages, users, modules } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { ThemeSynchronizer } from "@/components/ThemeSynchronizer";
import { headers } from "next/headers";
import { DraggableGrid } from "@/components/grid/DraggableGrid";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { randomUUID } from "node:crypto";
import { createModule, deleteModule, updateModuleContent, updateModulePosition } from "@/actions/modules";
import { UserFooter } from "@/components/layout/UserFooter";

import { type Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
    const { username } = await params;
    // We could fetch user here for title, but simplicity:
    return {
        title: `${username} | Kita`,
        openGraph: {
            images: [`/api/og?username=${username}`],
        },
    };
}

export default async function UserPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    let session = await auth.api.getSession({
        headers: await headers()
    });

    // DEV BYPASS: If username is 'demo', act as owner for testing
    // This effectively "turns off" the auth requirement for this user.
    if (!session && username === 'demo') {
        session = {
            user: {
                id: 'demo-user-id',
                name: 'Demo User',
                email: 'demo@example.com',
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                image: null,
                username: 'demo'
            },
            session: {
                id: 'demo-session',
                userId: 'demo-user-id',
                token: 'demo-token',
                expiresAt: new Date(Date.now() + 1000000),
                createdAt: new Date(),
                updatedAt: new Date(),
                ipAddress: '127.0.0.1',
                userAgent: 'dev-agent'
            }
        }
    }

    let user = await db.query.users.findFirst({
        where: eq(users.username, username)
    });

    // DEBUG: Log to help verify DB state
    const allUsers = await db.query.users.findMany();
    console.log("DEBUG: All Users:", allUsers.map(u => ({ name: u.name, username: u.username })));

    // DEV BYPASS: If username is 'demo', act as owner for testing
    if (!user && username === 'demo') {
        user = {
            id: 'demo-user-id',
            name: 'Demo User',
            email: 'demo@example.com',
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            image: null,
            username: 'demo'
        } as any;
    }

    if (!user) {
        // HELPFUL 404: If logged in, check if they are visiting the wrong URL
        // @ts-ignore
        if (session?.user?.username && session.user.username !== username) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-stone-50">
                    <h1 className="text-6xl font-bold text-stone-200 mb-4">404</h1>
                    <p className="text-xl text-stone-600 mb-8">Page <b>/{username}</b> not found.</p>

                    <div className="bg-white border border-stone-200 p-8 rounded-3xl shadow-sm text-lg max-w-md mx-auto">
                        <p className="text-stone-500 mb-4">Hello <b>{session.user.name}</b>!</p>
                        <p className="mb-6">It looks like you are trying to visit <b>/{username}</b>, but your username is actually <b className="text-black">{session.user.username}</b>.</p>
                        {/* @ts-ignore */}
                        <a href={`/${session.user.username}`} className="block w-full py-3 px-6 bg-black text-white rounded-xl font-medium hover:bg-stone-800 transition">
                            Go to my page (/{session.user.username})
                        </a>
                    </div>
                </div>
            );
        }

        return notFound();
    }

    const page = user ? await db.query.pages.findFirst({
        where: eq(pages.userId, user.id),
    }) : undefined;

    const pageModules = page ? await db.select().from(modules).where(eq(modules.pageId, page.id)) : [];

    // DEV BYPASS: Allow 'demo' user to pass as owner
    const isOwner = session?.user?.id === user?.id || (username === 'demo' && session?.user?.id === 'demo-user-id');

    // DEV BYPASS: Handle page creation for demo in-memory or hint (since we can't save to DB easily without real record)
    // Actually, if we want to save, we need a real DB record.
    // Let's AUTO-CREATE the demo user and page in the DB if they don't exist, using this server component!
    // This is a "Heal/Seed" on request.

    if (username === 'demo' && !page) {
        // This runs on the server, so we can write to DB!
        // Check if real demo user exists, if not create
        let demoUser = await db.query.users.findFirst({ where: eq(users.username, 'demo') });
        if (!demoUser) {
            await db.insert(users).values({
                id: 'demo-user-id',
                name: 'Demo User',
                email: 'demo@example.com',
                username: 'demo',
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        // Check page
        const demoPage = await db.query.pages.findFirst({ where: eq(pages.slug, 'demo') });
        if (!demoPage) {
            const pageId = randomUUID();
            await db.insert(pages).values({
                id: pageId,
                userId: 'demo-user-id',
                slug: 'demo',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            // Insert some initial modules
            await db.insert(modules).values({
                id: randomUUID(),
                pageId: pageId,
                type: 'text',
                content: { text: '# Welcome to Kita!\nThis is a demo page.' },
                x: 0, y: 0, w: 2, h: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        // Refresh page to load them
        // (Next.js might need a reload, but let's just fall through to the next render or return wait)
        // For this render, we just manually populate:
        return UserPage({ params: Promise.resolve({ username: 'demo' }) }); // Recursive call once?
    }

    if (!page && !isOwner) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>This user hasn't set up their page yet.</p>
            </div>
        );
    }

    if (!page && isOwner) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <p>Welcome, {user.name}! Let's set up your page.</p>
                <form action={async () => {
                    'use server';
                    const { randomUUID } = await import('node:crypto');
                    const pageId = randomUUID();
                    await db.insert(pages).values({
                        id: pageId,
                        userId: user.id,
                        slug: user.username!,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                    // Insert initial text module
                    await db.insert(modules).values({
                        id: randomUUID(),
                        pageId: pageId,
                        type: 'text',
                        content: { text: '# Welcome to my page!' },
                        x: 0,
                        y: 0,
                        w: 2,
                        h: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });

                    redirect(`/${user.username}`);
                }}>
                    <button type="submit" className="px-4 py-2 bg-black text-white rounded-full hover:bg-stone-800 transition">
                        Initialize My Page
                    </button>
                </form>
            </div>
        );
    }

    // Helper to determine if color is dark
    const isDark = (color?: string) => {
        if (!color) return false;
        try {
            const hex = color.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return (r * 0.299 + g * 0.587 + b * 0.114) < 186; // Threshold for dark text usually around 128-186 depending on preference
        } catch (e) {
            return false;
        }
    };

    const themeConfig = (page?.themeConfig || {}) as any;
    const bgColor = themeConfig.backgroundColor;
    // If bgColor is null/empty, we assume it's the specific "Dark Mode" preset (or any preset requesting CSS defaults).
    // In our simplified logic, null = Dark Mode.
    // Explicit color = check brightness.
    // Enhanced: Check if theme has a specific cssClass
    const themeClass = themeConfig.cssClass || "";

    // Improved Dark Mode Logic:
    // 1. If a CSS Class is present, strictly follow 'dark' class presence.
    // 2. If no CSS Class (Default Theme), fallback to legacy logic (null bg = dark, light bg = light).
    let isDarkMode = false;
    if (themeClass && themeClass.trim() !== '') {
        isDarkMode = themeClass.includes('dark');
    } else {
        isDarkMode = !bgColor || isDark(bgColor);
    }

    // Layout Mode Logic
    const layoutMode = themeConfig.layoutMode || 'center';

    // Main Container Classes
    const containerClasses = cn(
        "w-full transition-all duration-300",
        layoutMode === 'center' ? "max-w-3xl mx-auto space-y-8" :
            layoutMode === 'minimal' ? "max-w-7xl mx-auto p-4 lg:p-8" : // Minimal: full width, no grid-cols on container
                "max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-4 lg:p-8"
    );

    // Profile & Grid Classes based on Layout
    // For Side Layouts: Profile is 3-4 cols, Grid is 8-9 cols.
    // Sticky positioning for profile.

    const isSideLayout = layoutMode === 'left' || layoutMode === 'right';

    // REMOVED IMPORT FROM HERE

    return (
        <div
            className={cn(
                "min-h-screen p-4 sm:p-8 flex flex-col transition-colors duration-500 bg-background text-foreground relative",
                // Removed md:block to ensure flex column layout for footer positioning always, unless grid requires block?
                // Actually the main container classes are complex.
                // Let's keep flex col. It's safer for footer.
                isDarkMode ? "dark" : "",
                themeClass
            )}
            style={bgColor ? { backgroundColor: bgColor } : undefined}
        >
            <ThemeSynchronizer isDarkMode={isDarkMode} />
            <main id="main-content" className={cn(containerClasses, "flex-1")}>
                {/* Profile Section - Hidden in minimal mode */}
                {/* Profile Section - Visible for controls, content hidden in minimal inside component */}
                <div className={cn(
                    isSideLayout ? "lg:col-span-4 xl:col-span-3" : "w-full",
                    layoutMode === 'right' && "lg:order-2"
                )}>
                    <div className={cn(
                        isSideLayout && "lg:sticky lg:top-8"
                    )}>
                        <ProfileHeader
                            user={user}
                            page={page}
                            isOwner={isOwner}
                            layoutMode={layoutMode as any}
                        />
                    </div>
                </div>

                {/* Grid Section */}
                <div className={cn(
                    isSideLayout ? "lg:col-span-8 xl:col-span-9" : "w-full"
                )}>
                    <DraggableGrid
                        items={pageModules as any[]}
                        isEditable={isOwner}
                        theme={page?.themeConfig}
                        onLayoutChange={async (layout) => {
                            'use server';
                            // Bulk update all modules that moved
                            await Promise.all(layout.map(item =>
                                updateModulePosition(item.i, item.x, item.y, item.w, item.h)
                            ));
                        }}
                        onDelete={async (id) => {
                            'use server';
                            await deleteModule(id);
                        }}
                        onUpdateContent={async (id, content) => {
                            'use server';
                            await updateModuleContent(id, content);
                        }}
                    />
                </div>
            </main>

            <UserFooter />

            {isOwner && (
                <EditorToolbar pageId={page!.id} themeConfig={page?.themeConfig} />
            )}
        </div>
    );
}
