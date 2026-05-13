function formatDate(iso) {
  return new Date(iso).toLocaleString();
}

function formatEntries(entries) {
  return entries
    .map((e) => `[${formatDate(e.createdAt)}] ${e.text}`)
    .join("\n")
    .concat("\n");
}

function formatAddSuccess(entry) {
  return `Saved entry ${entry.id} at ${entry.createdAt}\n`;
}

function formatError(message) {
  return `Error: ${message}\n`;
}

function formatEmpty(message) {
  return `${message}\n`;
}

function helpText() {
  return [
    "Usage:",
    "  node cli.js add <text...>",
    "  node cli.js today",
    "  node cli.js recent --days <1..365>",
    "  node cli.js search <keyword>",
    "  node cli.js --help",
    "",
  ].join("\n");
}

module.exports = {
  formatDate,
  formatEntries,
  formatAddSuccess,
  formatError,
  formatEmpty,
  helpText,
};
