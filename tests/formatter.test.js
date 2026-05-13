const test = require("node:test");
const assert = require("node:assert/strict");
const {
  formatEntries,
  formatAddSuccess,
  formatError,
  formatEmpty,
  helpText,
} = require("../formatter");

test("formatAddSuccess includes id", () => {
  const out = formatAddSuccess({ id: "abc", createdAt: "2026-05-13T00:00:00.000Z" });
  assert.match(out, /abc/);
});

test("formatEntries renders each line", () => {
  const out = formatEntries([{ text: "one", createdAt: "2026-05-13T00:00:00.000Z" }]);
  assert.match(out, /one/);
});

test("format helpers include trailing newline", () => {
  assert.equal(formatError("x").endsWith("\n"), true);
  assert.equal(formatEmpty("x").endsWith("\n"), true);
});

test("help text includes commands", () => {
  const out = helpText();
  assert.match(out, /add/);
  assert.match(out, /recent/);
  assert.match(out, /search/);
});
