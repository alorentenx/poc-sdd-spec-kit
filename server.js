const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const {
  addEntryWithConflictDetection,
  listToday,
  listRecent,
  searchEntries,
} = require("./storage");

function json(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendError(res, status, code, message) {
  return json(res, status, { error: { code, message } });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("payload too large"));
      }
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("invalid json"));
      }
    });
    req.on("error", reject);
  });
}

function serveFile(res, filePath, contentType) {
  return fs.readFile(filePath)
    .then((content) => {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    })
    .catch(() => {
      sendError(res, 404, "NOT_FOUND", "Resource not found");
    });
}

function createServer(options = {}) {
  const rootDir = options.rootDir || __dirname;
  const staticDir = path.join(rootDir, "frontend");
  const addEntryFn = options.addEntry || addEntryWithConflictDetection;
  const listTodayFn = options.listToday || listToday;
  const listRecentFn = options.listRecent || listRecent;
  const searchFn = options.searchEntries || searchEntries;

  return http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");

    try {
      if (req.method === "GET" && url.pathname === "/health") {
        return json(res, 200, { status: "ok" });
      }

      if (req.method === "POST" && url.pathname === "/api/entries") {
        const body = await readBody(req);
        const text = typeof body.text === "string" ? body.text.trim() : "";
        if (!text) return sendError(res, 400, "VALIDATION_ERROR", "text cannot be empty");
        const entry = await addEntryFn(text);
        return json(res, 201, { entry });
      }

      if (req.method === "GET" && url.pathname === "/api/entries/today") {
        const entries = await listTodayFn(new Date());
        return json(res, 200, { entries });
      }

      if (req.method === "GET" && url.pathname === "/api/entries/recent") {
        const days = Number(url.searchParams.get("days"));
        if (!Number.isInteger(days) || days < 1 || days > 365) {
          return sendError(res, 400, "VALIDATION_ERROR", "days must be an integer between 1 and 365");
        }
        const entries = await listRecentFn(days, new Date());
        return json(res, 200, { entries });
      }

      if (req.method === "GET" && url.pathname === "/api/entries/search") {
        const keyword = (url.searchParams.get("keyword") || "").trim();
        if (!keyword) return sendError(res, 400, "VALIDATION_ERROR", "keyword cannot be empty");
        const entries = await searchFn(keyword, new Date());
        return json(res, 200, { entries });
      }

      if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
        return serveFile(res, path.join(staticDir, "index.html"), "text/html; charset=utf-8");
      }

      if (req.method === "GET" && url.pathname === "/styles.css") {
        return serveFile(res, path.join(staticDir, "styles.css"), "text/css; charset=utf-8");
      }

      if (req.method === "GET" && url.pathname === "/app.js") {
        return serveFile(res, path.join(staticDir, "app.js"), "text/javascript; charset=utf-8");
      }

      return sendError(res, 404, "NOT_FOUND", "Resource not found");
    } catch (err) {
      if (err && err.code === "WRITE_CONFLICT") {
        return sendError(res, 409, "WRITE_CONFLICT", "Conflicto de escritura detectado. Reintenta.");
      }
      if (err && (err.message === "invalid json" || err.message === "payload too large")) {
        return sendError(res, 400, "VALIDATION_ERROR", err.message);
      }
      return sendError(res, 500, "INTERNAL_ERROR", "Unexpected server error");
    }
  });
}

function startServer(port = 3000) {
  const server = createServer();
  server.listen(port, () => {
    process.stdout.write(`Devlog web running on http://localhost:${port}\n`);
  });
  return server;
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  startServer(port);
}

module.exports = {
  createServer,
  startServer,
  readBody,
  sendError,
};
