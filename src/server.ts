import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { ContextDetector } from './utils/context-detector';
import { KnowledgeSearch } from './utils/knowledge-search';
import { ToolsHandler } from './handlers/tools';
import { ResourcesHandler } from './handlers/resources';
import { PromptsHandler } from './handlers/prompts';
import { BUSINESS_LINES, BusinessLine, MCPConfig } from './types';

/**
 * Servidor MCP para el repositorio de conocimiento corporativo Zoo Logic.
 */
class OrganicMCPServer {
  private server: Server;
  private contextDetector: ContextDetector;
  private knowledgeSearch: KnowledgeSearch;
  private toolsHandler: ToolsHandler;
  private resourcesHandler: ResourcesHandler;
  private promptsHandler: PromptsHandler;
  private config: MCPConfig;

  constructor() {
    // Configuración por defecto
    this.config = {
      server: {
        name: 'zoocode-mcp-organic',
        version: '1.0.0',
        port: 3000
      },
      knowledge: {
        basePath: process.env.KNOWLEDGE_BASE_PATH || './src/knowledge',
        indexingEnabled: true,
        cacheTimeout: 300000 // 5 minutos
      },
      detection: {
        rules: [],
        defaultBusinessLine: (process.env.DEFAULT_BUSINESS_LINE as BusinessLine) || 'organic'
      },
      logging: {
        level: (process.env.LOG_LEVEL as any) || 'info',
        file: process.env.LOG_FILE
      }
    };

    // Inicializar componentes
    this.contextDetector = new ContextDetector();
    this.knowledgeSearch = new KnowledgeSearch(this.config.knowledge.basePath);
    this.promptsHandler = new PromptsHandler(this.knowledgeSearch);
    this.toolsHandler = new ToolsHandler(
      this.contextDetector,
      this.knowledgeSearch,
      this.promptsHandler
    );
    this.resourcesHandler = new ResourcesHandler(
      this.knowledgeSearch,
      this.contextDetector
    );

    // Crear servidor MCP
    this.server = new Server(
      {
        name: this.config.server.name,
        version: this.config.server.version,
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    this.setupHandlers();
  }

  /**
   * Configura los manejadores del servidor MCP
   */
  private setupHandlers(): void {
    // Manejador de herramientas
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = this.toolsHandler.getAvailableTools();
      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const toolRequest = {
          name: request.params.name,
          arguments: request.params.arguments || {}
        };
        
        const result = await this.toolsHandler.executeTool(toolRequest);
        return {
          content: result.content
        };
      } catch (error) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error executing tool: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    });

    // Manejador de recursos
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      const resources = await this.resourcesHandler.listResources();
      return { resources };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      const resource = await this.resourcesHandler.getResource(uri);
      
      return {
        contents: [
          {
            uri,
            mimeType: resource.mimeType,
            text: resource.content,
          },
        ],
      };
    });

    // Manejador de prompts
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      const prompts = this.promptsHandler.getAvailablePrompts();
      return { prompts };
    });

    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      // Determinar línea de negocio
      let businessLine: BusinessLine = this.config.detection.defaultBusinessLine;
      let projectContext;
      if (args?.businessLine) {
        businessLine = args.businessLine as BusinessLine;
      } else if (args?.projectPath) {
        projectContext = await this.contextDetector.detectContext(args.projectPath);
        businessLine = projectContext.businessLine;
      }

      let prompt: string;
      
      switch (name) {
        case 'context-prompt':
          const includeKnowledge = args?.includeKnowledge !== 'false';
          const contextPrompt = await this.promptsHandler.getContextPrompt(
            businessLine,
            projectContext,
            includeKnowledge
          );
          prompt = contextPrompt.prompt;
          break;
          
        case 'architecture-prompt':
        case 'debugging-prompt':
        case 'testing-prompt':
        case 'security-prompt':
        case 'performance-prompt':
        case 'test-generation-prompt':
        case 'lambda-generation-prompt':
          const promptType = name.replace('-prompt', '') as any;
          prompt = await this.promptsHandler.getSpecificPrompt(
            businessLine,
            promptType,
            args?.context
          );
          break;
          
        default:
          throw new Error(`Unknown prompt: ${name}`);
      }

      return {
        description: `Prompt contextual para ${businessLine}`,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: prompt,
            },
          },
        ],
      };
    });

    // Manejador de errores
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Inicia el servidor MCP
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error(`Servidor MCP Organic iniciado - ${this.config.server.name} v${this.config.server.version}`);
    console.error(`Base de conocimiento: ${this.config.knowledge.basePath}`);
    console.error(`Línea de negocio por defecto: ${this.config.detection.defaultBusinessLine}`);
  }

  /**
   * Detiene el servidor MCP
   */
  async stop(): Promise<void> {
    await this.server.close();
  }

  /**
   * Actualiza la configuración del servidor
   */
  updateConfig(newConfig: Partial<MCPConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Reinicializar componentes si es necesario
    if (newConfig.knowledge?.basePath) {
      this.knowledgeSearch = new KnowledgeSearch(newConfig.knowledge.basePath);
      this.resourcesHandler = new ResourcesHandler(
        this.knowledgeSearch,
        this.contextDetector
      );
    }
  }

  /**
   * Obtiene información del estado del servidor
   */
  getServerInfo(): {
    config: MCPConfig;
    uptime: number;
    businessLines: BusinessLine[];
    stats: {
      tools: number;
      resources: number;
      prompts: number;
    };
  } {
    return {
      config: this.config,
      uptime: process.uptime(),
      businessLines: [...BUSINESS_LINES],
      stats: {
        tools: this.toolsHandler.getAvailableTools().length,
        resources: 0, // Se calculará dinámicamente
        prompts: this.promptsHandler.getAvailablePrompts().length
      }
    };
  }

  /**
   * Invalida el cache del repositorio de conocimiento
   */
  invalidateKnowledgeCache(businessLine?: BusinessLine): void {
    this.knowledgeSearch.invalidateCache(businessLine);
  }

  /**
   * Agrega una regla personalizada de detección
   */
  addDetectionRule(rule: any): void {
    this.contextDetector.addDetectionRule(rule);
  }
}

// Función principal para ejecutar el servidor
async function main(): Promise<void> {
  const server = new OrganicMCPServer();
  
  try {
    await server.start();
  } catch (error) {
    console.error('Error starting MCP server:', error);
    process.exit(1);
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { OrganicMCPServer };
