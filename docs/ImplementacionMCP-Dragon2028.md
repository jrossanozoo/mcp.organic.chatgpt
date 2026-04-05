# Implementacion MCP Dragon 2028

## Resumen

Este workspace contiene un servidor MCP para asistir el desarrollo de productos Zoo Logic. El objetivo de esta etapa es incorporar la linea Dragon 2028 como conocimiento operativo real del MCP, sin implementar todavia la exposicion del servidor como contenedor de red. El alcance incluye deteccion por patron, ampliacion de la base de conocimiento, nuevos recursos y prompts, soporte para analisis de soluciones hermanas y alineacion con el lenguaje Visual FoxPro observado en codigo real.

La implementacion parte de una premisa clave: Organic y Dragon 2028 comparten framework y lenguaje, pero no comparten topologia. Organic es un monolito legacy con estructura fija y ADN historico en DBF. Dragon 2028 es modular, usa DOVFP, Git, archivos .vfpsln y .vfpproj, PromptOps local por solucion y separacion entre BusinessLogic, Generated, Tests y proyectos opcionales.

## Plan Conceptual

### 1. Modelo del dominio MCP

El MCP debe distinguir entre linea de desarrollo, tipo de solucion y rol dentro del ecosistema. La nueva linea tecnica se identifica como `dragon2028`. Ademas de `businessLine`, el contexto del proyecto debe exponer nombre de solucion, tipo de estructura, rol, patrones detectados, soluciones relacionadas y resumen de dependencias.

### 2. Taxonomia Dragon 2028

La taxonomia funcional del ecosistema Dragon 2028 queda definida asi:

- Modulos base secuenciales: Organic.Core, Organic.Drawing, Organic.Generator, Organic.Feline.
- Soluciones de producto final: Organic.Dragonfish y Organic.ZL cuando exista fisicamente.
- Soluciones independientes consumibles: Organic.AdnImplant, futuras apps auxiliares como controladores fiscales, CLI derivados de Taspein y dovfp.fxuLegacy.

Las soluciones independientes forman parte del ecosistema Dragon 2028, pero no integran la cadena modular principal ni deben validarse como dependencias obligatorias de Core, Drawing, Generator, Feline o productos finales.

### 3. Conocimiento compartido y conocimiento especifico

El conocimiento del MCP se organiza en dos capas:

- Capa shared: reglas FoxPro observadas, framework Organic compartido, generated versus custom code, patrones comunes de entidades, herencia, CRUD, services globales y PromptOps reutilizable.
- Capa por linea: contexto, arquitectura, estandares, mejores practicas, templates y guias operativas especificas de Organic, Lince y Dragon 2028.

### 4. PromptOps unificado con overlays

La recomendacion es no copiar una sola carpeta `.github` a todas las soluciones. El MCP debe centralizar el conocimiento comun de agents, instructions, prompts y skills, y luego permitir overlays por solucion para:

- Startup objects.
- Dependencias modulares.
- Rutas locales.
- Modulos opcionales.
- Reglas particulares de producto.

Organic.Dragonfish se toma como baseline de referencia porque es la solucion mas completa y mejor documentada, pero no como fuente unica para todas las soluciones.

### 5. Restricciones del lenguaje

El MCP no debe sugerir caracteristicas no verificadas en Visual FoxPro real. En el codigo observado se confirmaron `DEFINE CLASS`, `FUNCTION/ENDFUNC`, `LOCAL ... AS`, `DODEFAULT()`, `WITH/ENDWITH`, `TRY/CATCH/ENDTRY`, macros `&`, `#IF/#INCLUDE`, `SET PROCEDURE TO`, `CREATEOBJECT/NEWOBJECT`, arrays y acceso a DBF/XML/SQL. No se encontro evidencia real de lambdas, chaining estilo JavaScript, `PROCEDURE/ENDPROC`, `LPARAMETERS` en codigo activo ni una sintaxis NOTE validada por codigo observado.

## Guia de Implementacion

### Paso 1. Extender tipos y contratos

Actualizar los tipos del MCP para agregar `dragon2028`, nuevas categorias de conocimiento y un `ProjectContext` mas rico con `solutionName`, `solutionType`, `solutionRole`, `detectedPatterns`, `relatedSolutions` y `dependencySummary`.

### Paso 2. Rehacer el detector

