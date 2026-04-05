---
id: dragon2028-context-core
title: Dragon 2028 Context
description: Contexto operativo de Dragon 2028 como evolución modular de Organic.
tags:
  - dragon2028
  - dovfp
  - modular
  - foxpro
version: 1.0.0
---

Dragon 2028 es una evolución modular del framework Organic sobre Visual FoxPro 9 y DOVFP.

Características estructurales:

- Soluciones con `.vfpsln` y proyectos `.vfpproj`.
- Estructura base por solución con `Organic.BusinessLogic`, `Organic.Generated` y `Organic.Tests`.
- Posibles proyectos opcionales: `Organic.Assets`, `Organic.Mocks`, `Organic.Hooks`, `Organic.Script`.
- PromptOps local bajo `.github`.
- Git como control de versiones.
- Definiciones de entidad migrando de DBF a XML.

La línea distingue entre cadena modular principal y soluciones independientes consumibles por varias soluciones.