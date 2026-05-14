# Feature Workflow (Spec Kit)

Guía operativa para ejecutar **siempre el mismo proceso** al iniciar una nueva feature.

## 0) Preparación de rama

1. Actualiza base:

```bash
git checkout main
git pull
```

2. Crea rama de feature:

```bash
git checkout -b 00X-nombre-feature
```

## 1) Especificar el QUÉ

Ejecuta:

```text
$speckit-specify <descripcion funcional de la feature>
```

Objetivo:
- Generar `spec.md` con historias, requisitos y criterios de éxito.

Checklist de salida:
- Historias de usuario claras (P1/P2/P3)
- Requisitos funcionales testables
- Criterios de éxito medibles

## 2) Clarificar ambigüedades

Ejecuta:

```text
$speckit-clarify
```

Objetivo:
- Resolver decisiones que afecten diseño, validaciones, tests o UX.

Checklist de salida:
- Sección `Clarifications` actualizada en `spec.md`
- Sin ambigüedades críticas abiertas

## 3) Planificar el CÓMO (técnico)

Ejecuta:

```text
$speckit-plan <stack, storage, testing, estructura de archivos, restricciones>
```

Objetivo:
- Generar `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`.

Checklist de salida:
- Stack y restricciones explícitas
- Contratos/inputs/outputs definidos
- Criterios de calidad y pruebas definidos

## 4) Generar tareas ejecutables

Ejecuta:

```text
$speckit-tasks
```

Objetivo:
- Generar `tasks.md` por fases y por historia de usuario.

Checklist de salida:
- Tareas con formato `- [ ] Txxx ...`
- Dependencias y paralelización claras
- MVP definido (normalmente US1)

## 5) Implementar

Ejecuta:

```text
$speckit-implement
```

Objetivo:
- Ejecutar tareas, implementar código y marcar progreso en `tasks.md`.

Checklist de salida:
- Tareas completadas (`[X]`)
- Código alineado con spec + plan
- Validaciones y errores cubiertos

## 6) Validar

Ejecuta:

```bash
node --test
```

Además:
- Ejecutar pruebas manuales del flujo crítico de usuario
- Revisar que README/quickstart estén actualizados si cambió la UX

## 7) Cerrar ciclo (Git)

```bash
git add .
git commit -m "feat: <nombre feature>"
git push -u origin 00X-nombre-feature
```

Luego:
- Abrir PR: `00X-nombre-feature` -> `main`
- Esperar checks
- Merge
- Limpiar rama local:

```bash
git checkout main
git pull
git branch -d 00X-nombre-feature
```

## Plantilla corta (copy/paste)

```text
$speckit-specify <descripcion funcional>
$speckit-clarify
$speckit-plan <decisiones tecnicas>
$speckit-tasks
$speckit-implement
```

```bash
node --test
git add .
git commit -m "feat: <nombre feature>"
git push -u origin <rama-feature>
```
