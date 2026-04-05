---
id: dragon2028-source-repository-solution-structure
title: Dragon 2028 Solution Structure
description: Estructura indexable observada en soluciones Dragon 2028 reales.
tags:
  - dragon2028
  - source-repository
  - solution
  - vfpsln
version: 1.0.0
---

Estructura observada en soluciones reales:

- `.github/` con agents, instructions, prompts, skills y copilot-instructions.
- `Organic.BusinessLogic/` con `CENTRALSS` y `.vfpproj` principal.
- `Organic.Generated/` con `Generados`, ADN y tareas de versión.
- `Organic.Tests/` con `Tests.Legacy` y suite nueva.
- `Organic.Hooks/`, `Organic.Mocks/` y `Organic.Assets/` según corresponda.

Los `.vfpsln` agregan proyectos internos, mientras que los `.vfpproj` exponen `ProjectReference` y `AppReference` hacia módulos o soluciones auxiliares.