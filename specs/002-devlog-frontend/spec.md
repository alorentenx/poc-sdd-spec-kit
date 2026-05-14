# Feature Specification: Frontend para Devlog

**Feature Branch**: `[002-devlog-frontend]`  
**Created**: 2026-05-14  
**Status**: Draft  
**Input**: User description: "quiero que mi herramienta tenga un frontend"

## Clarifications

### Session 2026-05-14

- Q: ¿Cómo debe resolverse una colisión de escritura entre CLI y frontend? → A: Detectar conflicto y pedir reintento al usuario con mensaje claro.
- Q: ¿Qué modelo de acceso aplica en esta fase? → A: Sin autenticación, uso local de un único usuario.
- Q: ¿Qué alcance funcional entra en v1? → A: Solo crear, listar y buscar (sin editar/eliminar).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar entrada desde interfaz visual (Priority: P1)

Como desarrollador local, quiero registrar una entrada diaria desde una interfaz gráfica simple para no depender de comandos de terminal.

**Why this priority**: Es el valor principal del frontend: permitir la tarea core (alta de entradas) con menor fricción.

**Independent Test**: Puede probarse de forma aislada creando una entrada desde la interfaz y verificando que queda guardada y visible inmediatamente.

**Acceptance Scenarios**:

1. **Given** un usuario con acceso al frontend, **When** completa el formulario de nueva entrada y confirma, **Then** la entrada se guarda y aparece en el listado del día.
2. **Given** un formulario con campos obligatorios vacíos, **When** el usuario intenta guardar, **Then** el sistema muestra mensajes claros y no crea la entrada.

---

### User Story 2 - Ver entradas recientes desde interfaz visual (Priority: P2)

Como desarrollador, quiero ver las entradas del día y de los últimos días en una pantalla para revisar rápidamente mi actividad.

**Why this priority**: Mantiene el segundo flujo más usado del producto actual (consulta de historial) en el nuevo canal visual.

**Independent Test**: Puede probarse mostrando entradas del día y de un rango reciente sin depender de otras funcionalidades adicionales.

**Acceptance Scenarios**:

1. **Given** que existen entradas guardadas, **When** el usuario abre la vista de hoy, **Then** se muestran solo las entradas correspondientes al día actual.
2. **Given** que existen entradas de varios días, **When** el usuario selecciona ver los últimos N días (1..365), **Then** se muestran únicamente entradas dentro de ese rango.

---

### User Story 3 - Buscar entradas por palabra clave (Priority: P3)

Como desarrollador, quiero buscar entradas por palabra clave desde la interfaz para localizar trabajo previo sin recorrer todo el historial.

**Why this priority**: Replica una capacidad existente valiosa, pero no bloquea el MVP del frontend.

**Independent Test**: Puede probarse ejecutando búsquedas con distintas mayúsculas/minúsculas y verificando coincidencias por subcadena.

**Acceptance Scenarios**:

1. **Given** un conjunto de entradas con distintos textos, **When** el usuario busca una palabra clave, **Then** se muestran coincidencias por subcadena sin distinguir mayúsculas y minúsculas.
2. **Given** una búsqueda sin resultados, **When** el usuario ejecuta la consulta, **Then** se muestra un estado vacío claro sin errores.

---

### Edge Cases

- Intento de crear una entrada duplicando el envío rápidamente (doble clic): el sistema debe evitar crear duplicados accidentales.
- Persistencia temporalmente no disponible: el sistema debe mostrar error comprensible y permitir reintentar.
- Entrada con texto muy largo: el sistema debe aceptarla dentro de límites razonables y mantener legibilidad en listado.
- Rango reciente fuera de 1..365: el sistema debe validar y guiar al usuario para seleccionar un valor válido.
- Si CLI y frontend intentan escribir al mismo tiempo sobre el mismo conjunto de datos, el sistema debe detectar conflicto y solicitar reintento con mensaje claro.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST ofrecer una interfaz gráfica para registrar nuevas entradas de devlog.
- **FR-002**: El sistema MUST validar datos obligatorios antes de guardar una entrada y mostrar errores comprensibles en la interfaz.
- **FR-003**: Los usuarios MUST poder visualizar entradas del día actual en una vista dedicada.
- **FR-004**: Los usuarios MUST poder visualizar entradas de los últimos N días, donde N está en el rango 1..365.
- **FR-005**: Los usuarios MUST poder buscar entradas por palabra clave con coincidencia por subcadena e insensible a mayúsculas/minúsculas.
- **FR-006**: El sistema MUST confirmar visualmente cuándo una acción se completa con éxito (crear, filtrar, buscar).
- **FR-007**: El sistema MUST mostrar estados vacíos y errores de forma clara, accionable y no técnica.
- **FR-008**: El sistema MUST mantener consistencia entre frontend y datos persistidos, de modo que los cambios aparezcan reflejados tras cada operación.
- **FR-009**: El sistema MUST permitir usar la CLI existente y el frontend sobre el mismo conjunto de datos sin pérdida de información.
- **FR-010**: Ante conflicto de escritura concurrente entre CLI y frontend, el sistema MUST rechazar la operación en conflicto, informar claramente al usuario y permitir reintento seguro.
- **FR-011**: En esta fase, el sistema MUST operar sin autenticación y asumir uso local de un único usuario.
- **FR-012**: El alcance funcional de v1 MUST limitarse a crear, listar y buscar entradas; editar y eliminar quedan fuera de alcance.

### Key Entities *(include if feature involves data)*

- **Devlog Entry**: Registro de actividad diaria con fecha/hora, contenido textual y metadatos mínimos de identificación.
- **Search Query**: Texto introducido por el usuario para filtrar entradas por coincidencia parcial e insensible a mayúsculas/minúsculas.
- **Recent Range**: Parámetro de rango temporal (N días) usado para limitar resultados recientes dentro de 1..365.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Al menos 90% de usuarios objetivo completa el alta de una entrada desde el frontend en menos de 60 segundos en su primer intento.
- **SC-002**: En pruebas de aceptación, 95% de operaciones de listado (hoy y recientes) muestran resultados en menos de 2 segundos con volúmenes habituales de uso.
- **SC-003**: En validación funcional, 100% de búsquedas con coincidencias esperadas devuelve resultados correctos sin sensibilidad a mayúsculas/minúsculas.
- **SC-004**: Menos del 2% de intentos de guardado terminan en errores de validación inesperados durante pruebas con usuarios internos.
- **SC-005**: Al menos 85% de usuarios evalúa como “fácil” o “muy fácil” el uso del frontend para registrar y consultar actividad.

## Assumptions

- El frontend está orientado a usuarios que ya usan la herramienta de devlog y necesitan una opción visual complementaria.
- El alcance inicial cubre creación de entradas, consulta diaria/reciente y búsqueda; analítica avanzada queda fuera de esta versión.
- Editar y eliminar entradas quedan explícitamente fuera de alcance en v1.
- El modelo de datos actual de entradas puede reutilizarse sin cambios disruptivos para convivir entre CLI y frontend.
- El uso principal ocurre en entorno local, sin requerir autenticación multiusuario en esta fase.
- La persistencia de datos existente sigue siendo la fuente de verdad para evitar divergencias entre canales de uso.
