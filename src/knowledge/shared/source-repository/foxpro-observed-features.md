---
id: shared-source-repository-foxpro-observed
title: FoxPro Observed Features Summary
description: Resumen indexable de las características FoxPro realmente observadas en repositorios hermanos.
tags:
  - source-repository
  - foxpro
  - observed
version: 1.0.0
---

Patrones observados en repositorios hermanos:

- Clases con `DEFINE CLASS` y herencia `AS ... OF ...`.
- Funciones tipadas con `AS Boolean`, `AS String`, `AS Object`, `AS Void`.
- Manejo de errores con `TRY/CATCH` y excepciones anidadas vía `UserValue`.
- Integración con DLL y .NET mediante `DECLARE ... IN`, `CreateObject` y objetos externos.
- Uso frecuente de `WITH This`, `PEMSTATUS`, `VARTYPE`, cursores y `SET PROCEDURE TO`.