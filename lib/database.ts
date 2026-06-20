export function getDatabaseUrl() {
  const rawUrl = process.env.DATABASE_URL;

  if (rawUrl === undefined) {
    return "file:local.db";
  }

  const url = rawUrl.trim();
  if (!url) {
    throw new Error("DATABASE_URL cannot be blank.");
  }

  return url;
}

export function getDatabaseAuthToken() {
  const token = process.env.DATABASE_AUTH_TOKEN?.trim();

  if (!token) {
    return undefined;
  }

  return token;
}
