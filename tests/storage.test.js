const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const {
  applyRetention,
  toLocalDateKey,
  MAX_RETENTION_DAYS,
  addEntry,
  getStoragePath,
  loadData,
  saveDataIfUnchanged,
  listToday,
  listRecent,
  searchEntries,
} = require("../storage");

test("applyRetention removes entries older than 365 days", () => {
  const now = new Date("2026-05-13T12:00:00.000Z");
  const fresh = { id: "1", text: "fresh", createdAt: "2026-05-12T12:00:00.000Z" };
  const old = { id: "2", text: "old", createdAt: "2024-01-01T00:00:00.000Z" };
  const kept = applyRetention([fresh, old], now);
  assert.equal(kept.length, 1);
  assert.equal(kept[0].id, "1");
});

test("toLocalDateKey returns YYYY-MM-DD", () => {
  const key = toLocalDateKey("2026-05-13T12:00:00.000Z");
  assert.match(key, /^\d{4}-\d{2}-\d{2}$/);
});

test("retention constant is 365", () => {
  assert.equal(MAX_RETENTION_DAYS, 365);
});

test("listToday/listRecent/searchEntries work end-to-end", async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "devlog-test-"));
  process.env.HOME = tmp;
  process.env.USERPROFILE = tmp;

  await addEntry("Implementé parser CLI");
  await addEntry("Bugfix Search");

  const today = await listToday(new Date());
  assert.ok(today.length >= 2);

  const recent = await listRecent(7, new Date());
  assert.ok(recent.length >= 2);

  const search1 = await searchEntries("search", new Date());
  assert.ok(search1.some((e) => e.text === "Bugfix Search"));

  const search2 = await searchEntries("PARSER", new Date());
  assert.ok(search2.some((e) => e.text === "Implementé parser CLI"));
});

test("saveDataIfUnchanged throws on concurrent modification", async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "devlog-conflict-"));
  process.env.HOME = tmp;
  process.env.USERPROFILE = tmp;

  await addEntry("baseline");
  const file = getStoragePath();
  const snapshot = await loadData();

  const original = JSON.parse(await fs.readFile(file, "utf8"));
  original.entries.push({
    id: "external",
    text: "external write",
    createdAt: new Date().toISOString(),
  });
  await fs.writeFile(file, JSON.stringify(original, null, 2), "utf8");

  snapshot.entries.push({
    id: "new",
    text: "new from web",
    createdAt: new Date().toISOString(),
  });
  await assert.rejects(() => saveDataIfUnchanged(snapshot, snapshot.revision), (err) => err.code === "WRITE_CONFLICT");
});
