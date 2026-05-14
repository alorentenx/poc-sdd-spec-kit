# Tasks: Frontend para Devlog

**Input**: Design documents from `/specs/002-devlog-frontend/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests de lógica core y contrato HTTP incluidos por constitución.

**Organization**: Tasks agrupadas por user story para implementación y prueba independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencia directa)
- **[Story]**: User story objetivo (`[US1]`, `[US2]`, `[US3]`)
- Todas las tareas incluyen rutas concretas

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Crear estructura base para servidor web local + frontend estático

- [X] T001 Crear estructura inicial `frontend/` y placeholders base en `frontend/index.html`, `frontend/styles.css`, `frontend/app.js`
- [X] T002 Crear servidor HTTP base con ruteo mínimo en `server.js`
- [X] T003 [P] Añadir script de arranque y ayuda de uso web en `README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura común bloqueante para todas las historias

**⚠️ CRITICAL**: Ninguna user story empieza antes de terminar esta fase

- [X] T004 Implementar utilidades HTTP compartidas (parse JSON, respuesta JSON, errores canónicos) en `server.js`
- [X] T005 [P] Extraer/añadir función compartida para envelope de errores (`VALIDATION_ERROR`, `WRITE_CONFLICT`) en `server.js`
- [X] T006 Implementar servicio de archivos estáticos para `/` y assets de `frontend/` en `server.js`
- [X] T007 [P] Añadir detección de conflicto de escritura concurrente en `storage.js`
- [X] T008 Añadir tests fundacionales de servidor (health + estáticos + envelope de error) en `tests/server.test.js`

**Checkpoint**: Base HTTP + estáticos + manejo de errores/conflicto listos

---

## Phase 3: User Story 1 - Registrar entrada desde interfaz visual (Priority: P1) 🎯 MVP

**Goal**: Permitir crear una entrada desde UI con feedback de éxito/error

**Independent Test**: Desde navegador local, crear entrada válida y verla reflejada; envío inválido muestra error sin persistir

### Tests for User Story 1

- [X] T009 [P] [US1] Añadir test de contrato `POST /api/entries` (201, 400, 409) en `tests/server.test.js`
- [X] T010 [P] [US1] Añadir test de integración de detección de conflicto en alta en `tests/storage.test.js`

### Implementation for User Story 1

- [X] T011 [US1] Implementar endpoint `POST /api/entries` con validación y mapeo de errores en `server.js`
- [X] T012 [P] [US1] Implementar formulario de alta y submit async en `frontend/index.html` y `frontend/app.js`
- [X] T013 [P] [US1] Implementar estilos de feedback (success/error/loading) en `frontend/styles.css`
- [X] T014 [US1] Integrar refresco de vista tras alta exitosa en `frontend/app.js`

**Checkpoint**: US1 funcional y testeable de forma independiente

---

## Phase 4: User Story 2 - Ver entradas recientes desde interfaz visual (Priority: P2)

**Goal**: Mostrar entradas de hoy y recientes (1..365) con estados vacíos y validación de rango

**Independent Test**: Consultar hoy y recientes (ej. 7 días) y verificar que el filtrado y mensajes vacíos funcionan sin usar búsqueda

### Tests for User Story 2

- [X] T015 [P] [US2] Añadir test de contrato `GET /api/entries/today` y `GET /api/entries/recent` en `tests/server.test.js`
- [X] T016 [P] [US2] Añadir test de validación de rango `days` (400) en `tests/server.test.js`

### Implementation for User Story 2

- [X] T017 [US2] Implementar endpoints `GET /api/entries/today` y `GET /api/entries/recent` en `server.js`
- [X] T018 [P] [US2] Implementar UI de listado hoy/recientes y selector de días en `frontend/index.html`
- [X] T019 [US2] Implementar carga de listados, render de entradas y estado vacío en `frontend/app.js`
- [X] T020 [P] [US2] Implementar estilos de tabla/listado y estado vacío en `frontend/styles.css`

