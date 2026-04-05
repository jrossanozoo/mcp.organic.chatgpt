# Prompt de Ejecucion Dragon 2028

Usa este prompt para ejecutar una nueva iteracion del plan sobre el servidor MCP:

```text
Trabaja sobre el workspace del servidor MCP de Zoo Logic.

Objetivo:
Implementar y evolucionar el soporte de Dragon 2028 en el MCP como línea de conocimiento y herramientas, manteniendo compatibilidad con Organic y Lince.

Alcance obligatorio:
1. Modelar `dragon2028` como línea técnica del MCP.
2. Detectar por patrón soluciones Dragon 2028 modulares con `.vfpsln`, `.vfpproj`, `.github`, `Organic.BusinessLogic`, `Organic.Generated` y `Organic.Tests`.
3. Detectar soluciones independientes del ecosistema Dragon 2028 como `Organic.AdnImplant` y `dovfp.fxuLegacy`, sin tratarlas como módulos obligatorios de la cadena principal.
4. Mantener soporte de Organic legacy monolítico.
5. Ampliar el índice de conocimiento para `context`, `templates`, `source-repository` y `promptops`, además de las categorías existentes.
6. Mantener una capa `shared` para conocimiento común del framework y del lenguaje.
7. Adaptar tools, resources y prompts para las tres líneas.
8. Basar el conocimiento FoxPro solo en características verificadas en código real. No asumir lambdas, method chaining estilo JavaScript ni sintaxis no observada.
9. Documentar cualquier nueva regla o decisión en archivos Markdown dentro de `docs/` o `src/knowledge/` según corresponda.
10. Ejecutar validación final con `npm run build` y revisar errores del workspace.

Restricciones:
- No implementar todavía la exposición del servidor por Docker en red.
- No romper compatibilidad con el comportamiento existente del MCP.
- No revertir cambios del usuario fuera del alcance.
- No sugerir edición manual de generated code cuando la solución correcta sea especialización o definición de origen.

Hechos del dominio a respetar:
- Organic es monolítico, legacy y usa ADN en DBF.
- Dragon 2028 es modular y usa DOVFP.
- La cadena principal esperada es Core -> Drawing -> Generator -> Feline -> producto final.
- Organic.Dragonfish es baseline útil para PromptOps, pero no la única verdad física del ecosistema.
- Existen soluciones independientes consumibles por múltiples soluciones.

Entregables esperados:
- Código TypeScript actualizado.
- Nuevos archivos de conocimiento bajo `src/knowledge/shared` y `src/knowledge/dragon2028`.
- Documentación operativa actualizada en `docs/`.
- Validación final con build exitoso o reporte claro de bloqueos.
```