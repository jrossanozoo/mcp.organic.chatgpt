import { BUSINESS_LINES, BusinessLine, ContextPrompt, ProjectContext } from '../types';
import { KnowledgeSearch } from '../utils/knowledge-search';

/**
 * Manejador de prompts contextuales para diferentes líneas de negocio.
 */
export class PromptsHandler {
  private knowledgeSearch: KnowledgeSearch;

  private basePrompts: Record<BusinessLine, string> = {
    organic: `
Eres un asistente de programación especializado en ORGANIC, la solución Visual FoxPro monolítica del framework Organic.

CONTEXTO CORPORATIVO:
- Código fuente legacy bajo la estructura clásica de Nucleo, Dibujante, Generadores, Felino y productos finales.
- ADN y especificaciones históricas en DBF.
- Control de versiones legacy y convenciones heredadas del framework Organic.

REGLAS DE TRABAJO:
1. Prioriza el conocimiento del framework Organic y sus convenciones de generated versus custom code.
2. No propongas modificar archivos generados 'din_*' si la personalización corresponde a clases 'ent_*' u otras especializaciones.
3. Respeta la realidad de Visual FoxPro observada en el código: 'FUNCTION/ENDFUNC', 'DODEFAULT()', 'WITH/ENDWITH', macros y 'TRY/CATCH'.
4. Evita sugerencias incompatibles con el lenguaje, como lambdas o chaining estilo JavaScript.
5. Ten presente que el monolito comparte servicios globales, entidades, kontrolers y acceso a datos según el framework propio.
`,

    lince: `
Eres un asistente de programación especializado en LINCE.

CONTEXTO CORPORATIVO:
- Línea de desarrollo orientada a performance, velocidad y respuesta rápida.
- El conocimiento disponible debe usarse como guía tipada, sin extrapolar características no verificadas en el código real.

REGLAS DE TRABAJO:
1. Prioriza rendimiento, latencia y observabilidad.
2. Usa patrones y mejores prácticas del repositorio antes de traer alternativas externas.
3. Mantén las recomendaciones concretas y medibles.
4. Cuando no exista evidencia fuerte en el corpus, explícitalo.
`,

    dragon2028: `
Eres un asistente de programación especializado en DRAGON 2028, la evolución modular de Organic sobre DOVFP.

CONTEXTO CORPORATIVO:
- Soluciones Visual FoxPro 9 con estructura similar a .NET: '.vfpsln' para solución y '.vfpproj' para proyectos.
- Cada solución incluye como base 'Organic.BusinessLogic', 'Organic.Generated' y 'Organic.Tests'.
- Puede incluir proyectos opcionales como 'Organic.Assets', 'Organic.Mocks', 'Organic.Hooks' y 'Organic.Script'.
- Las dependencias modulares deben respetar la secuencia Core -> Drawing -> Generator -> Feline -> producto final.
- Existen soluciones independientes del ecosistema, como 'Organic.AdnImplant' o futuras apps/CLI auxiliares.

REGLAS DE TRABAJO:
1. Evalúa siempre la modularidad y las dependencias antes de sugerir cambios.
2. Diferencia claramente código generado, código de negocio, tests y PromptOps local.
3. No asumas características modernas que Visual FoxPro no mostró en el código real.
4. Si una propuesta rompe la independencia entre módulos, debes indicarlo y proponer la capa correcta.
5. Usa 'Organic.Dragonfish' solo como baseline de PromptOps compartido, no como verdad absoluta para todas las soluciones.
`
  };

  constructor(knowledgeSearch: KnowledgeSearch) {
    this.knowledgeSearch = knowledgeSearch;
  }

  /**
   * Obtiene el prompt contextual para una línea de negocio específica.
   */
  async getContextPrompt(
    businessLine: BusinessLine,
    projectContext?: ProjectContext,
    includeKnowledge: boolean = true
  ): Promise<ContextPrompt> {
    let prompt = this.basePrompts[businessLine];
    const includedKnowledge: string[] = [];

    if (includeKnowledge) {
      const knowledgeSection = await this.buildKnowledgeSection(businessLine);
      if (knowledgeSection) {
        prompt += `\n\n${knowledgeSection}`;
        includedKnowledge.push('context', 'architecture', 'standards', 'best-practices', 'promptops');
      }
    }

    if (projectContext) {
      prompt += `\n\n${this.buildProjectSection(projectContext)}`;
    }

    return {
      businessLine,
      prompt,
      variables: this.extractVariables(prompt),
      includedKnowledge
    };
  }

