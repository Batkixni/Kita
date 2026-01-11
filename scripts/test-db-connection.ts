
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

// Load env vars
dotenv.config({ path: ".env.local" });

async function testConnection() {
    const url = process.env.DATABASE_URL;
    const authToken = process.env.DATABASE_AUTH_TOKEN;

    console.log("Testing connection to:", url);
    // Mask token for safety
    console.log("Auth Token:", authToken ? (authToken.substring(0, 6) + "...") : "MISSING");

    if (!url) {
        console.error("❌ DATABASE_URL is missing");
        return;
    }

    try {
        const client = createClient({
            url,
            authToken,
        });

        console.log("⏳ Connecting...");
        const result = await client.execute("SELECT 1 as connected");
        console.log("✅ Connection Successful!", result.rows);
    } catch (err) {
        console.error("❌ Connection Failed:", err);
    }
}

testConnection();
