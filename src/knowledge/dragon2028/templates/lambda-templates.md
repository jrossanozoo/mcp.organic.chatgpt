---
id: dragon2028-templates-lambda-auxiliary
title: Dragon 2028 Auxiliary Runtime Template
description: Template de función auxiliar para runtimes externos; no aplica a código Visual FoxPro.
tags:
  - templates
  - lambda
  - nodejs
  - python
version: 1.0.0
---

Las funciones tipo lambda deben tratarse como artefactos auxiliares fuera del núcleo VFP.

Ejemplo mínimo Node.js:

```javascript
exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, input: event })
  };
};
```

No usar este patrón como sustituto de métodos o funciones Visual FoxPro.