  /**
   * Obtiene un prompt específico para una funcionalidad.
   */
  async getSpecificPrompt(
    businessLine: BusinessLine,
    promptType: 'architecture' | 'debugging' | 'testing' | 'security' | 'performance' | 'test-generation' | 'lambda-generation',
    context?: string
  ): Promise<string> {
    const basePrompt = await this.getContextPrompt(businessLine);

    const specificPrompts: Record<typeof promptType, string> = {
      architecture: `
${basePrompt.prompt}

ENFOQUE ESPECIFICO - ARQUITECTURA:
- Ubica el cambio en la capa correcta del framework.
- Para Dragon 2028, valida dependencias entre módulos y soluciones independientes.
- Para Organic, respeta generated versus custom code y el carácter monolítico del producto.
- Explica riesgos de herencia, referencias cruzadas y deuda de migración.
`,

      debugging: `
${basePrompt.prompt}

ENFOQUE ESPECIFICO - DEBUGGING:
- Analiza primero la estructura y las dependencias que intervienen en el fallo.
- Usa solo constructos reales de VFP observados en código al proponer hipótesis.
- Si el problema puede venir de generated code, identifica la definición de origen antes de sugerir cambios manuales.
`,

      testing: `
${basePrompt.prompt}

ENFOQUE ESPECIFICO - TESTING:
- Diferencia tests legacy de tests nuevos cuando la solución sea Dragon 2028.
- Mantén aislamiento, cleanup explícito y nomenclatura coherente con FoxPro.
- En VFP, evita proponer frameworks o sintaxis que no existan en el ecosistema observado.
`,

      security: `
${basePrompt.prompt}

ENFOQUE ESPECIFICO - SEGURIDAD:
- Revisa manejo de rutas, DLLs, SQL dinámico y configuración sensible.
- Prioriza propuestas compatibles con el stack real del proyecto.
- Si una mejora requiere runtime externo o infraestructura nueva, sepárala de la solución VFP principal.
`,

      performance: `
${basePrompt.prompt}

ENFOQUE ESPECIFICO - PERFORMANCE:
- En FoxPro, prefiere diagnósticos ligados a DBF, SQL, cursores, caching real y reducción de acoplamiento.
- En Dragon 2028, busca dependencias innecesarias entre módulos y consumo excesivo de apps auxiliares.
- En Lince, explicita métricas objetivo cuando sea posible.
`,

      'test-generation': `
${basePrompt.prompt}

ENFOQUE ESPECIFICO - GENERACION DE TESTS:
- Genera esqueletos de prueba consistentes con el framework y la línea de negocio.
- En Dragon 2028, decide si el caso corresponde a 'Tests.Legacy' o a la suite nueva.
- No supongas capacidades del lenguaje no verificadas en VFP.
`,

      'lambda-generation': `
${basePrompt.prompt}

ENFOQUE ESPECIFICO - GENERACION DE FUNCIONES AUXILIARES:
- Este prompt aplica solo a runtimes auxiliares como Node.js o Python.
- No uses este patrón para código VFP: Visual FoxPro no mostró soporte real de lambdas ni funciones anónimas.
- Si la solución es Dragon 2028, trata estas funciones como artefactos externos al núcleo VFP.
`
    };

    let specificPrompt = specificPrompts[promptType];
    if (context) {
      specificPrompt += `\n\nCONTEXTO ADICIONAL:\n${context}`;
    }

    return specificPrompt;
  }

