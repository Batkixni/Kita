const { createClient } = require('@libsql/client');

async function main() {
    const client = createClient({
        url: 'file:local.db',
    });

    try {
        const rs = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
        console.log("Tables:", JSON.stringify(rs.rows, null, 2));
    } catch (err) {
        console.error("Error:", err);
    }
}
main();
