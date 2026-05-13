<!--
Sync Impact Report
- Version change: template (unversioned) → 1.0.0
- Modified principles:
  - PRINCIPLE_1_NAME → I. Código Simple y Legible
  - PRINCIPLE_2_NAME → II. Dependencias Mínimas
  - PRINCIPLE_3_NAME → III. Persistencia Local en JSON
  - PRINCIPLE_4_NAME → IV. UX CLI Intuitiva Tipo Unix
  - PRINCIPLE_5_NAME → V. Calidad Core con Cobertura de Tests
- Added sections:
  - Restricciones Técnicas
  - Flujo de Desarrollo y Calidad
- Removed sections:
  - Ninguna
- Templates requiring updates:
  - ✅ updated - .specify/templates/plan-template.md
  - ✅ updated - .specify/templates/spec-template.md
  - ✅ updated - .specify/templates/tasks-template.md
- Follow-up TODOs:
  - Ninguno
-->

# Proyecto CLI Node.js Constitution

## Core Principles

### I. Código Simple y Legible
Todo cambio MUST priorizar claridad sobre sofisticación. El código MUST ser entendible
sin contexto implícito y con nombres explícitos. Abstracciones innecesarias,
metaprogramación y capas sin beneficio verificable MUST NOT introducirse.
Rationale: la simplicidad reduce defectos, acelera mantenimiento y facilita colaboración.

### II. Dependencias Mínimas
El proyecto MUST evitar dependencias externas innecesarias. Una dependencia nueva MUST
justificarse por valor funcional claro, coste de mantenimiento aceptable y ausencia de
alternativa razonable con Node.js estándar.
Rationale: menos dependencias reducen superficie de riesgo, deuda y fricción operativa.

### III. Persistencia Local en JSON
Los datos de la CLI MUST persistirse en archivos JSON locales bajo rutas definidas y
predecibles. Los formatos MUST ser estables y versionables para permitir migraciones
compatibles cuando cambie el esquema.
Rationale: persistencia local simple permite portabilidad, inspección manual y depuración.

### IV. UX CLI Intuitiva Tipo Unix
Los comandos MUST seguir convenciones Unix: verbos claros, flags consistentes, salida
útil por `stdout`, errores por `stderr`, y códigos de salida correctos. La ayuda MUST
ser accesible (`--help`) y cada comando MUST tener comportamiento predecible.
Rationale: una interfaz consistente reduce curva de aprendizaje y errores de uso.

### V. Calidad Core con Cobertura de Tests
La lógica core MUST estar cubierta por tests automatizados y estos MUST ejecutarse en
cada cambio relevante antes de integrar. Nuevas funciones core MUST incluir tests de
comportamiento y casos de error principales.
Rationale: la cobertura del core protege regresiones donde el impacto funcional es mayor.

## Restricciones Técnicas

- Runtime MUST ser Node.js.
- El almacenamiento primario MUST ser JSON local; bases de datos externas están fuera de
  alcance salvo enmienda explícita de esta constitución.
- Interfaces de comando MUST diseñarse para uso scriptable y humano.

## Flujo de Desarrollo y Calidad

- Cada cambio MUST mantener compatibilidad con los principios de simplicidad y
  dependencias mínimas.
- Pull requests MUST incluir evidencia de tests para cambios en lógica core.
- Cambios que alteren contratos de CLI o formato JSON MUST documentar impacto y
  estrategia de migración.

## Governance

Esta constitución prevalece sobre convenciones de implementación locales cuando exista
conflicto. Las enmiendas MUST registrarse en este archivo con justificación explícita y
actualización de versión semántica:

- MAJOR: cambios incompatibles en principios o gobernanza.
- MINOR: nuevos principios, secciones o reglas sustantivas.
- PATCH: aclaraciones editoriales sin cambio de intención normativa.

Toda revisión de planificación, especificación y tareas MUST incluir un Constitution
Check verificable. El cumplimiento MUST revisarse en PR y antes de releases.

**Version**: 1.0.0 | **Ratified**: 2026-05-13 | **Last Amended**: 2026-05-13
