# Siguientes Pasos para Dragon 2028

## Resumen

La etapa actual ya dejo resuelto el soporte base de Dragon 2028 en el MCP: deteccion de linea, conocimiento inicial, prompts, resources, tools de analisis y validacion de build. Los pasos siguientes deben enfocarse en mejorar la precision del diagnostico, equilibrar el corpus entre lineas y, como objetivo principal, incorporar una herramienta MCP capaz de comparar dos soluciones Dragon 2028 y marcar deuda de migracion entre dependencias esperadas y reales.

La logica recomendada es tratar los pasos 1 y 2 como refuerzos previos que mejoran la calidad del paso 3. No son estrictamente bloqueantes, pero si elevan la señal tecnica y reducen falsos positivos cuando el MCP compare soluciones reales.

## Paso 1. Endurecer la normalizacion de AppReference

### Objetivo

Mejorar la lectura de dependencias en archivos `.vfpproj` para distinguir con mas precision entre:

- referencias a modulos principales del ecosistema;
- referencias a soluciones independientes;
- referencias auxiliares de test o runtime;
- rutas relativas que hoy no expresan directamente un nombre de solucion.

### Por que sigue pendiente

La deteccion actual ya identifica correctamente los modulos principales y varias relaciones reales, pero algunos `AppReference` siguen entrando como cadenas de ruta en lugar de resolverse a una identidad semantica clara. Esto afecta especialmente a soluciones independientes o a referencias de test, donde una ruta relativa puede parecer una dependencia funcional cuando en realidad es solo soporte de ejecucion o validacion.

### Resultado esperado

Al finalizar este paso, el MCP debe poder clasificar cada `AppReference` en una categoria util para analisis:

- modulo principal esperado;
- solucion independiente;
- referencia auxiliar;
- referencia desconocida;
- posible deuda de migracion.

### Implementacion sugerida

Conviene extender la normalizacion actual en [src/utils/context-detector.ts](src/utils/context-detector.ts) para:

1. Resolver nombres canonicos desde rutas relativas.
2. Detectar patrones de salida de tests, `bin`, `Test`, `Mocks` o artefactos auxiliares.
3. Separar dependencias funcionales de dependencias de infraestructura local.
4. Incorporar metadatos por referencia, no solo listas planas de strings.

### Impacto sobre el paso 3

Este paso mejora directamente la futura herramienta comparativa, porque una comparación entre dos soluciones solo es útil si el MCP sabe diferenciar una desviación modular real de una referencia auxiliar no relevante.

## Paso 2. Equilibrar el corpus de conocimiento entre Organic, Lince y Dragon 2028

### Objetivo

Completar la base de conocimiento para Organic y Lince con el mismo nivel de granularidad que ahora tiene Dragon 2028 en `context`, `standards`, `promptops`, `templates` y `source-repository`.

### Por que sigue pendiente

Dragon 2028 recibió una primera carga fuerte de conocimiento porque era la nueva linea a modelar. Eso resuelve el problema principal, pero deja un desbalance operativo: el MCP tiene mas contexto estructural para Dragon 2028 que para Organic y Lince. En consultas mixtas o comparativas, esto puede sesgar recomendaciones, sobre todo cuando hay componentes heredados o shared.

### Resultado esperado

El MCP debe poder responder con profundidad similar ante preguntas sobre:

- Organic legacy monolitico;
- Lince orientado a performance;
- Dragon 2028 modular;
- reglas shared del framework.

### Implementacion sugerida

Agregar contenido nuevo bajo:

- `src/knowledge/organic/context`
- `src/knowledge/organic/promptops`
- `src/knowledge/organic/source-repository`
- `src/knowledge/lince/context`
- `src/knowledge/lince/promptops`
- `src/knowledge/lince/source-repository`

El criterio no debe ser cantidad de archivos sino calidad indexable: menos documentos, pero mas concretos, verificables y reutilizables por prompts y tools.

### Impacto sobre el paso 3

Aunque el paso 3 se centre en Dragon 2028, el comparador va a necesitar contexto shared y criterios heredados de Organic para explicar si una referencia anomala es deuda de migracion, compatibilidad transitoria o una ruptura de modularidad.

## Paso 3. Exponer una herramienta MCP para comparar dos soluciones Dragon 2028 y marcar deuda de migracion

### Objetivo principal

Incorporar una herramienta MCP adicional que reciba dos soluciones Dragon 2028, compare sus dependencias esperadas y reales, y produzca un diagnostico de deuda de migracion entendible para el equipo.

Esta debe ser la siguiente mejora principal del servidor porque transforma el conocimiento ya cargado en una capacidad concreta de auditoria evolutiva.

### Problema que resuelve

Hoy el MCP puede analizar una solucion individual y detectar si tiene dependencias faltantes o inesperadas respecto del grafo modular esperado. Eso ya sirve para diagnosticos aislados, pero no alcanza cuando el equipo necesita responder preguntas como estas:

- Que diferencias estructurales existen entre `Organic.Feline` y `Organic.Dragonfish`.
- Si una solucion nueva arrastra deuda heredada de otra solucion anterior.
- Si una rama de migracion mejoro o empeoro la modularidad respecto de otra solucion del mismo ecosistema.
- Que referencias son comunes, cuales faltan, cuales sobran y cuales indican acoplamiento impropio.

La nueva herramienta permitiria hacer comparacion estructural y no solo inspeccion puntual.

### Caso de uso esperado

Entrada conceptual:

- `leftProjectPath`
- `rightProjectPath`
- opcion para incluir o no referencias auxiliares
- opcion para incluir o no soluciones independientes

