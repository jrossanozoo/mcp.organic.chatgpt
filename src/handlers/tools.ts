import {
  BUSINESS_LINES,
  KNOWLEDGE_CATEGORIES,
  ToolRequest,
  ToolResponse,
  BusinessLine,
  TestGenerationRequest,
  LambdaGenerationRequest,
  GeneratedContent,
  FoxProTestGroupRequest,
  FoxProTestMethodRequest
} from '../types';
import { ContextDetector } from '../utils/context-detector';
import { KnowledgeSearch } from '../utils/knowledge-search';
import { PromptsHandler } from './prompts';

/**
 * Manejador de herramientas MCP para el repositorio de conocimiento corporativo
 */
export class ToolsHandler {
  private contextDetector: ContextDetector;
  private knowledgeSearch: KnowledgeSearch;
  private promptsHandler: PromptsHandler;

  constructor(
    contextDetector: ContextDetector,
    knowledgeSearch: KnowledgeSearch,
    promptsHandler: PromptsHandler
  ) {
    this.contextDetector = contextDetector;
    this.knowledgeSearch = knowledgeSearch;
    this.promptsHandler = promptsHandler;
  }

  /**
   * Lista todas las herramientas disponibles
   */
  getAvailableTools() {
    return [
      {
        name: 'detect-business-line',
        description: 'Detecta automáticamente la línea de negocio basándose en el proyecto actual',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Ruta del proyecto a analizar'
            }
          },
          required: ['projectPath']
        }
      },
      {
        name: 'analyze-solution-structure',
        description: 'Analiza la estructura de una solución o proyecto y resume modularidad, rol y dependencias',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Ruta de la solución o proyecto a analizar'
            }
          },
          required: ['projectPath']
        }
      },
      {
        name: 'get-promptops-summary',
        description: 'Resume la estructura de agents, instructions, prompts y skills disponible en una solución',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Ruta de la solución o proyecto a analizar'
            }
          },
          required: ['projectPath']
        }
      },
      {
        name: 'get-context-prompt',
        description: 'Obtiene el prompt contextual específico para una línea de negocio',
        inputSchema: {
          type: 'object',
          properties: {
            businessLine: {
              type: 'string',
              enum: [...BUSINESS_LINES],
              description: 'Línea de negocio (organic, lince o dragon2028)'
            },
            projectPath: {
              type: 'string',
              description: 'Ruta del proyecto para contexto adicional'
            },
            includeKnowledge: {
              type: 'boolean',
              description: 'Si incluir conocimiento específico en el prompt',
              default: true
            }
          },
          required: ['businessLine']
        }
      },
      {
        name: 'search-knowledge',
        description: 'Busca en el repositorio de conocimiento de una línea de negocio específica',
        inputSchema: {
          type: 'object',
          properties: {
            businessLine: {
              type: 'string',
              enum: [...BUSINESS_LINES],
              description: 'Línea de negocio donde buscar'
            },
            query: {
              type: 'string',
              description: 'Términos de búsqueda'
            },
            category: {
              type: 'string',
              enum: [...KNOWLEDGE_CATEGORIES],
              description: 'Categoría específica de conocimiento'
            },
            limit: {
              type: 'number',
              description: 'Límite de resultados',
              default: 10
            }
          },
          required: ['businessLine', 'query']
        }
      },
      {
        name: 'get-best-practices',
        description: 'Obtiene mejores prácticas específicas por tecnología y línea de negocio',
        inputSchema: {
          type: 'object',
          properties: {
            businessLine: {
              type: 'string',
              enum: [...BUSINESS_LINES],
              description: 'Línea de negocio'
            },
            technology: {
              type: 'string',
              description: 'Tecnología específica (ej: React, Node.js, Python)'
            }
          },
          required: ['businessLine']
        }
      },
      {
        name: 'get-architectural-patterns',
        description: 'Obtiene patrones arquitectónicos recomendados para una línea de negocio',
        inputSchema: {
          type: 'object',
          properties: {
            businessLine: {
              type: 'string',
              enum: [...BUSINESS_LINES],
              description: 'Línea de negocio'
            },
            projectType: {
              type: 'string',
              description: 'Tipo de proyecto (web, api, mobile, etc.)'
            }
          },
          required: ['businessLine']
        }
      },
      {
        name: 'validate-code-standards',
        description: 'Valida si el código proporcionado sigue los estándares de la línea de negocio',
        inputSchema: {
          type: 'object',
          properties: {
            businessLine: {
              type: 'string',
              enum: [...BUSINESS_LINES],
              description: 'Línea de negocio'
            },
            code: {
              type: 'string',
              description: 'Código a validar'
            },
            language: {
              type: 'string',
              description: 'Lenguaje de programación del código'
            }
          },
          required: ['businessLine', 'code', 'language']
        }
      },
      {
        name: 'get-specific-prompt',
        description: 'Obtiene un prompt especializado para una funcionalidad específica',
        inputSchema: {
          type: 'object',
          properties: {
            businessLine: {
              type: 'string',
              enum: [...BUSINESS_LINES],
              description: 'Línea de negocio'
            },
            promptType: {
              type: 'string',
              enum: ['architecture', 'debugging', 'testing', 'security', 'performance', 'test-generation', 'lambda-generation'],
              description: 'Tipo de prompt especializado'
            },
            context: {
              type: 'string',
              description: 'Contexto adicional para el prompt'
            }
          },
          required: ['businessLine', 'promptType']
        }
      },
      {
        name: 'generate-test-structure',
        description: 'Genera estructura base de tests con configuración específica por línea de negocio',
        inputSchema: {
          type: 'object',
          properties: {
            testName: {
              type: 'string',
              description: 'Nombre del test a generar'
            },
            testFileName: {
              type: 'string',
              description: 'Nombre del archivo que agrupa los tests'
            },
            businessLine: {
              type: 'string',
              enum: [...BUSINESS_LINES],
              description: 'Línea de negocio'
            },
            technology: {
              type: 'string',
              description: 'Tecnología visual foxpro'
            },
            testType: {
              type: 'string',
              enum: ['unit', 'integration', 'e2e'],
              description: 'Tipo de test a generar'
            },
            framework: {
              type: 'string',
              description: 'Framework de testing foxUnit'
            },
            targetFile: {
              type: 'string',
              description: 'Archivo objetivo a testear (opcional)'
            }
          },
          required: ['testName', 'testFileName', 'businessLine', 'technology', 'testType']
        }
      },
      {
        name: 'generate-lambda-function',
        description: 'Genera función lambda basada en parámetros y fórmula específica',
        inputSchema: {
          type: 'object',
          properties: {
            functionName: {
              type: 'string',
              description: 'Nombre de la función lambda'
            },
            parameters: {
              type: 'array',
              description: 'Parámetros de la función',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Nombre del parámetro' },
                  type: { type: 'string', description: 'Tipo del parámetro' },
                  required: { type: 'boolean', description: 'Si es requerido' },
                  description: { type: 'string', description: 'Descripción del parámetro' },
                  defaultValue: { description: 'Valor por defecto' }
                },
                required: ['name', 'type', 'required']
              }
            },
            formula: {
              type: 'string',
              description: 'Fórmula o lógica de la función'
            },
            businessLine: {
              type: 'string',
              enum: [...BUSINESS_LINES],
              description: 'Línea de negocio'
            },
            runtime: {
              type: 'string',
              enum: ['nodejs', 'python', 'java', 'csharp'],
              description: 'Runtime de la función lambda'
            },
            returnType: {
              type: 'string',
              description: 'Tipo de retorno (opcional)'
            },
            description: {
              type: 'string',
              description: 'Descripción de la función (opcional)'
            }
          },
          required: ['functionName', 'parameters', 'formula', 'businessLine', 'runtime']
        }
      },
      {
        name: 'create-foxpro-test-group',
        description: 'Crea un nuevo grupo de test FoxPro con carpeta test/ y archivo .prg',
        inputSchema: {
          type: 'object',
          properties: {
            testGroupName: {
              type: 'string',
              description: 'Nombre del grupo de test (ej: zTestEnt_ImpoExpo)'
            },
            testDirectory: {
              type: 'string',
              description: 'Directorio base donde crear la carpeta test/'
            },
            businessLine: {
              type: 'string',
              enum: [...BUSINESS_LINES],
              description: 'Línea de negocio'
            },
            description: {
              type: 'string',
              description: 'Descripción del grupo de test (opcional)'
            }
          },
          required: ['testGroupName', 'testDirectory', 'businessLine']
        }
      },
      {
        name: 'add-foxpro-test-method',
        description: 'Agrega un nuevo método de test a un archivo FoxPro existente',
        inputSchema: {
          type: 'object',
          properties: {
            testFileName: {
              type: 'string',
              description: 'Nombre del archivo .prg donde agregar el método'
            },
            methodName: {
              type: 'string',
              description: 'Nombre del método de test (ej: zTestU_ValidarTotalFactura)'
            },
            testDirectory: {
              type: 'string',
              description: 'Directorio donde está ubicado el archivo de test'
            },
            businessLine: {
              type: 'string',
              enum: [...BUSINESS_LINES],
              description: 'Línea de negocio'
            },
            description: {
              type: 'string',
              description: 'Descripción del método de test (opcional)'
            }
          },
          required: ['testFileName', 'methodName', 'testDirectory', 'businessLine']
        }
      },
      {
        name: 'get-knowledge-statistics',
        description: 'Obtiene estadísticas del repositorio de conocimiento',
        inputSchema: {
          type: 'object',
          properties: {
            businessLine: {
              type: 'string',
              enum: [...BUSINESS_LINES],
              description: 'Línea de negocio'
            }
          },
          required: ['businessLine']
        }
      }
    ];
  }

  /**
   * Ejecuta una herramienta específica
   */
  async executeTool(request: ToolRequest): Promise<ToolResponse> {
    try {
      switch (request.name) {
        case 'detect-business-line':
          return await this.detectBusinessLine(request.arguments);

        case 'analyze-solution-structure':
          return await this.analyzeSolutionStructure(request.arguments);

        case 'get-promptops-summary':
          return await this.getPromptOpsSummary(request.arguments);
        
        case 'get-context-prompt':
          return await this.getContextPrompt(request.arguments);
        
        case 'search-knowledge':
          return await this.searchKnowledge(request.arguments);
        
        case 'get-best-practices':
          return await this.getBestPractices(request.arguments);
        
        case 'get-architectural-patterns':
          return await this.getArchitecturalPatterns(request.arguments);
        
        case 'validate-code-standards':
          return await this.validateCodeStandards(request.arguments);
        
        case 'get-specific-prompt':
          return await this.getSpecificPrompt(request.arguments);
        
        case 'get-knowledge-statistics':
          return await this.getKnowledgeStatistics(request.arguments);
        
        case 'generate-test-structure':
          return await this.generateTestStructure(request.arguments);
        
        case 'generate-lambda-function':
          return await this.generateLambdaFunction(request.arguments);
        
        case 'create-foxpro-test-group':
          return await this.createFoxProTestGroup(request.arguments);
        
        case 'add-foxpro-test-method':
          return await this.addFoxProTestMethod(request.arguments);
        
        default:
          throw new Error(`Unknown tool: ${request.name}`);
      }
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error executing tool ${request.name}: ${error instanceof Error ? error.message : String(error)}`
        }]
      };
    }
  }

  /**
   * Detecta la línea de negocio del proyecto
   */
  private async detectBusinessLine(args: any): Promise<ToolResponse> {
    const { projectPath } = args;
    
    if (!projectPath) {
      throw new Error('projectPath is required');
    }

    const context = await this.contextDetector.detectContext(projectPath);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          businessLine: context.businessLine,
          confidence: context.confidence,
          technologies: context.technologies,
          projectPath: context.projectPath,
          recommendations: this.getDetectionRecommendations(context)
        }, null, 2)
      }]
    };
  }

  /**
   * Analiza la estructura general de una solución o proyecto.
   */
  private async analyzeSolutionStructure(args: any): Promise<ToolResponse> {
    const { projectPath } = args;

    if (!projectPath) {
      throw new Error('projectPath is required');
    }

    const context = await this.contextDetector.detectContext(projectPath);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          projectPath,
          businessLine: context.businessLine,
          solutionName: context.solutionName,
          solutionType: context.solutionType,
          solutionRole: context.solutionRole,
          confidence: context.confidence,
          technologies: context.technologies,
          detectedPatterns: context.detectedPatterns,
          relatedSolutions: context.relatedSolutions,
          dependencySummary: context.dependencySummary
        }, null, 2)
      }]
    };
  }

  /**
   * Resume PromptOps para una solución.
   */
  private async getPromptOpsSummary(args: any): Promise<ToolResponse> {
    const { projectPath } = args;

    if (!projectPath) {
      throw new Error('projectPath is required');
    }

    const context = await this.contextDetector.detectContext(projectPath);
    const promptOpsSummary = await this.contextDetector.summarizePromptOps(projectPath);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          projectPath,
          businessLine: context.businessLine,
          solutionName: context.solutionName,
          solutionRole: context.solutionRole,
          promptOps: promptOpsSummary,
          recommendation: this.getPromptOpsRecommendation(context.solutionName, promptOpsSummary.hasPromptOps)
        }, null, 2)
      }]
    };
  }

  /**
   * Obtiene el prompt contextual
   */
  private async getContextPrompt(args: any): Promise<ToolResponse> {
    const { businessLine, projectPath, includeKnowledge = true } = args;
    
    if (!businessLine) {
      throw new Error('businessLine is required');
    }

    let projectContext;
    if (projectPath) {
      projectContext = await this.contextDetector.detectContext(projectPath);
    }

    const contextPrompt = await this.promptsHandler.getContextPrompt(
      businessLine,
      projectContext,
      includeKnowledge
    );

    return {
      content: [{
        type: 'text',
        text: contextPrompt.prompt
      }]
    };
  }

  /**
   * Busca en el repositorio de conocimiento
   */
  private async searchKnowledge(args: any): Promise<ToolResponse> {
    const { businessLine, query, category, limit = 10 } = args;
    
    if (!businessLine || !query) {
      throw new Error('businessLine and query are required');
    }

    const results = await this.knowledgeSearch.search(businessLine, query, category, limit);
    
    const formattedResults = results.items.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      tags: item.tags,
      content: item.content.substring(0, 500) + (item.content.length > 500 ? '...' : ''),
      examples: item.examples
    }));

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          query,
          businessLine,
          totalResults: results.totalCount,
          results: formattedResults
        }, null, 2)
      }]
    };
  }

  /**
   * Obtiene mejores prácticas
   */
  private async getBestPractices(args: any): Promise<ToolResponse> {
    const { businessLine, technology } = args;
    
    if (!businessLine) {
      throw new Error('businessLine is required');
    }

    const practices = await this.knowledgeSearch.getBestPractices(businessLine, technology);
    
    const formattedPractices = practices.map(practice => ({
      title: practice.title,
      description: practice.description,
      tags: practice.tags,
      content: practice.content,
      examples: practice.examples
    }));

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          businessLine,
          technology,
          bestPractices: formattedPractices
        }, null, 2)
      }]
    };
  }

  /**
   * Obtiene patrones arquitectónicos
   */
  private async getArchitecturalPatterns(args: any): Promise<ToolResponse> {
    const { businessLine, projectType } = args;
    
    if (!businessLine) {
      throw new Error('businessLine is required');
    }

    const patterns = await this.knowledgeSearch.getKnowledgeByCategory(businessLine, 'architecture');
    
    let filteredPatterns = patterns;
    if (projectType) {
      filteredPatterns = patterns.filter(pattern => 
        pattern.tags.some(tag => tag.toLowerCase().includes(projectType.toLowerCase())) ||
        pattern.content.toLowerCase().includes(projectType.toLowerCase())
      );
    }

    const formattedPatterns = filteredPatterns.map(pattern => ({
      title: pattern.title,
      description: pattern.description,
      tags: pattern.tags,
      content: pattern.content,
      examples: pattern.examples,
      relatedItems: pattern.relatedItems
    }));

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          businessLine,
          projectType,
          architecturalPatterns: formattedPatterns
        }, null, 2)
      }]
    };
  }

  /**
   * Valida estándares de código
   */
  private async validateCodeStandards(args: any): Promise<ToolResponse> {
    const { businessLine, code, language } = args;
    
    if (!businessLine || !code || !language) {
      throw new Error('businessLine, code, and language are required');
    }

    const standards = await this.knowledgeSearch.getKnowledgeByCategory(businessLine, 'standards');
    const languageStandards = standards.filter(standard => 
      standard.tags.some(tag => tag.toLowerCase().includes(language.toLowerCase()))
    );

    // Aquí podrías implementar validación más sofisticada
    const validationResults = {
      businessLine,
      language,
      codeSnippet: code.substring(0, 200) + (code.length > 200 ? '...' : ''),
      applicableStandards: languageStandards.map(standard => ({
        title: standard.title,
        description: standard.description,
        satisfied: true, // Implementar lógica de validación real
        recommendations: []
      })),
      overallScore: 85, // Implementar cálculo real
      suggestions: [
        'Considera agregar más documentación',
        'Verifica el cumplimiento de naming conventions',
        'Asegúrate de incluir tests unitarios'
      ]
    };

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(validationResults, null, 2)
      }]
    };
  }

  /**
   * Obtiene prompt específico
   */
  private async getSpecificPrompt(args: any): Promise<ToolResponse> {
    const { businessLine, promptType, context } = args;
    
    if (!businessLine || !promptType) {
      throw new Error('businessLine and promptType are required');
    }

    const specificPrompt = await this.promptsHandler.getSpecificPrompt(
      businessLine,
      promptType,
      context
    );

    return {
      content: [{
        type: 'text',
        text: specificPrompt
      }]
    };
  }

  /**
   * Obtiene estadísticas del repositorio
   */
  private async getKnowledgeStatistics(args: any): Promise<ToolResponse> {
    const { businessLine } = args;
    
    if (!businessLine) {
      throw new Error('businessLine is required');
    }

    const stats = await this.knowledgeSearch.getStatistics(businessLine);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          businessLine,
          statistics: stats,
          lastUpdate: new Date().toISOString()
        }, null, 2)
      }]
    };
  }

  /**
   * Genera recomendaciones basadas en la detección de contexto
   */
  private getDetectionRecommendations(context: any): string[] {
    const recommendations: string[] = [];

    if (context.confidence < 0.5) {
      recommendations.push('La confianza de detección es baja. Considera configurar manualmente la línea de negocio.');
    }

    if (context.technologies.length === 0) {
      recommendations.push('No se detectaron tecnologías específicas. Agrega archivos de configuración para mejor detección.');
    }

    if (context.businessLine === 'organic') {
      recommendations.push('Recuerda aplicar principios de sostenibilidad y eficiencia en tu desarrollo.');
    } else if (context.businessLine === 'lince') {
      recommendations.push('Prioriza performance y velocidad de desarrollo en tus implementaciones.');
    } else if (context.businessLine === 'dragon2028') {
      recommendations.push('Verifica dependencias modulares y evita referencias cruzadas entre soluciones base.');
      if (context.dependencySummary?.missingReferences?.length) {
        recommendations.push('Hay dependencias esperadas faltantes en la solución; revisa los AppReferences y el orden de módulos.');
      }
      if (context.dependencySummary?.unexpectedReferences?.length) {
        recommendations.push('Se detectaron referencias inesperadas; evalúa si son deuda de migración o una ruptura de modularidad.');
      }
    }

    return recommendations;
  }

  private getPromptOpsRecommendation(solutionName?: string, hasPromptOps?: boolean): string {
    if (!hasPromptOps) {
      return 'La solución no expone PromptOps local; el MCP debe apoyarse en conocimiento compartido y overlays por solución.';
    }

    if (solutionName === 'Organic.Dragonfish') {
      return 'Usa Dragonfish como baseline de PromptOps compartido, pero mantén overlays por solución para rutas, startup y dependencias.';
    }

    return 'La solución tiene PromptOps local; úsalo como overlay sobre el conocimiento compartido del MCP.';
  }

  /**
   * Genera estructura base de tests
   */
  private async generateTestStructure(args: any): Promise<ToolResponse> {
    const { testName, testFileName, businessLine, technology, testType, framework, targetFile } = args;
    
    if (!testName || !testFileName || !businessLine || !technology || !testType) {
      throw new Error('testName, testFileName, businessLine, technology, and testType are required');
    }

    const testRequest: TestGenerationRequest = {
      testName,
      testFileName,
      businessLine,
      technology,
      testType,
      framework,
      targetFile
    };

    const generatedContent = await this.generateTestContent(testRequest);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          generatedFiles: generatedContent,
          instructions: this.getTestInstructions(testRequest),
          businessLineGuidelines: await this.getBusinessLineTestGuidelines(businessLine)
        }, null, 2)
      }]
    };
  }

  /**
   * Genera función lambda
   */
  private async generateLambdaFunction(args: any): Promise<ToolResponse> {
    const { functionName, parameters, formula, businessLine, runtime, returnType, description } = args;
    
    if (!functionName || !parameters || !formula || !businessLine || !runtime) {
      throw new Error('functionName, parameters, formula, businessLine, and runtime are required');
    }

    const lambdaRequest: LambdaGenerationRequest = {
      functionName,
      parameters,
      formula,
      businessLine,
      runtime,
      returnType,
      description
    };

    const generatedContent = await this.generateLambdaContent(lambdaRequest);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          generatedFiles: generatedContent,
          deploymentInstructions: this.getLambdaDeploymentInstructions(lambdaRequest),
          businessLineGuidelines: await this.getBusinessLineLambdaGuidelines(businessLine)
        }, null, 2)
      }]
    };
  }

  /**
   * Genera el contenido de la estructura de test
   */
  private async generateTestContent(request: TestGenerationRequest): Promise<GeneratedContent[]> {
    const contents: GeneratedContent[] = [];
    
    // Obtener plantilla base desde el repositorio de conocimiento
    const template = await this.getTestTemplate(request.technology, request.testType, request.businessLine);
    
    // Generar archivo principal de test
    const mainTestFile = this.generateMainTestFile(request, template);
    contents.push(mainTestFile);
    
    // Generar archivos de configuración si es necesario
    const configFiles = await this.generateTestConfigFiles(request);
    contents.push(...configFiles);
    
    return contents;
  }

  /**
   * Genera el contenido de la función lambda
   */
  private async generateLambdaContent(request: LambdaGenerationRequest): Promise<GeneratedContent[]> {
    const contents: GeneratedContent[] = [];
    
    // Obtener plantilla base desde el repositorio de conocimiento
    const template = await this.getLambdaTemplate(request.runtime, request.businessLine);
    
    // Generar función principal
    const mainFunction = this.generateMainLambdaFile(request, template);
    contents.push(mainFunction);
    
    // Generar archivos de configuración y despliegue
    const deploymentFiles = await this.generateLambdaDeploymentFiles(request);
    contents.push(...deploymentFiles);
    
    return contents;
  }

  /**
   * Obtiene plantilla de test desde el repositorio de conocimiento
   */
  private async getTestTemplate(technology: string, testType: string, businessLine: BusinessLine): Promise<string> {
    const searchQuery = `test template ${technology} ${testType}`;
    const results = await this.knowledgeSearch.search(businessLine, searchQuery, 'templates', 1);
    
    if (results.items.length > 0 && results.items[0].examples) {
      const example = results.items[0].examples.find(ex => ex.title.toLowerCase().includes('template'));
      if (example) {
        return example.code;
      }
    }
    
    // Plantilla por defecto si no se encuentra específica
    return this.getDefaultTestTemplate(technology, testType);
  }

  /**
   * Obtiene plantilla de lambda desde el repositorio de conocimiento
   */
  private async getLambdaTemplate(runtime: string, businessLine: BusinessLine): Promise<string> {
    const searchQuery = `lambda template ${runtime}`;
    const results = await this.knowledgeSearch.search(businessLine, searchQuery, 'templates', 1);
    
    if (results.items.length > 0 && results.items[0].examples) {
      const example = results.items[0].examples.find(ex => ex.title.toLowerCase().includes('lambda'));
      if (example) {
        return example.code;
      }
    }
    
    // Plantilla por defecto si no se encuentra específica
    return this.getDefaultLambdaTemplate(runtime);
  }

  /**
   * Genera el archivo principal de test
   */
  private generateMainTestFile(request: TestGenerationRequest, template: string): GeneratedContent {
    let content = template;
    
    // Reemplazar placeholders en la plantilla
    content = content.replace(/\{\{TEST_NAME\}\}/g, request.testName);
    content = content.replace(/\{\{TEST_FILE_NAME\}\}/g, request.testFileName);
    content = content.replace(/\{\{BUSINESS_LINE\}\}/g, request.businessLine.toUpperCase());
    
    if (request.targetFile) {
      content = content.replace(/\{\{TARGET_FILE\}\}/g, request.targetFile);
    }
    
    const language = this.getLanguageFromTechnology(request.technology);
    const fileName = this.getTestFileName(request.testFileName, request.testType, language);
    
    return {
      fileName,
      content,
      language,
      dependencies: this.getTestDependencies(request),
      instructions: [`Generated ${request.testType} test for ${request.technology}`]
    };
  }

  /**
   * Genera el archivo principal de la función lambda
   */
  private generateMainLambdaFile(request: LambdaGenerationRequest, template: string): GeneratedContent {
    let content = template;
    
    // Reemplazar placeholders en la plantilla
    content = content.replace(/\{\{FUNCTION_NAME\}\}/g, request.functionName);
    content = content.replace(/\{\{BUSINESS_LINE\}\}/g, request.businessLine.toUpperCase());
    content = content.replace(/\{\{DESCRIPTION\}\}/g, request.description || 'Generated lambda function');
    content = content.replace(/\{\{FORMULA\}\}/g, request.formula);
    
    // Generar parámetros
    const parametersCode = this.generateParametersCode(request.parameters, request.runtime);
    content = content.replace(/\{\{PARAMETERS\}\}/g, parametersCode);
    
    // Generar validaciones
    const validationsCode = this.generateValidationsCode(request.parameters, request.runtime);
    content = content.replace(/\{\{VALIDATIONS\}\}/g, validationsCode);
    
    const language = this.getRuntimeLanguage(request.runtime);
    const fileName = this.getLambdaFileName(request.functionName, request.runtime);
    
    return {
      fileName,
      content,
      language,
      dependencies: this.getLambdaDependencies(request),
      instructions: [`Generated lambda function for ${request.runtime} runtime`]
    };
  }

  /**
   * Métodos auxiliares para obtener plantillas por defecto, generar nombres de archivos, etc.
   */
  private getDefaultTestTemplate(technology: string, testType: string): string {
    // Plantillas por defecto básicas
    const templates: Record<string, Record<string, string>> = {
      'javascript': {
        'unit': `// {{BUSINESS_LINE}} - {{TEST_NAME}} Unit Tests
const { {{FUNCTION_NAME}} } = require('{{TARGET_FILE}}');

describe('{{TEST_NAME}}', () => {
  test('should pass basic test', () => {
    // Arrange
    const expected = true;
    
    // Act
    const result = true;
    
    // Assert
    expect(result).toBe(expected);
  });
});`,
        'integration': `// {{BUSINESS_LINE}} - {{TEST_NAME}} Integration Tests
const request = require('supertest');
const app = require('{{TARGET_FILE}}');

describe('{{TEST_NAME}} Integration', () => {
  test('should handle integration scenario', async () => {
    const response = await request(app)
      .get('/api/test')
      .expect(200);
    
    expect(response.body).toBeDefined();
  });
});`,
        'e2e': `// {{BUSINESS_LINE}} - {{TEST_NAME}} E2E Tests
const { test, expect } = require('@playwright/test');

test.describe('{{TEST_NAME}} E2E', () => {
  test('should complete end-to-end flow', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/{{TEST_NAME}}/);
  });
});`
      },
      'python': {
        'unit': `# {{BUSINESS_LINE}} - {{TEST_NAME}} Unit Tests
