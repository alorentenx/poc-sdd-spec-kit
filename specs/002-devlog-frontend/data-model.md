# Data Model: Frontend para Devlog

## Entity: DevlogEntry
- Description: Registro de actividad diaria persistido y compartido entre CLI y frontend.
- Fields:
  - `id` (string, obligatorio): Identificador único de entrada.
  - `text` (string, obligatorio): Contenido de la entrada no vacío.
  - `createdAt` (string ISO-8601 UTC, obligatorio): Momento de creación.
- Validation rules:
  - `text` debe contener al menos un carácter no-espacio.
  - `createdAt` debe ser fecha ISO válida.
  - `id` debe serializarse como string.

## Entity: EntryCollection
- Description: Documento persistido en `entries.json`.
- Fields:
  - `version` (number): Versión de esquema.
  - `entries` (array<DevlogEntry>): Lista de entradas normalizadas.
- Validation rules:
  - Si el archivo está corrupto o inválido, se recupera a estructura por defecto válida.
  - Solo se conservan entradas válidas tras normalización.

## Entity: RecentRange
- Description: Parámetro de consulta temporal para listar entradas recientes.
- Fields:
  - `days` (integer): Cantidad de días en rango inclusivo.
- Validation rules:
  - `days` debe estar entre 1 y 365 inclusive.

## Entity: SearchQuery
- Description: Texto de búsqueda para filtrar entradas.
- Fields:
  - `keyword` (string): Término de búsqueda.
- Validation rules:
  - `keyword` no puede ser vacío tras trim.
  - Coincidencia por subcadena, case-insensitive.

## Entity: ConflictError
- Description: Resultado de intento de escritura concurrente no seguro.
- Fields:
  - `code` (string): Valor canónico `WRITE_CONFLICT`.
  - `message` (string): Mensaje claro de reintento.
- Trigger condition:
  - Cambio detectado en almacenamiento entre lectura y confirmación de escritura de una operación de alta.

## Relationships
- `EntryCollection` contiene múltiples `DevlogEntry`.
- `RecentRange` y `SearchQuery` son criterios de consulta sobre `EntryCollection.entries`.
- `ConflictError` se asocia a operación de creación sobre `DevlogEntry`.

## State Transitions
- `DraftInput` -> `ValidatedInput` -> `PersistedEntry` para alta exitosa.
- `DraftInput` -> `ValidationError` cuando faltan datos o son inválidos.
- `ValidatedInput` -> `ConflictError` si se detecta colisión concurrente.
- `PersistedEntry` -> `VisibleInToday/Recent/Search` tras refresco de vistas.
