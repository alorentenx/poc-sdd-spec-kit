# Research: Daily Devlog CLI

## Decision 1: Persistencia en archivo único JSON por usuario
- Decision: Guardar entradas en `~/.devlog/entries.json` y crear `~/.devlog/` si no existe.
- Rationale: Ruta estable, privada por usuario, sencilla de inspeccionar y respaldar.
- Alternatives considered: Base de datos embebida (rechazada por complejidad y dependencia).

## Decision 2: Timestamp exacto en formato ISO 8601
- Decision: Guardar `createdAt` en UTC ISO 8601 (`new Date().toISOString()`).
- Rationale: Formato estándar, ordenable lexicográficamente y sin ambigüedad regional.
- Alternatives considered: Timestamp local (rechazado por ambigüedad entre entornos).

## Decision 3: Retención automática de 365 días
- Decision: Aplicar purga de entradas >365 días al crear entrada y antes de listar/buscar.
- Rationale: Evita crecimiento no acotado y mantiene rendimiento constante.
- Alternatives considered: Retención infinita (rechazada por riesgo de crecimiento indefinido).

## Decision 4: Parsing de argumentos con `process.argv`
- Decision: Implementar parser manual minimalista para comandos y flags.
- Rationale: Cumple restricción de cero dependencias y mantiene control explícito.
- Alternatives considered: Librerías tipo commander/yargs (rechazadas por constitución).

## Decision 5: Búsqueda textual insensible a mayúsculas por subcadena
- Decision: Normalizar a lowercase y usar inclusión por subcadena.
- Rationale: Esperable por usuario y robusto para recuperar notas parciales.
- Alternatives considered: Coincidencia exacta (rechazada por menor usabilidad).

## Decision 6: Estrategia de pruebas core con Node test runner
- Decision: Tests para storage, filtrado temporal, retención, validaciones y formato básico.
- Rationale: Cubre lógica crítica sin herramientas externas.
- Alternatives considered: Frameworks de test externos (rechazados por constitución).
