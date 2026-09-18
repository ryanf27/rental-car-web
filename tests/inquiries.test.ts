import { strict as assert } from "node:assert";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createClient } from "@libsql/client/node";

const databaseUrl = `file:${join(tmpdir(), `noir-inquiries-${randomUUID()}.db`)}`;
process.env.TURSO_DATABASE_URL = databaseUrl;

function dateAfter(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

test("inquiries validate input, persist totals, and avoid duplicate inserts", async () => {
  const { default: api } = await import("../api/inquiries.ts");
  const requestId = randomUUID();
  const payload = {
    requestId,
    carSlug: "porsche-911-turbo-s",
    startDate: dateAfter(5),
    endDate: dateAfter(7),
    customerName: "Demo Driver",
    email: "demo@example.com",
    phone: "+1 555 123 4567",
    message: "Test inquiry",
  };
  const post = (body: unknown) => api.fetch(new Request("http://localhost/api/inquiries", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }));

  assert.equal((await post({ ...payload, endDate: payload.startDate })).status, 422);
  assert.equal((await post({ ...payload, carSlug: "missing-car" })).status, 404);
  assert.equal((await post({ ...payload, website: "spam.example" })).status, 422);

  const result = await post(payload);
  assert.equal(result.status, 201);
  assert.deepEqual(await result.json(), {
    reference: requestId,
    vehicle: "Porsche 911 Turbo S",
    estimatedTotal: 1780,
  });
  assert.equal((await post(payload)).status, 201);

  const db = createClient({ url: databaseUrl });
  const rows = await db.execute({
    sql: "SELECT car_slug, estimated_total_cents, count(*) AS requests FROM inquiries WHERE id = ?",
    args: [requestId],
  });
  assert.equal(rows.rows[0].car_slug, "porsche-911-turbo-s");
  assert.equal(rows.rows[0].estimated_total_cents, 178000);
  assert.equal(rows.rows[0].requests, 1);
  db.close();
});
