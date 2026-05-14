const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { createServer } = require("../server");

async function startTempServer(overrides = {}) {
  const server = createServer(overrides);
  await new Promise((resolve) => server.listen(0, resolve));
  const address = server.address();
  const base = `http://127.0.0.1:${address.port}`;
  return { server, base };
}

test("health and static index work", async () => {
  const { server, base } = await startTempServer({ rootDir: path.join(__dirname, "..") });
  try {
    const health = await fetch(`${base}/health`);
    assert.equal(health.status, 200);
    const hj = await health.json();
    assert.equal(hj.status, "ok");

    const page = await fetch(`${base}/`);
    assert.equal(page.status, 200);
    const text = await page.text();
    assert.match(text, /Devlog/);
  } finally {
    server.close();
  }
});

test("POST /api/entries returns 201 and 400", async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "devlog-http-"));
  process.env.HOME = tmp;
  process.env.USERPROFILE = tmp;

  const { server, base } = await startTempServer();
  try {
    const bad = await fetch(`${base}/api/entries`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: "   " }),
    });
    assert.equal(bad.status, 400);

    const ok = await fetch(`${base}/api/entries`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: "Entrada API" }),
    });
    assert.equal(ok.status, 201);
    const payload = await ok.json();
    assert.equal(payload.entry.text, "Entrada API");
  } finally {
    server.close();
  }
});

test("POST /api/entries maps write conflict to 409", async () => {
  const { server, base } = await startTempServer({
    addEntry: async () => {
      const e = new Error("write conflict");
      e.code = "WRITE_CONFLICT";
      throw e;
    },
  });
  try {
    const res = await fetch(`${base}/api/entries`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: "hola" }),
    });
    assert.equal(res.status, 409);
    const body = await res.json();
    assert.equal(body.error.code, "WRITE_CONFLICT");
  } finally {
    server.close();
  }
});

test("today/recent/search routes and validations", async () => {
  const entries = [{ id: "1", text: "Bugfix Search", createdAt: new Date().toISOString() }];
  const { server, base } = await startTempServer({
    listToday: async () => entries,
    listRecent: async () => entries,
    searchEntries: async (keyword) => entries.filter((e) => e.text.toLowerCase().includes(keyword.toLowerCase())),
  });
  try {
    const t = await fetch(`${base}/api/entries/today`);
    assert.equal(t.status, 200);

    const rBad = await fetch(`${base}/api/entries/recent?days=0`);
    assert.equal(rBad.status, 400);

    const r = await fetch(`${base}/api/entries/recent?days=7`);
    assert.equal(r.status, 200);

    const sBad = await fetch(`${base}/api/entries/search?keyword=`);
    assert.equal(sBad.status, 400);

    const s = await fetch(`${base}/api/entries/search?keyword=search`);
    assert.equal(s.status, 200);
    const sj = await s.json();
    assert.equal(sj.entries.length, 1);
  } finally {
    server.close();
  }
});