Salida esperada:

- linea detectada para ambas soluciones;
- rol de cada solucion dentro del ecosistema;
- dependencias esperadas para cada una;
- dependencias reales encontradas;
- referencias comunes;
- referencias exclusivas de izquierda;
- referencias exclusivas de derecha;
- deuda de migracion clasificada por severidad;
- conclusion textual con recomendaciones.

### Deuda de migracion que debe detectar

La herramienta no debe limitarse a mostrar diferencias. Debe explicar por que una diferencia importa. La deuda de migracion puede clasificarse, al menos, en estos grupos:

1. Dependencia esperada faltante.
Una solucion deberia depender de un modulo base y no lo hace.

2. Dependencia inesperada a modulo principal.
Una solucion introduce una referencia que rompe el orden Core -> Drawing -> Generator -> Feline -> producto final.

3. Referencia heredada o transitoria.
Hay una dependencia no ideal, pero compatible con una etapa de migracion si se documenta como transicion.

4. Referencia auxiliar mal interpretada como funcional.
Debe excluirse o reportarse aparte para no contaminar el analisis modular.

5. Divergencia entre soluciones equivalentes.
Dos soluciones del mismo rol muestran estructuras incompatibles y eso puede indicar deriva arquitectonica.

### Diseño recomendado

La implementacion conviene dividirla en cuatro partes.

#### A. Nuevo tool en el handler

Agregar una definicion nueva en [src/handlers/tools.ts](src/handlers/tools.ts), por ejemplo:

- nombre sugerido: `compare-dragon-solutions`
- descripcion: compara dos soluciones Dragon 2028 y reporta deuda de migracion

El schema de entrada deberia pedir:

- `leftProjectPath`
- `rightProjectPath`
- `includeAuxiliaryReferences` opcional
- `includeIndependentSolutions` opcional

#### B. Nuevo servicio de comparacion

Para no sobrecargar el detector, conviene crear una utilidad dedicada, por ejemplo en un archivo nuevo como `src/utils/solution-comparator.ts`.

Ese componente deberia:

1. Invocar el detector sobre ambos paths.
2. Normalizar y clasificar referencias.
3. Comparar esperado versus real por cada solucion.
4. Comparar izquierda versus derecha.
5. Emitir un objeto final con hallazgos, deuda y resumen ejecutivo.

#### C. Modelo de salida tipado

Tambien conviene extender [src/types/index.ts](src/types/index.ts) con contratos especificos para la comparacion, por ejemplo:

- `ReferenceClassification`
- `MigrationDebtItem`
- `SolutionComparisonResult`

La salida no debe ser una lista cruda. Tiene que quedar tipada para que despues pueda reutilizarse desde prompts, resources o futuras interfaces.

#### D. Reglas de severidad

La herramienta deberia asignar severidad a cada hallazgo:

- `high`: rompe modularidad base o introduce dependencia circular de hecho;
- `medium`: dependencia no esperada pero compatible con una etapa transitoria;
- `low`: diferencia contextual o auxiliar sin impacto estructural fuerte;
- `info`: diferencia observacional que conviene documentar.

### Ejemplo de salida deseable

El resultado ideal no debe ser solo JSON tecnico. Debe incluir tambien una conclusion sintetica, por ejemplo:

`Organic.Dragonfish` y `Organic.Feline` comparten la base esperada, pero Dragonfish introduce una referencia adicional a `Organic.AdnImplant`. Esa referencia no rompe la cadena principal, aunque debe evaluarse si corresponde a una integracion intencional o a deuda de migracion. No se detectan dependencias faltantes respecto del grafo esperado.

### Archivos a tocar

La ruta minima para implementar este paso seria:

- [src/handlers/tools.ts](src/handlers/tools.ts)
- [src/types/index.ts](src/types/index.ts)
- [src/utils/context-detector.ts](src/utils/context-detector.ts)
- nuevo archivo sugerido: `src/utils/solution-comparator.ts`

Opcionalmente, si luego se quiere exponer este resultado como recurso reusable:

- [src/handlers/resources.ts](src/handlers/resources.ts)

### Validacion tecnica

La validacion de esta herramienta deberia hacerse al menos con estos pares:

1. `Organic.Core` contra `Organic.Drawing`.
2. `Organic.Drawing` contra `Organic.Generator`.
3. `Organic.Feline` contra `Organic.Dragonfish`.
4. `Organic.Dragonfish` contra `Organic.AdnImplant`.

Los objetivos de validacion son claros:

- comprobar que la comparacion no mezcle roles distintos sin explicarlo;
- asegurar que las referencias auxiliares no deformen la conclusion;
- verificar que la deuda de migracion salga clasificada y no solo listada;
- confirmar que el build sigue limpio con `npm run build`.

### Orden recomendado de ejecucion

La secuencia mas razonable para el siguiente ciclo es:

1. Ajustar la normalizacion de `AppReference`.
2. Diseñar tipos de comparacion y clasificacion.
3. Implementar el comparador en utilitario separado.
4. Exponer el tool MCP.
5. Validarlo con soluciones reales de ArchCell28.
6. Documentar casos observados como conocimiento reutilizable.

## Recomendacion final

Si hay que elegir un unico siguiente entregable, debe ser el paso 3. Es el primero que convierte la base de conocimiento Dragon 2028 en una capacidad de asistencia diferencial para arquitectura y migracion.

Los pasos 1 y 2 siguen siendo importantes, pero deben leerse como aceleradores del paso 3:

- el paso 1 mejora precision;
- el paso 2 mejora contexto;
- el paso 3 entrega valor operativo inmediato.