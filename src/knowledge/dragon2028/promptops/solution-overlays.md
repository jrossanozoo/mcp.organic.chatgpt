---
id: dragon2028-promptops-solution-overlays
title: Solution PromptOps Overlays
description: Estrategia de overlays de PromptOps por solución en Dragon 2028.
tags:
  - dragon2028
  - promptops
  - overlays
  - dragonfish
version: 1.0.0
---

Cada solución Dragon 2028 puede tener PromptOps local bajo `.github`.

Recomendación operativa:

- Centralizar en el MCP el conocimiento común de agents, instructions, prompts y skills.
- Conservar overlays locales por solución para contexto particular.
- Baseline sugerido: Organic.Dragonfish.
- Si una instrucción local contradice el código real observado, prevalece el comportamiento verificado del proyecto.