---
id: dragon2028-architecture-independent-solutions
title: Independent Solutions Pattern
description: Cómo modelar soluciones independientes dentro del ecosistema Dragon 2028.
tags:
  - dragon2028
  - architecture
  - independent-solution
  - adnimplant
version: 1.0.0
---

No toda solución `Organic.*` pertenece a la cadena modular principal.

Casos reconocidos:

- `Organic.AdnImplant`.
- futuras apps auxiliares como controladores fiscales.
- CLI derivados de Taspein.
- `dovfp.fxuLegacy` para tests legacy.

Estas soluciones deben detectarse como parte del ecosistema Dragon 2028, pero no deben marcarse como dependencias obligatorias de Core, Drawing, Generator, Feline o productos finales.