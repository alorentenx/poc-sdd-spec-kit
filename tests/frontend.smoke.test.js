const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const { createServer } = require("../server");

test("frontend smoke: root and assets available", async () => {
  const server = createServer({ rootDir: path.join(__dirname, "..") });
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    const root = await fetch(`${base}/`);
    assert.equal(root.status, 200);

    const css = await fetch(`${base}/styles.css`);
    assert.equal(css.status, 200);

    const js = await fetch(`${base}/app.js`);
    assert.equal(js.status, 200);
  } finally {
    server.close();
  }
});
