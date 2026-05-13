const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { ensureDays, ensureNonEmpty, parseRecentArgs } = require("../cli");
const { main } = require("../cli");

test("ensureNonEmpty trims text", () => {
  assert.equal(ensureNonEmpty("  hola  ", "text"), "hola");
});

test("ensureNonEmpty throws on blank", () => {
  assert.throws(() => ensureNonEmpty("   ", "text"));
});

test("ensureDays validates range", () => {
  assert.equal(ensureDays("7"), 7);
  assert.throws(() => ensureDays("0"));
  assert.throws(() => ensureDays("366"));
});

test("parseRecentArgs gets --days value", () => {
  assert.equal(parseRecentArgs(["--days", "10"]), "10");
  assert.throws(() => parseRecentArgs([]));
});

test("CLI main supports add/today/recent/search", async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "devlog-cli-"));
  process.env.HOME = tmp;
  process.env.USERPROFILE = tmp;

  let out = "";
  let err = "";
  const sw = process.stdout.write;
  const ew = process.stderr.write;
  process.stdout.write = (s) => ((out += String(s)), true);
  process.stderr.write = (s) => ((err += String(s)), true);

  try {
    let code = await main(["add", "Implementé", "US1"]);
    assert.equal(code, 0);
    assert.match(out, /Saved entry/);
    out = "";

    code = await main(["today"]);
    assert.equal(code, 0);
    assert.match(out, /Implementé US1/);
    out = "";

    code = await main(["recent", "--days", "7"]);
    assert.equal(code, 0);
    assert.match(out, /Implementé US1/);
    out = "";

    code = await main(["search", "us1"]);
    assert.equal(code, 0);
    assert.match(out, /Implementé US1/);
    out = "";

    code = await main(["recent", "--days", "0"]);
    assert.equal(code, 1);
    assert.match(err, /days must be an integer between 1 and 365/);
  } finally {
    process.stdout.write = sw;
    process.stderr.write = ew;
  }
});
