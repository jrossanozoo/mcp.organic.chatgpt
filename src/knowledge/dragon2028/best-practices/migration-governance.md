---
id: dragon2028-best-practices-migration-governance
title: Migration Governance
description: Buenas prácticas para gobernar la migración desde Organic hacia Dragon 2028.
tags:
  - dragon2028
  - migration
  - best-practices
  - dbf
  - xml
version: 1.0.0
---

Buenas prácticas de migración:

- Validar dependencias modulares en cada solución antes de mover lógica.
- Tratar referencias no esperadas como deuda de migración hasta demostrar que son intencionales.
- Mantener generated code como derivado de definiciones, no como fuente primaria de negocio.
- Migrar definiciones de ADN a XML sin perder compatibilidad transitoria con DBF.
- Distinguir claramente tests legacy de tests nuevos durante la transición.