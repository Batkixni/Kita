const Database = require('better-sqlite3');
const db = new Database('local.db', { readonly: true });

try {
    const tableInfo = db.prepare("PRAGMA table_info(user)").all();
    console.log("User table columns:", JSON.stringify(tableInfo, null, 2));
} catch (err) {
    console.error("Error reading database:", err);
}
