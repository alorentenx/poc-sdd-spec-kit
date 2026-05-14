# Implementation Plan: Frontend para Devlog

**Branch**: `[002-devlog-frontend]` | **Date**: 2026-05-14 | **Spec**: [/specs/002-devlog-frontend/spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-devlog-frontend/spec.md`

## Summary

Agregar una interfaz web local para la herramienta Devlog existente, manteniendo la CLI actual y el mismo almacenamiento JSON compartido. El frontend v1 cubre alta de entradas, listado de hoy, listado reciente (1..365) y búsqueda por keyword, con manejo explícito de conflictos de escritura concurrente mediante rechazo y reintento.

## Technical Context

**Language/Version**: Node.js LTS (20+ recomendado), JavaScript (CommonJS)  
**Primary Dependencies**: Ninguna externa; `http`, `fs/promises`, `path`, `os`, `crypto` nativos  
**Storage**: Archivo JSON local en `~/.devlog/entries.json` (esquema versionado)  
**Testing**: Node test runner nativo (`node --test`) con unit + integración HTTP básica  
**Target Platform**: Navegador moderno en máquina local + Node.js local (Windows/macOS/Linux)  
**Project Type**: Aplicación web local full-stack mínima (servidor Node + frontend estático)  
**Performance Goals**: p95 < 2s en listado/búsqueda con hasta 10k entradas locales; alta < 1s p95  
**Constraints**: Sin frameworks ni librerías externas, sin autenticación (usuario local único), v1 sin editar/eliminar, rango reciente 1..365, coexistencia CLI+frontend  
**Scale/Scope**: Uso individual local; volumen moderado diario; una sola instancia local del servicio web

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Simplicity Gate: PASS. Se propone servidor HTTP mínimo + frontend estático simple, reutilizando `storage.js`.
- Dependency Gate: PASS. No se agregan dependencias de terceros.
- Storage Gate: PASS. Se conserva JSON local y esquema actual con compatibilidad.
- CLI UX Gate: PASS. La CLI no cambia contrato; convivencia sin ruptura.
- Core Test Gate: PASS. Se amplía cobertura para contrato HTTP y conflictos concurrentes.

## Project Structure

### Documentation (this feature)

```text
specs/002-devlog-frontend/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-http-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
cli.js
storage.js
formatter.js
server.js

frontend/
├── index.html
├── styles.css
└── app.js

tests/
├── cli.test.js
├── storage.test.js
├── formatter.test.js
├── server.test.js
└── frontend.smoke.test.js
```

**Structure Decision**: Se mantiene la base CLI en raíz y se añade `server.js` más carpeta `frontend/` para separar UI sin introducir build system. Esta estructura minimiza cambios, conserva legibilidad y facilita test incremental.

## Phase 0: Research

- Confirmar estrategia de servidor HTTP nativo para servir frontend y exponer operaciones de devlog.
- Definir patrón de control de concurrencia de escritura para coexistencia CLI+frontend sin pérdidas.
- Establecer validaciones y semántica de errores para respuestas de API local.
- Definir pruebas mínimas para flujos web y regresión de funcionalidades existentes.

## Phase 1: Design & Contracts

- Modelar entidades compartidas entre storage y contrato HTTP/UI.
- Diseñar contrato de endpoints locales para `add`, `today`, `recent`, `search`.
- Diseñar comportamientos de estados UI: loading, empty, validation error, conflict error.
- Definir quickstart para ejecución local y validación manual.

## Post-Design Constitution Check

- Simplicity Gate: PASS. Arquitectura con piezas mínimas (`server.js` + `frontend/`) sin capas adicionales.
- Dependency Gate: PASS. 0 dependencias externas.
- Storage Gate: PASS. Misma fuente de verdad `~/.devlog/entries.json` y mismas reglas de retención/normalización.
- CLI UX Gate: PASS. Comandos CLI siguen intactos y scriptables.
- Core Test Gate: PASS. Se planifican tests para API local, validaciones y conflicto concurrente.

## Complexity Tracking

No se requieren excepciones a la constitución.
