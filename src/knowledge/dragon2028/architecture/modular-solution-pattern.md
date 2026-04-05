---
id: dragon2028-architecture-modular-solution
title: Dragon 2028 Modular Solution Pattern
description: Patrón modular esperado para soluciones Dragon 2028.
tags:
  - dragon2028
  - architecture
  - modularity
  - dependencies
version: 1.0.0
---

Cadena modular principal:

- `Organic.Core`: base sin dependencia sobre otros módulos principales.
- `Organic.Drawing`: depende de `Organic.Core`.
- `Organic.Generator`: depende de `Organic.Core` y `Organic.Drawing`.
- `Organic.Feline`: depende de `Organic.Core`, `Organic.Drawing` y `Organic.Generator`.
- `Organic.Dragonfish` y `Organic.ZL`: productos finales construidos sobre la línea base.

Objetivo del patrón:

- Eliminar referencias cruzadas indebidas.
- Separar generated code, negocio, tests y overlays locales.
- Permitir migración incremental desde Organic sin perder trazabilidad.