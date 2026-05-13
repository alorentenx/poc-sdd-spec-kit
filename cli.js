const {
  addEntry,
  listToday,
  listRecent,
  searchEntries,
} = require("./storage");
const {
  formatEntries,
  formatAddSuccess,
  formatError,
  formatEmpty,
  helpText,
} = require("./formatter");

function parseRecentArgs(args) {
  const idx = args.indexOf("--days");
  if (idx === -1 || idx === args.length - 1) {
    throw new Error("Missing --days value");
  }
  return args[idx + 1];
}

function ensureNonEmpty(value, label) {
  if (!value || !value.trim()) {
    throw new Error(`${label} cannot be empty`);
  }
  return value.trim();
}

function ensureDays(raw) {
  const days = Number(raw);
  if (!Number.isInteger(days) || days < 1 || days > 365) {
    throw new Error("days must be an integer between 1 and 365");
  }
  return days;
}

async function main(argv = process.argv.slice(2)) {
  const [command, ...rest] = argv;

  try {
    if (!command || command === "--help" || command === "help") {
      process.stdout.write(helpText());
      return 0;
    }

    if (command === "add") {
      const text = ensureNonEmpty(rest.join(" "), "text");
      const entry = await addEntry(text);
      process.stdout.write(formatAddSuccess(entry));
      return 0;
    }

    if (command === "today") {
      const entries = await listToday();
      process.stdout.write(entries.length ? formatEntries(entries) : formatEmpty("No hay entradas para hoy"));
      return 0;
    }

    if (command === "recent") {
      const days = ensureDays(parseRecentArgs(rest));
      const entries = await listRecent(days);
      process.stdout.write(entries.length ? formatEntries(entries) : formatEmpty("No hay entradas en ese rango"));
      return 0;
    }

    if (command === "search") {
      const keyword = ensureNonEmpty(rest.join(" "), "keyword");
      const entries = await searchEntries(keyword);
      process.stdout.write(entries.length ? formatEntries(entries) : formatEmpty("No se encontraron coincidencias"));
      return 0;
    }

    throw new Error(`Unknown command: ${command}`);
  } catch (err) {
    process.stderr.write(formatError(err.message));
    return 1;
  }
}

if (require.main === module) {
  main().then((code) => {
    process.exitCode = code;
  });
}

module.exports = {
  main,
  parseRecentArgs,
  ensureNonEmpty,
  ensureDays,
};
