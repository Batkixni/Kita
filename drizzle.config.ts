import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import { getDatabaseAuthToken, getDatabaseUrl } from "./lib/database";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  dialect: "turso",
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: getDatabaseUrl(),
    authToken: getDatabaseAuthToken(),
  },
});
