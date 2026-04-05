---
id: shared-standards-foxpro-framework-baseline
title: FoxPro Framework Baseline
description: Reglas base de codificación y de framework compartidas por Organic y Dragon 2028.
tags:
  - foxpro
  - standards
  - framework
  - generated
version: 1.0.0
---

Reglas base compartidas:

- Variables locales con prefijo `l` y parámetros con prefijo `t` según tipo.
- Métodos con tipo de retorno explícito.
- Uso de tabs para indentación.
- Llamar `DODEFAULT()` al extender inicialización y destroy.
- No modificar código generado `din_*`; personalizar mediante clases especializadas o definiciones de origen.
- Liberar explícitamente objetos inicializados en `Destroy()`.
- Mantener funciones pequeñas, con responsabilidad única y poca profundidad de bloques.