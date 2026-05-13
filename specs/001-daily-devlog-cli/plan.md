# Implementation Plan: Daily Devlog CLI

**Branch**: `[001-daily-devlog-cli]` | **Date**: 2026-05-13 | **Spec**: [/specs/001-daily-devlog-cli/spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-daily-devlog-cli/spec.md`

## Summary

Crear una CLI en Node.js puro para registrar actividad diaria de desarrolladores con
alta de entradas, listado del día, listado de últimos N días (1..365) y búsqueda por
palabra clave (insensible a mayúsculas/minúsculas y por subcadena). Persistencia local
transparente para el usuario en `~/.devlog/entries.json`, sin dependencias externas.

## Technical Context

**Language/Version**: Node.js LTS (20+ recomendado)  
**Primary Dependencies**: Ninguna (solo módulos nativos de Node.js)  
**Storage**: Archivo JSON local en `~/.devlog/entries.json`  
**Testing**: Node test runner nativo (`node --test`)  
**Target Platform**: CLI local en macOS/Linux/Windows con Node.js instalado  
**Project Type**: CLI tool  
**Performance Goals**: Respuesta p95 < 200 ms para operaciones con hasta 10k entradas  
**Constraints**: Sin frameworks; parsing con `process.argv`; retención automática 365 días; N en rango 1..365  
**Scale/Scope**: Uso individual o equipo pequeño, volumen moderado diario

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Simplicity Gate: PASS. Arquitectura de 3 ficheros (`cli.js`, `storage.js`, `formatter.js`) con responsabilidades claras.
- Dependency Gate: PASS. Sin librerías externas.
- Storage Gate: PASS. JSON local versionable y ruta explícita `~/.devlog/entries.json`.
- CLI UX Gate: PASS. Comandos Unix-like, salida normal por stdout, errores por stderr y códigos de salida no-cero en error.
- Core Test Gate: PASS. Cobertura de core con `node --test` sobre storage, filtrado temporal y búsqueda.

## Project Structure

### Documentation (this feature)

```text
specs/001-daily-devlog-cli/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── cli-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
cli.js
storage.js
formatter.js

tests/
├── cli.test.js
├── storage.test.js
└── formatter.test.js
```

**Structure Decision**: Estructura mínima en raíz para mantener fricción baja en una
herramienta CLI pequeña. Se separa IO/almacenamiento/formato para testabilidad.

## Phase 0: Research

- Validar estrategia de persistencia JSON en ruta de usuario y creación segura de directorio.
- Definir formato de timestamp exacto y zona horaria para visualización.
- Confirmar estrategia de retención automática (aplicación en escritura y lectura).
- Definir prácticas de parsing de argumentos con `process.argv` sin dependencias.

## Phase 1: Design & Contracts

- Modelar entidad `Entry` y reglas de validación.
- Diseñar contrato CLI (`add`, `today`, `recent --days N`, `search <keyword>`).
- Diseñar flujo de errores y códigos de salida.
- Definir estrategia de pruebas unitarias y de integración ligera CLI.

## Post-Design Constitution Check

- Simplicity Gate: PASS (sin capas adicionales)
- Dependency Gate: PASS (0 dependencias)
- Storage Gate: PASS (JSON local + retención + esquema estable)
- CLI UX Gate: PASS (contrato explícito y predecible)
- Core Test Gate: PASS (casos críticos cubiertos en plan de pruebas)

## Complexity Tracking

No se requieren excepciones de complejidad frente a la constitución.
