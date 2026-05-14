# Quickstart: Frontend para Devlog

## Requisitos
- Node.js 20+
- Entorno local con acceso a `~/.devlog/entries.json`

## Arrancar la aplicación
1. Inicia el servidor web local:
```bash
npm run start:web
```
2. Abre en navegador:
```text
http://localhost:3000
```

## Flujos a validar manualmente
1. Crear entrada desde formulario y verificar confirmación visual.
2. Consultar vista de hoy y comprobar que aparece la nueva entrada.
3. Consultar recientes con `days=7` y validar filtro.
4. Buscar por keyword con mayúsculas/minúsculas mixtas.
5. Probar validaciones:
   - `text` vacío al crear.
   - `days` fuera de rango.
   - `keyword` vacío.

## Validación por terminal (opcional)
- Health check:
```bash
curl http://localhost:3000/health
```
- Crear entrada:
```bash
curl -X POST http://localhost:3000/api/entries -H "Content-Type: application/json" -d '{"text":"Entrada desde curl"}'
```

## Pruebas automáticas
```bash
node --test
```

## Criterios de aceptación rápidos
- CLI sigue funcionando sin cambios de contrato.
- Frontend permite crear, listar y buscar sin editar/eliminar.
- Errores de validación y conflicto concurrente se muestran de forma clara.
