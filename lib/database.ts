export function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim() || "file:local.db";
}

export function getDatabaseAuthToken() {
  const token = process.env.DATABASE_AUTH_TOKEN?.trim();
  return token ? token : undefined;
}
