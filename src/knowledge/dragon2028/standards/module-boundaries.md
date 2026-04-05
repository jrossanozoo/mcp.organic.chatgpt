---
id: dragon2028-standards-module-boundaries
title: Module Boundaries
description: Reglas de límites modulares para Dragon 2028.
tags:
  - dragon2028
  - standards
  - dependencies
  - appreferences
version: 1.0.0
---

Reglas de borde:

- `Organic.Core` no debe depender de módulos principales posteriores.
- `Organic.Drawing` solo debe depender de `Organic.Core`.
- `Organic.Generator` puede depender de `Organic.Core` y `Organic.Drawing`.
- `Organic.Feline` depende de Core, Drawing y Generator.
- Un producto final no debe introducir referencias inversas hacia módulos base.
- Las soluciones independientes no deben forzarse como parte del grafo principal.