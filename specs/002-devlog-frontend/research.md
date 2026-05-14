# Research: Frontend para Devlog

## Decision 1: Backend web local con `http` nativo de Node.js
- Decision: Implementar un servidor HTTP local en `server.js` usando solo módulos nativos.
- Rationale: Mantiene cumplimiento de constitución (dependencias mínimas), reduce superficie de fallo y evita complejidad de frameworks.
- Alternatives considered:
  - Express: descartado por dependencia externa y sobrecarga para alcance v1.
  - Framework full-stack: descartado por complejidad y necesidad de toolchain/build.

## Decision 2: Frontend estático sin build step
- Decision: Crear `frontend/index.html`, `frontend/styles.css` y `frontend/app.js` servidos como archivos estáticos.
- Rationale: Iteración rápida, depuración simple y cero dependencias.
- Alternatives considered:
  - SPA con bundler: descartado por no aportar valor al alcance actual.
  - Renderizado server-side con templates: descartado por acoplar presentación y transporte innecesariamente.

## Decision 3: Contrato HTTP JSON para operaciones core
- Decision: Exponer endpoints locales JSON para crear entrada y consultar (`today`, `recent`, `search`).
- Rationale: Contrato claro y testeable; desacopla UI de lógica de dominio reutilizando `storage.js`.
- Alternatives considered:
  - Invocar CLI desde frontend: descartado por fragilidad y peor manejo de errores.
  - Acceso directo del frontend a archivo local: descartado por restricciones de navegador y seguridad.

## Decision 4: Resolución de conflictos concurrentes por rechazo + reintento
- Decision: Si detecta escritura concurrente conflictiva, rechazar operación con error de conflicto y pedir reintento.
- Rationale: Evita pérdida silenciosa y respeta la aclaración acordada en spec.
- Alternatives considered:
  - Last-write-wins: descartado por riesgo de sobrescritura silenciosa.
  - Locking global prolongado: descartado por posible bloqueo innecesario y mayor complejidad.

## Decision 5: Pruebas mínimas para proteger core y contrato
- Decision: Añadir tests de servidor (rutas, validaciones, conflictos) y smoke test del frontend, manteniendo tests actuales CLI/storage.
- Rationale: Cubre riesgo principal de regresión al introducir nuevo canal de acceso.
- Alternatives considered:
  - Solo tests manuales: descartado por baja repetibilidad.
  - E2E browser completo: diferido por coste/beneficio en v1.
