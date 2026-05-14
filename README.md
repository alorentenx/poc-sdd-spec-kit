# POC-SDD-SPEC-KIT: Daily Devlog CLI

Proyecto de ejemplo: "DevLog", una CLI en Node.js para registrar lo que haces
cada día como desarrollador.

Permite:
- añadir entradas con texto libre y timestamp exacto
- listar entradas de hoy
- listar entradas de los últimos N días (1..365)
- buscar por palabra clave (case-insensitive, por subcadena)

## Requisitos

- Node.js 20+ recomendado
- `@openai/codex` instalado globalmente (para el flujo Spec Kit con Codex)

## Instalación de Codex

```bash
npm install -g @openai/codex
```

## Flujo Spec Kit (Codex)

### 1) Crear proyecto e inicializar Spec Kit

```bash
mkdir devlog
cd devlog
specify init . --integration codex
```

Alternativa modo skills:

```bash
specify init . --integration codex --integration-options="--skills"
```

### 2) Abrir Codex en el proyecto

```bash
codex
```

### 3) Comandos Speckit usados en esta POC

```text
$speckit-constitution Proyecto CLI en Node.js. Principios: código simple y legible, sin dependencias externas innecesarias, datos guardados en JSON local, comandos intuitivos tipo Unix, cobertura de tests en funciones core.
$speckit-specify Quiero una herramienta de línea de comandos para que un desarrollador pueda registrar lo que hizo durante el día...
$speckit-clarify
$speckit-plan Node.js puro sin frameworks, datos en JSON en ~/.devlog/entries.json, CLI con process.argv (sin librerías externas), tests con Node test runner nativo. Tres ficheros: cli.js, storage.js, formatter.js.
$speckit-tasks
$speckit-implement
```

Nota: en Codex se usa prefijo `$speckit-` (con guion).

## Estructura generada (resumen)

```text
devlog/
├── AGENTS.md
├── .agents/
│   └── skills/
└── .specify/
    ├── memory/
    └── templates/
```

## Implementación actual de la CLI

- `cli.js`: entrada, parseo de `process.argv` y enrutado de comandos
- `storage.js`: lectura/escritura JSON en `~/.devlog/entries.json`
- `formatter.js`: presentación de salidas y errores

## Nuevo: Frontend + servidor web local

Se añadió una interfaz web local y un servidor HTTP sin dependencias externas:

- `server.js`: API HTTP local + servido de archivos estáticos
- `frontend/index.html`: interfaz de usuario
- `frontend/styles.css`: estilos base
- `frontend/app.js`: lógica de UI y llamadas a la API
- `tests/server.test.js`: tests de contrato HTTP
- `tests/frontend.smoke.test.js`: smoke test de carga de frontend

Capacidades del frontend (v1):
- crear entrada
- listar entradas de hoy
- listar entradas recientes (`1..365`)
- buscar por keyword (subcadena, case-insensitive)
- mostrar estados de éxito, vacío y error
- manejo de conflicto concurrente (`WRITE_CONFLICT`) con reintento

## Uso

```bash
node cli.js --help

node cli.js add "Implementé parser"
node cli.js add "Arreglé bug de búsqueda"

node cli.js today
node cli.js recent --days 7
node cli.js search parser
node cli.js search BUG
```

## Frontend local

### Arranque

```bash
npm run start:web
```

Abre `http://localhost:3000` y usa:
- alta de entrada desde formulario
- vista de hoy
- vista de recientes (`1..365`)
- búsqueda por keyword (subcadena, case-insensitive)

El frontend y la CLI comparten el mismo almacenamiento JSON.

### Endpoints disponibles

- `GET /health`
- `POST /api/entries`
- `GET /api/entries/today`
- `GET /api/entries/recent?days=7`
- `GET /api/entries/search?keyword=texto`

## Datos

- Ruta: `~/.devlog/entries.json`
- En Windows normalmente: `C:\Users\<tu_usuario>\.devlog\entries.json`
- Retención automática: 365 días

## Testing

```bash
node --test
```
