# Data Model: Daily Devlog CLI

## Entity: Entry

- id: string (UUID-like o hash único)
- text: string (1..5000 caracteres, trim obligatorio, no vacío)
- createdAt: string (ISO 8601 UTC)

## Derived Fields (runtime)

- localDate: string (`YYYY-MM-DD` en zona local, derivado de `createdAt` para filtro `today`)

## Validation Rules

- `text` MUST contener al menos 1 carácter no-espacio.
- `createdAt` MUST ser ISO 8601 válido.
- `id` MUST ser único dentro del archivo.

## Collection Shape

```json
{
  "version": 1,
  "entries": [
    {
      "id": "e_20260513_0001",
      "text": "Implementé parser CLI",
      "createdAt": "2026-05-13T08:42:10.000Z"
    }
  ]
}
```

## Lifecycle

1. Create: `add` valida texto, aplica retención, inserta nueva entrada.
2. Read: `today`, `recent`, `search` cargan datos actuales y aplican filtros.
3. Retention cleanup: entradas con antigüedad >365 días se eliminan automáticamente.

## Query Rules

- today: incluye solo entradas con fecha local de hoy.
- recent N: incluye entradas en ventana [hoy-N+1, hoy]. N entero 1..365.
- search keyword: coincidencia por subcadena case-insensitive sobre `text`.
