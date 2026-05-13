# README Tutorial: Onboarding de DevLog CLI (Spec Kit + Codex)

Este documento es una guía paso a paso para que cualquier persona del equipo pueda
arrancar desde cero con este proyecto, entender el flujo de trabajo de Spec Kit y
ejecutar la CLI localmente.

## 1) ¿Qué es este proyecto?

**DevLog CLI** es una herramienta de línea de comandos en Node.js para registrar
actividad diaria de desarrollo.

Permite:
- añadir entradas con texto libre y timestamp exacto
- listar entradas de hoy
- listar entradas de los últimos N días (1..365)
- buscar por palabra clave (insensible a mayúsculas/minúsculas y por subcadena)

Datos:
- se guardan localmente en `~/.devlog/entries.json`
- retención automática de 365 días

## 2) Requisitos previos

Instala:
- Node.js 20+
- npm
- Codex CLI
- Spec Kit CLI (si no lo tienes en tu entorno)

Verificación rápida:

```bash
node -v
npm -v
codex --version
```

Instalar Codex CLI:

```bash
npm install -g @openai/codex
```

## 3) Clonar/abrir proyecto

```bash
cd C:\Users\alorente\proyectos\tests_01\spec-driven-development\devlog
```

## 4) Flujo de Spec Kit (visión general)

El flujo recomendado:

1. `constitution` -> define reglas del proyecto
2. `specify` -> define QUÉ se construye
3. `clarify` -> elimina ambigüedades
4. `plan` -> define CÓMO se construye
5. `tasks` -> descompone en tareas ejecutables
6. `implement` -> implementa y valida

En Codex, los comandos se lanzan con prefijo **`$speckit-`**.

## 5) Flujo paso a paso (como se aplicó en esta POC)

### Paso 1: Constitución

```text
$speckit-constitution Proyecto CLI en Node.js. Principios: código simple y legible, sin dependencias externas innecesarias, datos guardados en JSON local, comandos intuitivos tipo Unix, cobertura de tests en funciones core.
```

Salida clave:
- `.specify/memory/constitution.md`

### Paso 2: Especificación funcional

```text
$speckit-specify Quiero una herramienta de línea de comandos para que un desarrollador pueda registrar lo que hizo durante el día... 
```

Salida clave:
- `specs/001-daily-devlog-cli/spec.md`
- `specs/001-daily-devlog-cli/checklists/requirements.md`

### Paso 3: Clarificaciones

```text
$speckit-clarify
```

Se resolvieron decisiones importantes:
- retención 365 días
- búsqueda case-insensitive
- rango N: 1..365
- búsqueda por subcadena

### Paso 4: Plan técnico

```text
$speckit-plan Node.js puro sin frameworks, datos en JSON en ~/.devlog/entries.json, CLI con process.argv (sin librerías externas), tests con Node test runner nativo. Tres ficheros: cli.js, storage.js, formatter.js.
```

Salida clave:
- `specs/001-daily-devlog-cli/plan.md`
- `research.md`, `data-model.md`, `contracts/cli-contract.md`, `quickstart.md`

### Paso 5: Tareas

```text
$speckit-tasks
```

Salida clave:
- `specs/001-daily-devlog-cli/tasks.md`

### Paso 6: Implementación

```text
$speckit-implement
```

Resultado implementado:
- `cli.js`
- `storage.js`
- `formatter.js`
- `tests/*.test.js`

## 6) Estructura actual del repositorio

```text
devlog/
├── cli.js
├── storage.js
├── formatter.js
├── tests/
│   ├── cli.test.js
│   ├── storage.test.js
│   └── formatter.test.js
├── specs/001-daily-devlog-cli/
│   ├── spec.md
│   ├── plan.md
│   ├── tasks.md
│   ├── research.md
│   ├── data-model.md
│   ├── contracts/cli-contract.md
│   └── quickstart.md
├── .specify/
├── .agents/
├── AGENTS.md
├── README.md
└── README-TUTORIAL.md
```

## 7) Cómo ejecutar la CLI

Desde raíz del proyecto:

```bash
node cli.js --help

node cli.js add "Implementé parser"
node cli.js add "Arreglé bug de búsqueda"

node cli.js today
node cli.js recent --days 7
node cli.js search parser
node cli.js search BUG
```

## 8) Cómo ejecutar tests

```bash
node --test
```

Esperado:
- todos los tests en verde

## 9) Comportamientos esperados (validaciones)

- `add "   "` -> error por texto vacío
- `recent --days 0` -> error, fuera de rango
- `recent --days 366` -> error, fuera de rango
- `search ""` -> error por keyword vacía
- `search BUG` encuentra entradas con `bug`, `Bug`, `BUG`, etc.

## 10) Ubicación de datos

- Ruta estándar: `~/.devlog/entries.json`
- En Windows normalmente: `C:\Users\<tu_usuario>\.devlog\entries.json`

## 11) Flujo Git recomendado

1. Trabajar en rama de feature (ej. `001-daily-devlog-cli`)
2. Commit + push de cambios
3. Abrir PR hacia rama base (`main` o `master` según repo)
4. Merge cuando checks estén en verde

## 12) Troubleshooting

### "Not on a feature branch"
Cámbiate a una rama tipo `001-nombre-feature`:

```bash
git checkout -b 002-nueva-feature
```

### `spawn EPERM` al correr `node --test`
Puede ser restricción del entorno/sandbox. Ejecuta tests en terminal local normal.

### No aparece `main` para default branch
Primero créala y publícala:

```bash
git checkout master
git branch -m main
git push -u origin main
```

Luego en GitHub: `Settings > General > Default branch`.

---

Si te incorporas al proyecto, empieza por:
1. Leer `README.md` (resumen)
2. Leer este `README-TUTORIAL.md` (detalle)
3. Revisar `specs/001-daily-devlog-cli/spec.md` y `tasks.md`
4. Ejecutar `node --test` y comandos manuales