**Checkpoint**: US1 y US2 operativos y probables por separado

---

## Phase 5: User Story 3 - Buscar entradas por palabra clave (Priority: P3)

**Goal**: Buscar entradas por subcadena case-insensitive desde UI

**Independent Test**: Introducir keyword y validar coincidencias correctas; sin resultados debe mostrar estado vacío claro

### Tests for User Story 3

- [X] T021 [P] [US3] Añadir test de contrato `GET /api/entries/search` (200, 400) en `tests/server.test.js`
- [X] T022 [P] [US3] Añadir test de búsqueda case-insensitive por subcadena en `tests/storage.test.js`

### Implementation for User Story 3

- [X] T023 [US3] Implementar endpoint `GET /api/entries/search` con validación de `keyword` en `server.js`
- [X] T024 [P] [US3] Implementar UI de búsqueda y acción de submit en `frontend/index.html` y `frontend/app.js`
- [X] T025 [US3] Implementar render de resultados de búsqueda y estado vacío en `frontend/app.js`

**Checkpoint**: US1, US2 y US3 funcionales e independientes

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Endurecer calidad global y cerrar documentación

- [X] T026 [P] Añadir smoke test de carga de frontend (respuesta `/` y assets) en `tests/frontend.smoke.test.js`
- [X] T027 Ejecutar suite completa y ajustar regresiones en `tests/server.test.js`, `tests/storage.test.js`, `tests/cli.test.js`
- [X] T028 Actualizar guía final de uso y validación en `specs/002-devlog-frontend/quickstart.md` y `README.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: sin dependencias
- **Phase 2 (Foundational)**: depende de Phase 1; bloquea historias
- **Phase 3 (US1)**: depende de Phase 2
- **Phase 4 (US2)**: depende de Phase 2; recomendado después de US1 por reaprovechar render común
- **Phase 5 (US3)**: depende de Phase 2; puede ir tras US2 para reutilizar contenedor de resultados
- **Phase 6 (Polish)**: depende de historias objetivo completadas

### User Story Dependencies

- **US1 (P1)**: independiente tras fundación
- **US2 (P2)**: independiente tras fundación; reutiliza componentes de render
- **US3 (P3)**: independiente tras fundación; reutiliza infraestructura de API/UI

### Parallel Opportunities

- Setup: `T003` paralelo a `T001-T002`
- Foundational: `T005` y `T007` paralelizables respecto a otras tareas de fase
- US1: `T009`, `T010`, `T012`, `T013` en paralelo
- US2: `T015`, `T016`, `T018`, `T020` en paralelo
- US3: `T021`, `T022`, `T024` en paralelo
- Polish: `T026` paralelo con estabilización de tests

---

## Parallel Example: User Story 1

```bash
# Tests en paralelo
Task: "T009 [US1] tests/server.test.js"
Task: "T010 [US1] tests/storage.test.js"

# UI en paralelo
Task: "T012 [US1] frontend/index.html + frontend/app.js"
Task: "T013 [US1] frontend/styles.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1
2. Completar Phase 2
3. Completar Phase 3 (US1)
4. Validar US1 de forma independiente
5. Demostrar MVP

### Incremental Delivery

1. Setup + Foundational
2. US1 (alta visual)
3. US2 (listados)
4. US3 (búsqueda)
5. Polish final

### Parallel Team Strategy

1. Todo el equipo cierra Setup + Foundational
2. Luego reparto por historias:
   - Dev A: US1
   - Dev B: US2
   - Dev C: US3

---

## Notes

- Todas las tareas cumplen formato checklist requerido
- IDs secuenciales `T001`..`T028`
- Labels `[US1]`, `[US2]`, `[US3]` solo en fases de historia
- Tareas `[P]` marcadas únicamente cuando no hay dependencia inmediata de archivo/flujo