import unittest
from {{TARGET_FILE}} import {{FUNCTION_NAME}}

class Test{{TEST_NAME}}(unittest.TestCase):
    def test_basic_functionality(self):
        """Test basic functionality"""
        # Arrange
        expected = True
        
        # Act
        result = True
        
        # Assert
        self.assertEqual(result, expected)

if __name__ == '__main__':
    unittest.main()`
      }
    };
    
    const lang = this.getLanguageFromTechnology(technology);
    return templates[lang]?.[testType] || templates['javascript'][testType];
  }

  private getDefaultLambdaTemplate(runtime: string): string {
    const templates: Record<string, string> = {
      'nodejs': `// {{BUSINESS_LINE}} Lambda Function: {{FUNCTION_NAME}}
// {{DESCRIPTION}}

exports.handler = async (event) => {
    try {
        // Extract parameters
        {{PARAMETERS}}
        
        // Validate inputs
        {{VALIDATIONS}}
        
        // Apply formula/logic
        const result = {{FORMULA}};
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                result: result,
                timestamp: new Date().toISOString()
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};`,
      'python': `# {{BUSINESS_LINE}} Lambda Function: {{FUNCTION_NAME}}
# {{DESCRIPTION}}

import json
import datetime

def lambda_handler(event, context):
    try:
        # Extract parameters
        {{PARAMETERS}}
        
        # Validate inputs
        {{VALIDATIONS}}
        
        # Apply formula/logic
        result = {{FORMULA}}
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'result': result,
                'timestamp': datetime.datetime.now().isoformat()
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'success': False,
                'error': str(e),
                'timestamp': datetime.datetime.now().isoformat()
            })
        }`
    };
    
    return templates[runtime] || templates['nodejs'];
  }

  // Métodos auxiliares adicionales
  private getLanguageFromTechnology(technology: string): string {
    const mapping: Record<string, string> = {
      'javascript': 'javascript',
      'typescript': 'typescript',
      'react': 'javascript',
      'node.js': 'javascript',
      'nodejs': 'javascript',
      'python': 'python',
      'java': 'java',
      'c#': 'csharp',
      'csharp': 'csharp'
    };
    return mapping[technology.toLowerCase()] || 'javascript';
  }

  private getRuntimeLanguage(runtime: string): string {
    const mapping: Record<string, string> = {
      'nodejs': 'javascript',
      'python': 'python',
      'java': 'java',
      'csharp': 'csharp'
    };
    return mapping[runtime] || 'javascript';
  }

  private getTestFileName(testFileName: string, testType: string, language: string): string {
    const extensions: Record<string, string> = {
      'javascript': '.test.js',
      'typescript': '.test.ts',
      'python': '_test.py',
      'java': 'Test.java'
    };
    
    const baseName = testFileName.replace(/\.(js|ts|py|java)$/, '');
    return `${baseName}.${testType}${extensions[language] || '.test.js'}`;
  }

  private getLambdaFileName(functionName: string, runtime: string): string {
    const extensions: Record<string, string> = {
      'nodejs': '.js',
      'python': '.py',
      'java': '.java',
      'csharp': '.cs'
    };
    
    return `${functionName}${extensions[runtime] || '.js'}`;
  }

  private generateParametersCode(parameters: any[], runtime: string): string {
    if (runtime === 'nodejs') {
      return parameters.map(p => `const ${p.name} = event.${p.name}${!p.required ? ` || ${JSON.stringify(p.defaultValue)}` : ''};`).join('\n        ');
    } else if (runtime === 'python') {
      return parameters.map(p => `${p.name} = event.get('${p.name}'${!p.required ? `, ${JSON.stringify(p.defaultValue)}` : ''})`).join('\n        ');
    }
    return '';
  }

  private generateValidationsCode(parameters: any[], runtime: string): string {
    const requiredParams = parameters.filter(p => p.required);
    if (requiredParams.length === 0) return '';
    
    if (runtime === 'nodejs') {
      const validations = requiredParams.map(p => 
        `if (${p.name} === undefined || ${p.name} === null) throw new Error('${p.name} is required');`
      );
      return validations.join('\n        ');
    } else if (runtime === 'python') {
      const validations = requiredParams.map(p => 
        `if ${p.name} is None: raise ValueError('${p.name} is required')`
      );
      return validations.join('\n        ');
    }
    return '';
  }

  private getTestDependencies(request: TestGenerationRequest): string[] {
    const deps: Record<string, Record<string, string[]>> = {
      'javascript': {
        'unit': ['jest'],
        'integration': ['supertest', 'jest'],
        'e2e': ['@playwright/test']
      },
      'python': {
        'unit': ['unittest'],
        'integration': ['pytest', 'requests'],
        'e2e': ['selenium']
      }
    };
    
    const lang = this.getLanguageFromTechnology(request.technology);
    return deps[lang]?.[request.testType] || [];
  }

  private getLambdaDependencies(request: LambdaGenerationRequest): string[] {
    const deps: Record<string, string[]> = {
      'nodejs': ['aws-lambda'],
      'python': ['boto3'],
      'java': ['aws-lambda-java-core'],
      'csharp': ['Amazon.Lambda.Core']
    };
    
    return deps[request.runtime] || [];
  }

  private async generateTestConfigFiles(_request: TestGenerationRequest): Promise<GeneratedContent[]> {
    // Generar archivos de configuración específicos para el tipo de test
    return [];
  }

  private async generateLambdaDeploymentFiles(_request: LambdaGenerationRequest): Promise<GeneratedContent[]> {
    // Generar template.yaml, serverless.yml, etc.
    return [];
  }

  private getTestInstructions(request: TestGenerationRequest): string[] {
    return [
      `1. Install dependencies: ${this.getTestDependencies(request).join(', ')}`,
      `2. Run tests: npm test (for JS) or pytest (for Python)`,
      `3. Follow ${request.businessLine.toUpperCase()} testing guidelines`,
      `4. Ensure ${request.testType} test coverage meets standards`
    ];
  }

  private getLambdaDeploymentInstructions(request: LambdaGenerationRequest): string[] {
    return [
      `1. Install dependencies: ${this.getLambdaDependencies(request).join(', ')}`,
      `2. Test locally before deployment`,
      `3. Deploy using AWS CLI, SAM, or Serverless Framework`,
      `4. Follow ${request.businessLine.toUpperCase()} lambda deployment guidelines`,
      `5. Set up monitoring and logging`
    ];
  }

  private async getBusinessLineTestGuidelines(businessLine: BusinessLine): Promise<string[]> {
    const guidelines = await this.knowledgeSearch.search(businessLine, 'testing guidelines', 'best-practices', 5);
    return guidelines.items.map(item => item.description);
  }

  private async getBusinessLineLambdaGuidelines(businessLine: BusinessLine): Promise<string[]> {
    const guidelines = await this.knowledgeSearch.search(businessLine, 'lambda serverless guidelines', 'best-practices', 5);
    return guidelines.items.map(item => item.description);
  }

  /**
   * Crea un nuevo grupo de test FoxPro
   */
  private async createFoxProTestGroup(args: any): Promise<ToolResponse> {
    const { testGroupName, testDirectory, businessLine, description } = args;
    
    if (!testGroupName || !testDirectory || !businessLine) {
      throw new Error('testGroupName, testDirectory, and businessLine are required');
    }

    const request: FoxProTestGroupRequest = {
      testGroupName,
      testDirectory,
      businessLine,
      description
    };

    const generatedContent = await this.generateFoxProTestGroup(request);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          generatedFiles: generatedContent,
          instructions: this.getFoxProTestInstructions(request),
          businessLineGuidelines: await this.getBusinessLineFoxProGuidelines(businessLine)
        }, null, 2)
      }]
    };
  }

  /**
   * Agrega un método de test a un archivo FoxPro existente
   */
  private async addFoxProTestMethod(args: any): Promise<ToolResponse> {
    const { testFileName, methodName, testDirectory, businessLine, description } = args;
    
    if (!testFileName || !methodName || !testDirectory || !businessLine) {
      throw new Error('testFileName, methodName, testDirectory, and businessLine are required');
    }

    const request: FoxProTestMethodRequest = {
      testFileName,
      methodName,
      testDirectory,
      businessLine,
      description
    };

    const generatedContent = await this.generateFoxProTestMethod(request);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          generatedContent: generatedContent,
          instructions: this.getFoxProMethodInstructions(request),
          businessLineGuidelines: await this.getBusinessLineFoxProGuidelines(businessLine)
        }, null, 2)
      }]
    };
  }

  /**
   * Genera el contenido del grupo de test FoxPro
   */
  private async generateFoxProTestGroup(request: FoxProTestGroupRequest): Promise<GeneratedContent[]> {
    const contents: GeneratedContent[] = [];
    
    // Crear contenido del archivo .prg principal
    const testFileContent = this.generateFoxProTestFileContent(request);
    contents.push(testFileContent);
    
    // Generar instrucciones para crear la estructura de directorios
    const directoryInstructions = this.generateDirectoryStructure(request);
    contents.push(directoryInstructions);
    
    return contents;
  }

  /**
   * Genera el método de test FoxPro
   */
  private async generateFoxProTestMethod(request: FoxProTestMethodRequest): Promise<GeneratedContent> {
    const methodContent = this.generateFoxProMethodContent(request);
    return methodContent;
  }

  /**
   * Genera el contenido del archivo .prg principal
   */
  private generateFoxProTestFileContent(request: FoxProTestGroupRequest): GeneratedContent {
    const { testGroupName, businessLine, description } = request;
    
    const content = `**********************************************************************
