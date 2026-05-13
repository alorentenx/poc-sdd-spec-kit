# Feature Specification: Daily Devlog CLI

**Feature Branch**: `[001-daily-devlog-cli]`  
**Created**: 2026-05-13  
**Status**: Draft  
**Input**: User description: "Quiero una herramienta de línea de comandos para que un desarrollador pueda registrar lo que hizo durante el día. Debe permitir: añadir una nueva entrada con texto libre, listar todas las entradas del día de hoy, listar las entradas de los últimos N días, y buscar entradas por palabra clave. Cada entrada debe guardar automáticamente la fecha y hora exacta. El desarrollador no debe preocuparse de dónde se guardan los datos."

## Clarifications

### Session 2026-05-13

- Q: ¿Cuál es la política de retención de entradas? → A: Conservar últimos 365 días; eliminar automáticamente lo anterior.
- Q: ¿La búsqueda distingue mayúsculas/minúsculas? → A: No, la búsqueda es insensible a mayúsculas/minúsculas.
- Q: ¿Cuál es el límite máximo permitido para N días? → A: N máximo de 365 días.
- Q: ¿Tipo de coincidencia en búsqueda por palabra clave? → A: Coincidencia por subcadena.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar una entrada rápida (Priority: P1)

Como desarrollador, quiero añadir una entrada con texto libre para registrar lo que hice sin pasos adicionales.

**Why this priority**: Es el flujo principal de valor; sin creación de entradas no existe utilidad de la herramienta.

**Independent Test**: Puede validarse ejecutando el comando de alta con texto libre y comprobando que la entrada aparece después en listados.

**Acceptance Scenarios**:

1. **Given** que el desarrollador ejecuta el comando de añadir con un texto no vacío, **When** confirma la ejecución, **Then** el sistema guarda una nueva entrada con fecha y hora exactas generadas automáticamente.
2. **Given** que el desarrollador añade varias entradas en distintos momentos, **When** cada alta finaliza, **Then** cada entrada mantiene su propia marca temporal exacta y su texto original.

---

### User Story 2 - Revisar actividad reciente (Priority: P2)

Como desarrollador, quiero listar entradas de hoy y de los últimos N días para revisar mi progreso reciente.

**Why this priority**: Permite recuperar contexto diario y semanal, una necesidad clave para seguimiento de trabajo.

**Independent Test**: Puede validarse con entradas de fechas distintas y ejecutando listados de hoy y de ventana temporal N.

**Acceptance Scenarios**:

1. **Given** que existen entradas registradas en diferentes fechas, **When** el desarrollador solicita entradas de hoy, **Then** solo se muestran entradas cuya fecha corresponde al día actual local.
2. **Given** que existen entradas en los últimos días, **When** el desarrollador solicita entradas de los últimos N días, **Then** se muestran únicamente las entradas dentro de esa ventana temporal, ordenadas de más reciente a más antigua.

---

### User Story 3 - Buscar por palabra clave (Priority: P3)

Como desarrollador, quiero buscar entradas por palabra clave para encontrar rápidamente trabajo relacionado con un tema.

**Why this priority**: Mejora la recuperación de información histórica y reduce tiempo de revisión manual.

**Independent Test**: Puede validarse registrando entradas con y sin un término específico y ejecutando la búsqueda.

**Acceptance Scenarios**:

1. **Given** que existen entradas con diferentes textos, **When** el desarrollador busca una palabra clave, **Then** se muestran solo las entradas que contienen esa palabra en su contenido.
2. **Given** que ninguna entrada contiene la palabra buscada, **When** se ejecuta la búsqueda, **Then** el sistema informa que no hay resultados sin fallar la ejecución.

---

### Edge Cases

- ¿Qué ocurre si se intenta crear una entrada con texto vacío o solo espacios?
- ¿Qué ocurre al listar últimos N días cuando N es 0, negativo, mayor que 365 o no numérico?
- La búsqueda por palabra clave MUST devolver los mismos resultados independientemente de mayúsculas/minúsculas.
- ¿Qué sucede cuando no existen entradas guardadas todavía?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir crear una nueva entrada desde CLI con texto libre proporcionado por el usuario.
- **FR-002**: El sistema MUST asignar automáticamente fecha y hora exactas a cada entrada en el momento de creación.
- **FR-003**: El sistema MUST permitir listar todas las entradas del día actual local.
- **FR-004**: El sistema MUST permitir listar entradas de los últimos N días, incluyendo filtros por rango temporal relativo al día actual local.
- **FR-005**: El sistema MUST permitir buscar entradas por palabra clave dentro del contenido textual de la entrada.
- **FR-005a**: El sistema MUST ejecutar la búsqueda de palabras clave de forma insensible a mayúsculas/minúsculas.
- **FR-005b**: El sistema MUST considerar coincidencia por subcadena dentro del texto de cada entrada.
- **FR-006**: El sistema MUST conservar cada entrada para consultas futuras sin que el usuario deba configurar manualmente ubicación de almacenamiento.
- **FR-007**: El sistema MUST validar entradas de usuario inválidas (por ejemplo texto vacío o N inválido) y devolver mensajes de error claros.
- **FR-007a**: El sistema MUST rechazar valores de N fuera del rango 1..365 con mensaje de error claro.
- **FR-CLI-001**: El sistema MUST definir comandos con comportamiento consistente y predecible para uso en terminal.
- **FR-DATA-001**: El sistema MUST almacenar y recuperar las entradas como registros estructurados con texto, fecha y hora.
- **FR-008**: El sistema MUST aplicar una política de retención automática de 365 días; las entradas más antiguas MUST eliminarse sin intervención del usuario.

### Key Entities *(include if feature involves data)*

- **Entry**: Registro de actividad del desarrollador con identificador, texto libre, marca temporal exacta y fecha derivada para filtrado.
- **SearchQuery**: Criterio de búsqueda textual usado para filtrar entradas por coincidencia en contenido.
- **DayRangeFilter**: Parámetro temporal relativo que representa ventana de "últimos N días" para listados.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% de los usuarios objetivo pueden registrar una entrada en menos de 15 segundos desde que invocan el comando.
- **SC-002**: 100% de las entradas creadas incluyen fecha y hora exactas visibles en resultados de consulta.
- **SC-003**: En pruebas de aceptación, los listados de hoy y de últimos N días devuelven únicamente entradas dentro del rango esperado en el 100% de casos de prueba definidos.
- **SC-004**: En un conjunto de validación con palabras clave conocidas, la búsqueda devuelve resultados correctos (sin falsos positivos en el top mostrado) en al menos 95% de consultas.

## Assumptions

- El usuario ejecuta la herramienta en una única zona horaria local por instalación.
- El volumen inicial de uso es personal o de equipo pequeño, con un número moderado de entradas diarias y retención automática de 365 días.
- La herramienta se usa desde terminal interactiva y no requiere autenticación multiusuario en esta versión.
- El sistema gestionará internamente la persistencia para ocultar la ubicación física de los datos al desarrollador.

