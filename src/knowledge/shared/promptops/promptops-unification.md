---
id: shared-promptops-unification
title: PromptOps Unification Strategy
description: Estrategia recomendada para unificar agents, instructions, prompts y skills en el MCP.
tags:
  - promptops
  - agents
  - instructions
  - dragon2028
version: 1.0.0
---

La estrategia recomendada es centralizar en el MCP el conocimiento común de PromptOps y conservar overlays por solución.

Reglas:

- Usar un núcleo compartido para agentes, instrucciones, prompts y skills del framework.
- Mantener overlays locales por solución para rutas, startup objects, dependencias y particularidades de producto.
- Tomar Organic.Dragonfish como baseline por completitud, no como única fuente física.
- Si una solución no tiene `.github`, el MCP debe apoyarse en conocimiento shared y en el contexto detectado.