* ${businessLine.toUpperCase()} Test Group: ${testGroupName}
* ${description || 'Test group for ' + testGroupName}
* Generated by Zoo Logic MCP
**********************************************************************

Define Class ${testGroupName} as FxuTestCase OF FxuTestCase.prg

	#IF .f.
	Local this as ${testGroupName} of ${testGroupName}.prg
	#ENDIF
	
	*---------------------------------
	* Setup method - Initialize test environment
	Function Setup
		* ${businessLine.toUpperCase()} specific configuration
		${this.getFoxProSetupByBusinessLine(businessLine)}
	EndFunc
	
	*---------------------------------
	* TearDown method - Clean up test environment  
	Function TearDown
		* Clean up resources after tests
		${this.getFoxProTearDownByBusinessLine(businessLine)}
	endfunc	

enddefine
`;

    return {
      fileName: `${testGroupName}.prg`,
      content,
      language: 'foxpro',
      instructions: [
        `1. Create test/ directory in ${request.testDirectory}`,
        `2. Save file as test/${testGroupName}.prg`,
        `3. Ensure FxuTestCase.prg is accessible`,
        `4. Follow ${businessLine.toUpperCase()} testing standards`
      ]
    };
  }

  /**
   * Genera el contenido del método de test
   */
  private generateFoxProMethodContent(request: FoxProTestMethodRequest): GeneratedContent {
    const { methodName, businessLine, description } = request;
    
    const content = `
	*-----------------------------------------------------------------------------------------
	* ${description || methodName}
	* ${businessLine.toUpperCase()} Test Method
	Function ${methodName}
		
		* Arrange (Preparar)
		* ${this.getFoxProArrangeComment(businessLine)}
		
		* Act (Actuar)
		* ${this.getFoxProActComment(businessLine)}
		
		* Assert (Afirmar)
		* ${this.getFoxProAssertComment(businessLine)}
		
	endfunc
