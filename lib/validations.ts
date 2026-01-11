import { z } from "zod";

export const moduleSchema = z.object({
    pageId: z.string().uuid().optional(),
    type: z.enum(["text", "image", "link", "custom", "video", "section-title", "project", "metric", "badge", "info-card", "social", "spotify-playlist"]),
    x: z.number().int().min(0),
    y: z.number().int().min(0),
    w: z.number().int().min(1).max(12),
    h: z.number().int().min(1).max(12),
    content: z.any() // Structured content validation can be stricter based on type, but 'any' allows JSON flexibility for now
});

export const updateModulePosSchema = z.object({
    id: z.string().uuid(),
    x: z.number().int().min(0),
    y: z.number().int().min(0),
    w: z.number().int().min(1).max(12),
    h: z.number().int().min(1).max(12),
});

export const profileSchema = z.object({
    name: z.string().min(1).max(50).optional(),
    bio: z.string().max(160).optional(),
    image: z.string().url().optional().or(z.literal('')),
});

export const themeConfigSchema = z.object({
    mode: z.enum(['light', 'dark', 'system']).optional(),
    color: z.string().optional(),
    radius: z.string().optional(),
    font: z.string().optional(),
    layoutMode: z.enum(['center', 'left', 'right', 'minimal']).optional(),
}).passthrough(); // Allow extra theme props

export const heroConfigSchema = z.object({
    title: z.string().max(100).optional(),
    subtitle: z.string().max(200).optional(),
    image: z.string().url().optional().or(z.literal('')),
    align: z.enum(['left', 'center', 'right']).optional(),
}).passthrough();
