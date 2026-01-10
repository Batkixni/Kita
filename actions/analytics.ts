'use server';

import { db } from "@/lib/db";
import { analytics, pages } from "@/lib/schema";
import { eq, sql, and, gte } from "drizzle-orm";
import { headers } from "next/headers";

export async function trackView(pageSlug: string) {
    try {
        const page = await db.query.pages.findFirst({
            where: eq(pages.slug, pageSlug),
        });

        if (!page) return;

        // Simple view tracking
        // In a real app, we would hash IP + UserAgent + Day to track unique visitors securely
        // For now, we just track raw views to satisfy the requirement of "Real Data" vs "Fake Data"

        await db.insert(analytics).values({
            id: crypto.randomUUID(),
            pageId: page.id,
            type: 'view',
            createdAt: new Date(),
        });

    } catch (error) {
        console.error("Failed to track view:", error);
    }
}

export async function getPageAnalytics(pageId: string) {
    try {
        // Get total views
        const totalViewsResult = await db.select({ count: sql<number>`count(*)` })
            .from(analytics)
            .where(and(
                eq(analytics.pageId, pageId),
                eq(analytics.type, 'view')
            ));

        const totalViews = totalViewsResult[0]?.count || 0;

        // Get views from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentViewsResult = await db.select({ count: sql<number>`count(*)` })
            .from(analytics)
            .where(and(
                eq(analytics.pageId, pageId),
                eq(analytics.type, 'view'),
                gte(analytics.createdAt, thirtyDaysAgo)
            ));

        const recentViews = recentViewsResult[0]?.count || 0;

        // For now, Visitors = Views / 1.5 (Heuristic) or just same as views if we don't track IPs
        // To make it "Real" but simple, let's just count unique timestamps? No, that's everything.
        // Let's just return Views for now, and maybe a placeholder for Visitors that is derived?
        // Or if we can't track visitors without IPs, we should just show Views.
        // But the UI has "Visitors". 
        // Let's Assume 1 Visitor = 1 View for this MVP unless we add IP tracking schema. 
        // User wants REAL data. 
        // I'll stick to Views = Total Rows. Visitors = 70% of views (Heuristic) or just disable it?
        // Better: Just return the View Count accurately.

        return {
            views: totalViews,
            recentViews: recentViews
        };
    } catch (error) {
        console.error("Failed to get analytics:", error);
        return { views: 0, recentViews: 0 };
    }
}
