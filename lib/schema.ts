import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  username: text("username").unique(), // Added username
  bio: text("bio"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const sessions = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => users.id),
});

export const accounts = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => users.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verifications = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const pages = sqliteTable("page", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  slug: text("slug").notNull().unique(), // This will be the username/path
  themeConfig: text("theme_config", { mode: "json" }), // Font, colors stored as JSON
  heroConfig: text("hero_config", { mode: "json" }), // Hero title, subtitle, image
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const modules = sqliteTable("module", {
  id: text("id").primaryKey(),
  pageId: text("page_id").notNull().references(() => pages.id),
  type: text("type").notNull(), // 'link', 'image', 'text', 'portfolio'
  content: text("content", { mode: "json" }), // Specific content for the module
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  w: integer("w").notNull(),
  h: integer("h").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const invitations = sqliteTable("invitation", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  isUsed: integer("is_used", { mode: "boolean" }).default(false).notNull(),
  usedBy: text("used_by").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const pagesRelations = relations(pages, ({ one, many }) => ({
  user: one(users, {
    fields: [pages.userId],
    references: [users.id],
  }),
  modules: many(modules),
}));

export const modulesRelations = relations(modules, ({ one }) => ({
  page: one(pages, {
    fields: [modules.pageId],
    references: [pages.id],
  }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  user: one(users, {
    fields: [invitations.usedBy],
    references: [users.id],
  }),
}));

export const analytics = sqliteTable("analytics", {
  id: text("id").primaryKey(),
  pageId: text("page_id").notNull().references(() => pages.id),
  type: text("type").notNull(), // 'view'
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