  /**
   * Lista todos los prompts disponibles.
   */
  getAvailablePrompts(): Array<{
    name: string;
    description: string;
    businessLines: BusinessLine[];
  }> {
    return [
      {
        name: 'context-prompt',
        description: 'Prompt contextual base para la línea de negocio',
        businessLines: [...BUSINESS_LINES]
      },
      {
        name: 'architecture-prompt',
        description: 'Prompt especializado en decisiones arquitectónicas',
        businessLines: [...BUSINESS_LINES]
      },
      {
        name: 'debugging-prompt',
        description: 'Prompt para análisis y resolución de problemas',
        businessLines: [...BUSINESS_LINES]
      },
      {
        name: 'testing-prompt',
        description: 'Prompt para estrategias de testing y calidad',
        businessLines: [...BUSINESS_LINES]
      },
      {
        name: 'security-prompt',
        description: 'Prompt para mejores prácticas de seguridad',
        businessLines: [...BUSINESS_LINES]
      },
      {
        name: 'performance-prompt',
        description: 'Prompt para optimización y performance',
        businessLines: [...BUSINESS_LINES]
      },
      {
        name: 'test-generation-prompt',
        description: 'Prompt especializado para generación de estructuras de test',
        businessLines: [...BUSINESS_LINES]
      },
      {
        name: 'lambda-generation-prompt',
        description: 'Prompt especializado para artefactos auxiliares tipo lambda',
        businessLines: [...BUSINESS_LINES]
      }
    ];
  }

  private async buildKnowledgeSection(businessLine: BusinessLine): Promise<string> {
    const sections: string[] = [];
    const categories: Array<{ title: string; category: string; limit: number }> = [
      { title: 'CONTEXTO RELEVANTE', category: 'context', limit: 1 },
      { title: 'PATRONES ARQUITECTONICOS', category: 'architecture', limit: 3 },
      { title: 'ESTANDARES DE CODIGO', category: 'standards', limit: 3 },
      { title: 'MEJORES PRACTICAS', category: 'best-practices', limit: 4 },
      { title: 'PROMPTOPS Y GUIAS OPERATIVAS', category: 'promptops', limit: 2 }
    ];

    for (const section of categories) {
      const items = await this.knowledgeSearch.getKnowledgeByCategory(businessLine, section.category);
      if (items.length === 0) {
        continue;
      }

      sections.push(`${section.title}:\n${items.slice(0, section.limit).map((item) => `- ${item.title}: ${item.description || item.content.slice(0, 140)}`).join('\n')}`);
    }

    return sections.join('\n\n');
  }

  private buildProjectSection(projectContext: ProjectContext): string {
    const sections: string[] = [
      'CONTEXTO DEL PROYECTO ACTUAL:',
      `- Linea de negocio detectada: ${projectContext.businessLine}`,
      `- Ruta: ${projectContext.projectPath}`,
      `- Confianza de deteccion: ${(projectContext.confidence * 100).toFixed(1)}%`
    ];

    if (projectContext.solutionName) {
      sections.push(`- Solucion o proyecto: ${projectContext.solutionName}`);
    }
    if (projectContext.solutionType) {
      sections.push(`- Tipo de estructura: ${projectContext.solutionType}`);
    }
    if (projectContext.solutionRole) {
      sections.push(`- Rol dentro del ecosistema: ${projectContext.solutionRole}`);
    }
    if (projectContext.technologies.length > 0) {
      sections.push(`- Tecnologias detectadas: ${projectContext.technologies.join(', ')}`);
    }
    if (projectContext.detectedPatterns.length > 0) {
      sections.push(`- Patrones detectados: ${projectContext.detectedPatterns.join(', ')}`);
    }
    if (projectContext.relatedSolutions.length > 0) {
      sections.push(`- Soluciones relacionadas: ${projectContext.relatedSolutions.join(', ')}`);
    }
    if (projectContext.dependencySummary) {
      const summary = projectContext.dependencySummary;
      sections.push(`- AppReferences: ${summary.appReferences.join(', ') || 'ninguna'}`);
      sections.push(`- ProjectReferences: ${summary.projectReferences.join(', ') || 'ninguna'}`);
      if (summary.missingReferences.length > 0) {
        sections.push(`- Dependencias esperadas faltantes: ${summary.missingReferences.join(', ')}`);
      }
      if (summary.unexpectedReferences.length > 0) {
        sections.push(`- Dependencias no esperadas: ${summary.unexpectedReferences.join(', ')}`);
      }
    }

    return sections.join('\n');
  }

  private extractVariables(prompt: string): Record<string, string> {
    const variables: Record<string, string> = {};
    const variableRegex = /\{\{(\w+)\}\}/g;
    let match: RegExpExecArray | null;

    match = variableRegex.exec(prompt);
    while (match !== null) {
      variables[match[1]] = '';
      match = variableRegex.exec(prompt);
    }

    return variables;
  }
}