---
id: shared-context-foxpro-observed
title: FoxPro Observed Context
description: Características reales de Visual FoxPro observadas en código fuente de ArchCell y ArchCell28.
tags:
  - foxpro
  - vfp9
  - dodefault
  - function
  - try-catch
version: 1.0.0
---

El MCP debe asumir como base solo las características verificadas en código real:

- `DEFINE CLASS ... ENDDEFINE`
- `FUNCTION ... ENDFUNC`
- `LOCAL ... AS`
- `DODEFAULT()`
- `WITH ... ENDWITH`
- `TRY ... CATCH ... ENDTRY`
- macros `&`
- `#INCLUDE`, `#IF`, `#ENDIF`
- `SET PROCEDURE TO`
- `CREATEOBJECT`, `NEWOBJECT`
- arrays `DIMENSION`
- acceso a DBF, XML, SQL y objetos .NET

No se observó evidencia real de lambdas, method chaining estilo JavaScript, `PROCEDURE/ENDPROC`, `LPARAMETERS` en código activo ni una sintaxis NOTE validada por el código relevado.