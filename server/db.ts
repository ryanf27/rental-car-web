import { mkdirSync } from "node:fs";
import { createClient, type Client } from "@libsql/client/node";

const schema = `
  CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    car_slug TEXT NOT NULL,
    car_name TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    daily_price_cents INTEGER NOT NULL,
    estimated_total_cents INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  )
`;

let connection: Promise<Client> | undefined;

export function getDatabase(): Promise<Client> {
  connection ??= (async () => {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url && process.env.VERCEL) {
      throw new Error("TURSO_DATABASE_URL is required on Vercel");
    }
    if (url && !url.startsWith("file:") && !authToken) {
      throw new Error("TURSO_AUTH_TOKEN is required for a remote database");
    }

    if (!url) mkdirSync("data", { recursive: true });
    const client = createClient({ url: url || "file:./data/noir.db", authToken });
    await client.execute(schema);
    await client.execute("CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON inquiries(created_at)");
    return client;
  })().catch((error: unknown) => {
    connection = undefined;
    throw error;
  });

  return connection;
}
