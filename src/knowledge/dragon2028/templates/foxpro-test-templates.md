---
id: dragon2028-templates-foxpro-tests
title: Dragon 2028 FoxPro Test Template
description: Test template para Visual FoxPro en Dragon 2028, con foco en separación entre legacy y suite nueva.
tags:
  - templates
  - test
  - visual foxpro
  - unit
  - integration
version: 1.0.0
---

Template de test para Visual FoxPro y Dragon 2028:

```foxpro
* Dragon 2028 test template
function Test_CasoBasico() as Void
	local llRetorno as Boolean
	llRetorno = .T.
	assert llRetorno
endfunc
```

Usar esta base cuando el objetivo sea generar estructura de test para VFP. Si el caso corresponde a compatibilidad heredada, ubicarlo en `Tests.Legacy`; si es nuevo, ubicarlo en la suite moderna definida por la solución.