`;

    return {
      fileName: request.testFileName,
      content,
      language: 'foxpro',
      instructions: [
        `1. Add this method to ${request.testFileName}`,
        `2. Insert before the final "enddefine"`,
        `3. Implement the Arrange, Act, Assert sections`,
        `4. Follow ${businessLine.toUpperCase()} testing patterns`
      ]
    };
  }

  /**
   * Genera las instrucciones de estructura de directorios
   */
  private generateDirectoryStructure(request: FoxProTestGroupRequest): GeneratedContent {
    const content = `# Directory Structure Instructions

## Create the following structure:

\`\`\`
${request.testDirectory}/
└── test/
    └── ${request.testGroupName}.prg
\`\`\`

## Commands to create structure:
- Windows: \`mkdir "${request.testDirectory}\\test"\`
- Linux/Mac: \`mkdir -p "${request.testDirectory}/test"\`

## Business Line: ${request.businessLine.toUpperCase()}
${request.businessLine === 'organic' ? 
  '- Focus on sustainable and maintainable test structure' : 
  '- Focus on high-performance and agile test structure'
}
`;

    return {
      fileName: 'directory-structure.md',
      content,
      language: 'markdown',
      instructions: ['Follow the directory structure instructions']
    };
  }

  /**
   * Obtiene configuración de Setup específica por línea de negocio
   */
  private getFoxProSetupByBusinessLine(businessLine: BusinessLine): string {
    if (businessLine === 'organic') {
      return `goParametros.Felino.GestionDeVentas.ControlDeSaldosNegativosDeCaja = 1
		goParametros.Felino.Sugerencias.CodigoDeValorSugeridoParaVuelto = "0"
		goParametros.Felino.Sugerencias.CodigoValorUtilizadoAlFinalizarElComprobante = ""
		* ORGANIC: Configuración sostenible y eficiente`;
    } else {
      return `goParametros.Lince.Performance.OptimizacionConsultas = 1
		goParametros.Lince.Cache.HabilitarCacheRapido = .T.
		goParametros.Lince.Velocidad.ModoAltaVelocidad = .T.
		* LINCE: Configuración de alta performance`;
    }
  }

  /**
   * Obtiene configuración de TearDown específica por línea de negocio
   */
  private getFoxProTearDownByBusinessLine(businessLine: BusinessLine): string {
    if (businessLine === 'organic') {
      return `* ORGANIC: Limpieza eficiente de recursos
		* Cerrar conexiones de manera sostenible
		* Liberar memoria de forma responsable`;
    } else {
      return `* LINCE: Limpieza rápida y eficiente
		* Optimizar liberación de recursos
		* Mantener alta velocidad en cleanup`;
    }
  }

  /**
   * Obtiene comentarios de Arrange específicos por línea de negocio
   */
  private getFoxProArrangeComment(businessLine: BusinessLine): string {
    if (businessLine === 'organic') {
      return 'Preparar datos de prueba de manera sostenible y eficiente';
    } else {
      return 'Preparar datos de prueba optimizando para velocidad';
    }
  }

  /**
   * Obtiene comentarios de Act específicos por línea de negocio
   */
  private getFoxProActComment(businessLine: BusinessLine): string {
    if (businessLine === 'organic') {
      return 'Ejecutar la funcionalidad con impacto mínimo en recursos';
    } else {
      return 'Ejecutar la funcionalidad con máximo rendimiento';
    }
  }

  /**
   * Obtiene comentarios de Assert específicos por línea de negocio
   */
  private getFoxProAssertComment(businessLine: BusinessLine): string {
    if (businessLine === 'organic') {
      return 'Validar resultados con verificaciones sostenibles y completas';
    } else {
      return 'Validar resultados con verificaciones rápidas y precisas';
    }
  }

  /**
   * Obtiene instrucciones específicas para tests FoxPro
   */
  private getFoxProTestInstructions(request: FoxProTestGroupRequest): string[] {
    const baseInstructions = [
      '1. Create test/ directory in the specified location',
      '2. Save the generated .prg file in the test/ directory',
      '3. Ensure FxuTestCase.prg is accessible in the project',
      '4. Run tests using FoxUnit framework',
      '5. Follow coding standards for ' + request.businessLine.toUpperCase()
    ];

    if (request.businessLine === 'organic') {
      baseInstructions.push('6. Implement sustainable testing practices');
      baseInstructions.push('7. Optimize resource usage in tests');
    } else {
      baseInstructions.push('6. Implement high-performance testing practices');
      baseInstructions.push('7. Optimize execution speed in tests');
    }

    return baseInstructions;
  }

  /**
   * Obtiene instrucciones específicas para métodos FoxPro
   */
  private getFoxProMethodInstructions(request: FoxProTestMethodRequest): string[] {
    return [
      '1. Open the target .prg file in your FoxPro editor',
      '2. Locate the position before the final "enddefine"',
      '3. Insert the generated method code',
      '4. Implement the Arrange, Act, Assert sections',
      '5. Follow AAA pattern for ' + request.businessLine.toUpperCase(),
      '6. Test the method before committing changes'
    ];
  }

  /**
   * Obtiene guías específicas de FoxPro por línea de negocio
   */
  private async getBusinessLineFoxProGuidelines(businessLine: BusinessLine): Promise<string[]> {
    const guidelines = await this.knowledgeSearch.search(businessLine, 'foxpro testing guidelines', 'best-practices', 5);
    
    // Si no hay guías específicas, proporcionar guías por defecto
    if (guidelines.items.length === 0) {
      if (businessLine === 'organic') {
        return [
          'Use descriptive test method names with zTestU_ prefix',
          'Implement sustainable resource management in tests', 
          'Focus on maintainable and clear test code',
          'Minimize environmental impact of test execution',
          'Ensure comprehensive but efficient test coverage'
        ];
      } else {
        return [
          'Use descriptive test method names with zTestU_ prefix',
          'Optimize test execution for maximum speed',
          'Implement performance benchmarks in tests',
          'Focus on rapid feedback and agile development',
          'Ensure tests run efficiently in CI/CD pipelines'
        ];
      }
    }
    
    return guidelines.items.map(item => item.description);
  }
}
