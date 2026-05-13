const fs = require("fs/promises");
const path = require("path");
const os = require("os");
const crypto = require("crypto");

const MAX_RETENTION_DAYS = 365;

function getStorageDir() {
  return path.join(os.homedir(), ".devlog");
}

function getStoragePath() {
  return path.join(getStorageDir(), "entries.json");
}

function defaultData() {
  return { version: 1, entries: [] };
}

async function ensureStorageFile() {
  const dir = getStorageDir();
  const file = getStoragePath();
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, JSON.stringify(defaultData(), null, 2), "utf8");
  }
}

function isValidIsoDate(value) {
  const d = new Date(value);
  return !Number.isNaN(d.getTime()) && d.toISOString() === value;
}

function normalizeEntries(entries) {
  return entries
    .filter((e) => e && typeof e.text === "string" && e.text.trim() && isValidIsoDate(e.createdAt))
    .map((e) => ({ id: String(e.id), text: e.text, createdAt: e.createdAt }));
}

function cutoffDate(now = new Date(), days = MAX_RETENTION_DAYS) {
  const d = new Date(now);
  d.setUTCDate(d.getUTCDate() - days);
  return d;
}

function applyRetention(entries, now = new Date()) {
  const cutoff = cutoffDate(now);
  return entries.filter((e) => new Date(e.createdAt) >= cutoff);
}

async function loadData() {
  await ensureStorageFile();
  const content = await fs.readFile(getStoragePath(), "utf8");
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = defaultData();
  }
  const entries = normalizeEntries(parsed.entries || []);
  return { version: 1, entries };
}

async function saveData(data) {
  await ensureStorageFile();
  await fs.writeFile(getStoragePath(), JSON.stringify(data, null, 2), "utf8");
}

function toLocalDateKey(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function sortDesc(entries) {
  return [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function addEntry(text) {
  const cleanText = text.trim();
  if (!cleanText) throw new Error("text cannot be empty");
  const data = await loadData();
  const retained = applyRetention(data.entries);
  const entry = {
    id: crypto.randomUUID ? crypto.randomUUID() : `e_${Date.now()}`,
    text: cleanText,
    createdAt: new Date().toISOString(),
  };
  data.entries = sortDesc([entry, ...retained]);
  await saveData(data);
  return entry;
}

async function listToday(now = new Date()) {
  const data = await loadData();
  const retained = applyRetention(data.entries, now);
  const todayKey = toLocalDateKey(now);
  return sortDesc(retained.filter((e) => toLocalDateKey(e.createdAt) === todayKey));
}

async function listRecent(days, now = new Date()) {
  if (!Number.isInteger(days) || days < 1 || days > MAX_RETENTION_DAYS) {
    throw new Error("days must be an integer between 1 and 365");
  }
  const data = await loadData();
  const retained = applyRetention(data.entries, now);
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  return sortDesc(retained.filter((e) => new Date(e.createdAt) >= start && new Date(e.createdAt) <= now));
}

async function searchEntries(keyword, now = new Date()) {
  const clean = keyword.trim();
  if (!clean) throw new Error("keyword cannot be empty");
  const data = await loadData();
  const retained = applyRetention(data.entries, now);
  const q = clean.toLowerCase();
  return sortDesc(retained.filter((e) => e.text.toLowerCase().includes(q)));
}

module.exports = {
  MAX_RETENTION_DAYS,
  getStorageDir,
  getStoragePath,
  ensureStorageFile,
  loadData,
  saveData,
  addEntry,
  listToday,
  listRecent,
  searchEntries,
  applyRetention,
  toLocalDateKey,
};
