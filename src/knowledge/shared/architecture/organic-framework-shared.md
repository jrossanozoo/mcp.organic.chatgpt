---
id: shared-architecture-organic-framework
title: Organic Framework Shared Pattern
description: Patrón de framework compartido entre Organic legacy y Dragon 2028.
tags:
  - architecture
  - framework
  - entidad
  - generated
version: 1.0.0
---

Organic y Dragon 2028 comparten una arquitectura de framework basada en:

- Entidades con reglas de negocio.
- Kontrolers como capa de presentación.
- Objetos de acceso a datos asociados a la entidad.
- Generated code para bases de entidad y especializaciones para negocio.
- Servicios globales como `goMensajes`, `goDatos` o `goServicios.*`.
- Componentes acoplados a entidades o ítems de colecciones.

La diferencia principal está en la topología de solución: Organic es monolítico; Dragon 2028 desacopla módulos y productos finales.