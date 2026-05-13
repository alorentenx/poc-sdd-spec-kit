# Tasks: Daily Devlog CLI

**Input**: Design documents from `/specs/001-daily-devlog-cli/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests for core logic are REQUIRED by constitution and MUST be included whenever a story modifies core behavior.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project files at repository root: `cli.js`, `storage.js`, `formatter.js`
- Tests in `tests/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and baseline tooling

- [ ] T001 Create `tests/` directory and initial test file placeholders in tests/cli.test.js, tests/storage.test.js, tests/formatter.test.js
- [ ] T002 Create `package.json` scripts for `test` and `start` in package.json
- [ ] T003 Create `README.md` usage baseline aligned with contracts in README.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Implement shared CLI argument parser and command router skeleton in cli.js
- [ ] T005 [P] Implement storage path resolution and data-file bootstrap (`~/.devlog/entries.json`) in storage.js
- [ ] T006 [P] Implement JSON schema load/save helpers (`version`, `entries`) in storage.js
- [ ] T007 [P] Implement shared output format helpers for success, empty states, and errors in formatter.js
- [ ] T008 Implement shared validation utilities for text, keyword, and days range (1..365) in cli.js
- [ ] T009 Implement global error handling and non-zero exit mapping in cli.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Registrar una entrada rápida (Priority: P1) 🎯 MVP

**Goal**: Permitir crear una entrada con texto libre y timestamp exacto

**Independent Test**: Ejecutar `node cli.js add "texto"` y verificar que la entrada se guarda con `createdAt` ISO y se puede recuperar posteriormente.

### Tests for User Story 1 (REQUIRED when core logic is affected) ⚠️

- [ ] T010 [P] [US1] Add unit tests for entry validation and timestamp generation in tests/storage.test.js
- [ ] T011 [P] [US1] Add CLI integration tests for `add` success/error flows in tests/cli.test.js

### Implementation for User Story 1

- [ ] T012 [US1] Implement `createEntry(text)` with `id`, `text`, `createdAt` in storage.js
- [ ] T013 [US1] Implement retention cleanup (>365 days) during write operations in storage.js
- [ ] T014 [US1] Implement `add` command flow and argument capture in cli.js
- [ ] T015 [US1] Implement add confirmation output formatting in formatter.js
- [ ] T016 [US1] Handle empty/blank text error path for `add` in cli.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Revisar actividad reciente (Priority: P2)

**Goal**: Listar entradas de hoy y de últimos N días con validación de rango

**Independent Test**: Con entradas en fechas distintas, `today` muestra solo hoy y `recent --days N` muestra solo la ventana esperada.

### Tests for User Story 2 (REQUIRED when core logic is affected) ⚠️

- [ ] T017 [P] [US2] Add unit tests for date-window filtering (`today`, `recent`) in tests/storage.test.js
- [ ] T018 [P] [US2] Add CLI integration tests for `today` and `recent --days N` including invalid N in tests/cli.test.js

### Implementation for User Story 2

- [ ] T019 [US2] Implement `listToday()` with local-date filtering in storage.js
- [ ] T020 [US2] Implement `listRecent(days)` with range validation 1..365 in storage.js
- [ ] T021 [US2] Implement `today` and `recent --days` command handlers in cli.js
- [ ] T022 [US2] Implement list rendering for grouped/ordered entries in formatter.js
- [ ] T023 [US2] Implement empty-state messages for `today` and `recent` in formatter.js

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Buscar por palabra clave (Priority: P3)

**Goal**: Buscar entradas por subcadena case-insensitive

**Independent Test**: Con entradas con variaciones de mayúsculas/minúsculas, `search <keyword>` devuelve coincidencias correctas por subcadena.

### Tests for User Story 3 (REQUIRED when core logic is affected) ⚠️

- [ ] T024 [P] [US3] Add unit tests for case-insensitive substring search in tests/storage.test.js
- [ ] T025 [P] [US3] Add CLI integration tests for `search` results/no-results/error in tests/cli.test.js

### Implementation for User Story 3

- [ ] T026 [US3] Implement `searchEntries(keyword)` by case-insensitive substring in storage.js
- [ ] T027 [US3] Implement `search` command handler and keyword validation in cli.js
- [ ] T028 [US3] Implement search result and no-match formatting in formatter.js

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T029 [P] Add formatter-focused unit tests for output consistency in tests/formatter.test.js
- [ ] T030 Update quickstart and command examples to match final behavior in specs/001-daily-devlog-cli/quickstart.md
- [ ] T031 Run full test suite and fix residual defects in tests/cli.test.js, tests/storage.test.js, tests/formatter.test.js
- [ ] T032 Add/adjust help text and usage docs for all commands in cli.js and README.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Suggested delivery order: US1 (P1) → US2 (P2) → US3 (P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational completion - no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational completion - uses entries created in US1 for validation scenarios
- **User Story 3 (P3)**: Starts after Foundational completion - relies on shared entry model and list ordering behavior

### Within Each User Story

- Tests for core logic MUST be written and fail before implementation
- Storage behavior before CLI command wiring
- Formatter finalization after storage/command behavior stabilizes

### Parallel Opportunities

- T005, T006, T007 can run in parallel in Foundational phase
- T010 and T011 can run in parallel for US1
- T017 and T018 can run in parallel for US2
- T024 and T025 can run in parallel for US3
- T029 and T030 can run in parallel in Polish phase

---

## Parallel Example: User Story 2

```bash
# Launch US2 tests in parallel:
Task: "T017 [US2] Add unit tests for date-window filtering in tests/storage.test.js"
Task: "T018 [US2] Add CLI integration tests for today/recent flows in tests/cli.test.js"

# Launch US2 implementation slices in parallel once tests exist:
Task: "T019 [US2] Implement listToday() in storage.js"
Task: "T022 [US2] Implement list rendering in formatter.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate add flow end-to-end and persistence in `~/.devlog/entries.json`

### Incremental Delivery

1. Deliver US1 (`add`) as MVP
2. Add US2 (`today`, `recent --days N`) and validate date-window behavior
3. Add US3 (`search`) and validate case-insensitive substring matching
4. Final polish, docs, and full regression tests

### Suggested MVP Scope

- Tasks T001-T016 (through US1 checkpoint)

---

## Notes

- Every task follows required checklist format with task ID and file path
- [P] markers indicate tasks that can execute in parallel safely
- Story labels are applied only to user story phase tasks
