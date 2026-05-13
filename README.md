# Daily Devlog CLI

CLI para registrar actividad diaria.

## Uso

```bash
node cli.js add "Implementé parser"
node cli.js today
node cli.js recent --days 7
node cli.js search parser
node cli.js --help
```

## Datos

- Ruta: `~/.devlog/entries.json`
- Retención automática: 365 días

## Tests

```bash
node --test
```
