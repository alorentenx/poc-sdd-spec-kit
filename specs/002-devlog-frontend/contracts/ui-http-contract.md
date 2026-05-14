# UI/HTTP Contract: Frontend para Devlog

Base URL local: `http://localhost:3000`
Content-Type API: `application/json`

## 1) Health
- Method: `GET`
- Path: `/health`
- Response 200:
```json
{ "status": "ok" }
```

## 2) Crear entrada
- Method: `POST`
- Path: `/api/entries`
- Request body:
```json
{ "text": "Hoy cerré el bug de filtros" }
```
- Success 201:
```json
{
  "entry": {
    "id": "string",
    "text": "Hoy cerré el bug de filtros",
    "createdAt": "2026-05-14T10:15:30.000Z"
  }
}
```
- Validation error 400:
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "text cannot be empty" } }
```
- Conflict error 409:
```json
{ "error": { "code": "WRITE_CONFLICT", "message": "Conflicto de escritura detectado. Reintenta." } }
```

## 3) Listar entradas de hoy
- Method: `GET`
- Path: `/api/entries/today`
- Success 200:
```json
{ "entries": [ { "id": "string", "text": "...", "createdAt": "..." } ] }
```

## 4) Listar entradas recientes
- Method: `GET`
- Path: `/api/entries/recent?days=<1..365>`
- Success 200:
```json
{ "entries": [ { "id": "string", "text": "...", "createdAt": "..." } ] }
```
- Validation error 400:
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "days must be an integer between 1 and 365" } }
```

## 5) Buscar entradas
- Method: `GET`
- Path: `/api/entries/search?keyword=<text>`
- Success 200:
```json
{ "entries": [ { "id": "string", "text": "...", "createdAt": "..." } ] }
```
- Validation error 400:
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "keyword cannot be empty" } }
```

## 6) Frontend estático
- Method: `GET`
- Path: `/`
- Behavior: entrega `frontend/index.html`.

## Error envelope (canónico)
```json
{
  "error": {
    "code": "UPPER_SNAKE_CASE",
    "message": "Mensaje claro para usuario"
  }
}
```

## UX states obligatorios
- Loading durante llamadas API.
- Empty state cuando `entries` es vacío.
- Success feedback tras crear entrada.
- Error feedback para `VALIDATION_ERROR` y `WRITE_CONFLICT` con acción de reintento.
