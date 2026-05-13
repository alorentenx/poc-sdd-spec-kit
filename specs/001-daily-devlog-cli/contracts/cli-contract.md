# CLI Contract: Daily Devlog CLI

## Command Surface

## `devlog add <text...>`
- Purpose: crear una entrada con timestamp exacto.
- Input: texto libre no vacío.
- Output (stdout): confirmación con id y timestamp.
- Errors (stderr): texto vacío o fallo de escritura.
- Exit codes: `0` éxito, `1` error de validación/IO.

## `devlog today`
- Purpose: listar entradas del día local actual.
- Output (stdout): lista ordenada descendente por fecha/hora.
- Empty: mensaje explícito "No hay entradas para hoy".
- Exit codes: `0` éxito, `1` error de lectura.

## `devlog recent --days <N>`
- Purpose: listar entradas de últimos N días.
- Input: `N` entero en rango `1..365`.
- Output (stdout): lista ordenada descendente por fecha/hora.
- Errors (stderr): N faltante/no numérico/fuera de rango.
- Exit codes: `0` éxito, `1` error de validación/IO.

## `devlog search <keyword>`
- Purpose: buscar entradas por subcadena, case-insensitive.
- Input: `keyword` no vacía.
- Output (stdout): entradas coincidentes ordenadas por fecha descendente.
- Empty: mensaje explícito "No se encontraron coincidencias".
- Exit codes: `0` éxito, `1` error de validación/IO.

## `devlog --help`
- Purpose: mostrar uso resumido y ejemplos.
- Exit codes: `0`.

## Formatting Rules

- stdout reservado para resultados funcionales.
- stderr reservado para errores.
- Mensajes de error deben indicar acción correctiva.