Reemplazar la deteccion actual por heuristicas verificables:

- Organic legacy: ruta fija, modulos clasicos, ADN en DBF, señales legacy.
- Dragon 2028: .vfpsln, .vfpproj, estructura Organic.BusinessLogic/Generated/Tests, PromptOps local, referencias de solucion y modulos opcionales.
- Lince: señales de performance tipadas y corpus disponible.

El detector tambien debe poder:

- Resumir PromptOps local.
- Detectar soluciones relacionadas hermanas.
- Extraer AppReferences y ProjectReferences para validar la topologia modular.

### Paso 3. Ampliar el indice de conocimiento

El indice debe incorporar categorias que ya existen en el repositorio pero no eran indexadas:

- architecture
- patterns
- standards
- best-practices
- context
- templates
- source-repository
- promptops

Ademas debe mezclar automaticamente la capa shared con la linea consultada, para que una busqueda en Dragon 2028 pueda devolver tambien reglas comunes del framework.

### Paso 4. Adaptar recursos, prompts y herramientas

Se deben actualizar las superficies MCP para soportar Dragon 2028 y el nuevo corpus:

- Recursos por linea y por categoria.
- Prompt contextual realista para Organic, Lince y Dragon 2028.
- Herramientas nuevas para analizar estructura de solucion y resumir PromptOps.
- Ajustes para que templates y knowledge search usen las categorias correctas.

### Paso 5. Cargar el corpus Dragon 2028

Crear Markdown con frontmatter bajo `src/knowledge/dragon2028` y `src/knowledge/shared` para documentar:

- Contexto Dragon 2028.
- Grafo modular esperado.
- Reglas de dependencia.
- Estrategia de migracion DBF a XML.
- Generated versus custom code.
- Integracion PromptOps.
- Plantillas de tests y artefactos auxiliares.

### Paso 6. Verificacion

Verificar con build de TypeScript y con rutas reales bajo ArchCell28:

- Organic.Core.
- Organic.Drawing.
- Organic.Generator.
- Organic.Feline.
- Organic.Dragonfish.
- Organic.AdnImplant como solucion independiente.

## Plan de Desarrollo

### Fase A. Infraestructura del MCP

1. Extender tipos.
2. Rehacer detector.
3. Rehacer knowledge search.
4. Rehacer resources y prompts.

### Fase B. Superficie funcional

1. Ajustar tool schemas a tres lineas.
2. Incorporar analisis de solucion y PromptOps.
3. Corregir resolucion de templates y categorias.

### Fase C. Corpus de conocimiento

1. Crear shared.
2. Crear dragon2028.
3. Integrar reglas FoxPro verificadas.

### Fase D. Validacion

1. Compilar.
2. Revisar errores de tipos.
3. Probar deteccion con rutas reales.
4. Validar que prompts no sugieran sintaxis VFP inexistente.

## Instrucciones de Actualizacion del MCP

Cada mejora futura del MCP debe seguir esta secuencia:

1. Actualizar primero el documento fuente de conocimiento o agregar nuevos archivos en `src/knowledge`.
2. Si la mejora agrega una nueva categoria o cambia la forma de indexacion, ajustar `src/types/index.ts` y `src/utils/knowledge-search.ts` antes de tocar handlers.
3. Si la mejora depende de una nueva estructura de proyecto real, validar primero con un ejemplo fisico de repositorio hermano.
4. Cualquier nueva convención FoxPro debe basarse en codigo observado o quedar marcada explícitamente como convención objetivo pendiente de validación.
5. Los cambios de PromptOps deben implementarse como conocimiento compartido con overlays por solución, no como copia ciega de una sola `.github`.
6. Antes de cerrar una iteración, ejecutar `npm run build` y revisar que el detector siga diferenciando Organic legacy, Dragon 2028 modular y soluciones independientes.

## Docker y Red

La exposicion del MCP como contenedor Docker queda fuera de esta etapa. Solo debe prepararse conceptualmente:

- Empaquetado del knowledge base completo.
- Variables de entorno de línea por defecto y base path.
- Health checks reales.
- Build reproducible dentro del contenedor.
- Estrategia para servir simultáneamente a varios equipos en la red.

Esa fase debe comenzar una vez estabilizado el soporte lógico de conocimiento y detección implementado en esta entrega.