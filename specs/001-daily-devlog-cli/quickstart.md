# Quickstart: Daily Devlog CLI

## Prerequisites

- Node.js 20+ instalado.

## Run commands

```bash
node cli.js add "Implementé soporte de búsqueda"
node cli.js today
node cli.js recent --days 7
node cli.js search parser
node cli.js --help
```

## Data location

- Archivo de datos: `~/.devlog/entries.json`
- Se crea automáticamente al primer `add`.

## Test suite

```bash
node --test
```

## Expected validation behavior

- `recent --days 0` -> error en stderr y exit code 1.
- `search ""` -> error en stderr y exit code 1.
- `add "   "` -> error en stderr y exit code 1.
