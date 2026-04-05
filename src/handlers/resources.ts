import {
  BUSINESS_LINES,
  BusinessLine,
  KNOWLEDGE_CATEGORIES,
  ResourceInfo
} from '../types';
import { KnowledgeSearch } from '../utils/knowledge-search';
import { ContextDetector } from '../utils/context-detector';

/**
 * Manejador de recursos MCP para exponer el repositorio de conocimiento.
 */
export class ResourcesHandler {
  private knowledgeSearch: KnowledgeSearch;
  private contextDetector: ContextDetector;

  constructor(knowledgeSearch: KnowledgeSearch, contextDetector: ContextDetector) {
    this.knowledgeSearch = knowledgeSearch;
    this.contextDetector = contextDetector;
  }

  /**
   * Lista todos los recursos disponibles.
   */
  async listResources(): Promise<ResourceInfo[]> {
    const resources: ResourceInfo[] = [];

    for (const businessLine of BUSINESS_LINES) {
      for (const category of KNOWLEDGE_CATEGORIES) {
        resources.push({
          uri: `knowledge://${businessLine}/${category}`,
          name: `${businessLine.toUpperCase()} - ${category}`,
          description: `Repositorio de ${category} para la línea de negocio ${businessLine}`,
          mimeType: 'application/json'
        });
      }

      resources.push({
        uri: `knowledge://${businessLine}/statistics`,
        name: `${businessLine.toUpperCase()} - Statistics`,
        description: `Estadísticas del repositorio de conocimiento ${businessLine}`,
        mimeType: 'application/json'
      });

      resources.push({
        uri: `knowledge://${businessLine}/index`,
        name: `${businessLine.toUpperCase()} - Full Index`,
        description: `Índice completo del repositorio de conocimiento ${businessLine}`,
        mimeType: 'application/json'
      });

      resources.push({
        uri: `templates://${businessLine}/test-templates`,
        name: `${businessLine.toUpperCase()} - Test Templates`,
        description: `Plantillas de test para la línea de negocio ${businessLine}`,
        mimeType: 'text/markdown'
      });

      resources.push({
        uri: `templates://${businessLine}/lambda-templates`,
        name: `${businessLine.toUpperCase()} - Lambda Templates`,
        description: `Plantillas de funciones auxiliares para la línea de negocio ${businessLine}`,
        mimeType: 'text/markdown'
      });
    }

    resources.push({
      uri: 'knowledge://global/comparison',
      name: 'Business Lines Comparison',
      description: 'Comparación entre las líneas de negocio Organic, Lince y Dragon 2028',
      mimeType: 'application/json'
    });

    resources.push({
      uri: 'knowledge://global/detection-rules',
      name: 'Detection Rules',
      description: 'Reglas de detección automática de líneas de negocio y soluciones',
      mimeType: 'application/json'
    });

    return resources;
  }

  /**
   * Obtiene el contenido de un recurso específico.
   */
  async getResource(uri: string): Promise<{ content: string; mimeType: string }> {
    const parsedUri = this.parseResourceUri(uri);

    switch (parsedUri.type) {
      case 'category':
        return this.getCategoryResource(parsedUri.businessLine!, parsedUri.category!);
      case 'statistics':
        return this.getStatisticsResource(parsedUri.businessLine!);
      case 'index':
        return this.getIndexResource(parsedUri.businessLine!);
      case 'comparison':
        return this.getComparisonResource();
      case 'detection-rules':
        return this.getDetectionRulesResource();
      case 'item':
        return this.getKnowledgeItemResource(parsedUri.businessLine!, parsedUri.itemId!);
      case 'test-templates':
        return this.getTemplatesResource(parsedUri.businessLine!, 'test');
      case 'lambda-templates':
        return this.getTemplatesResource(parsedUri.businessLine!, 'lambda');
      default:
        throw new Error(`Unknown resource type: ${uri}`);
    }
  }

  /**
   * Busca recursos por query.
   */
  async searchResources(query: string): Promise<ResourceInfo[]> {
    const allResources = await this.listResources();
    const lowerQuery = query.toLowerCase();

    return allResources.filter((resource) =>
      resource.name.toLowerCase().includes(lowerQuery) ||
      resource.description?.toLowerCase().includes(lowerQuery) ||
      resource.uri.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Obtiene recursos por línea de negocio.
   */
  async getResourcesByBusinessLine(businessLine: BusinessLine): Promise<ResourceInfo[]> {
    const allResources = await this.listResources();
    return allResources.filter((resource) =>
      resource.uri.includes(`knowledge://${businessLine}/`) ||
      resource.uri.includes(`templates://${businessLine}/`)
    );
  }

  /**
   * Valida si una URI de recurso existe.
   */
  async resourceExists(uri: string): Promise<boolean> {
    try {
      await this.getResource(uri);
      return true;
    } catch (error) {
      return false;
    }
  }

  private parseResourceUri(uri: string): {
    type: 'category' | 'statistics' | 'index' | 'comparison' | 'detection-rules' | 'item' | 'test-templates' | 'lambda-templates';
    businessLine?: BusinessLine;
    category?: string;
    itemId?: string;
  } {
    const templatesMatch = uri.match(/^templates:\/\/([^\/]+)\/([^\/]+)$/);
    if (templatesMatch) {
      const [, businessLine, templateType] = templatesMatch;
      if (templateType === 'test-templates') {
        return { type: 'test-templates', businessLine: businessLine as BusinessLine };
      }
      if (templateType === 'lambda-templates') {
        return { type: 'lambda-templates', businessLine: businessLine as BusinessLine };
      }
    }

    const match = uri.match(/^knowledge:\/\/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?$/);
    if (!match) {
      throw new Error(`Invalid resource URI: ${uri}`);
    }

    const [, namespace, resource, subResource] = match;

    if (namespace === 'global') {
      if (resource === 'comparison') {
        return { type: 'comparison' };
      }
      if (resource === 'detection-rules') {
        return { type: 'detection-rules' };
      }
    }

    const businessLine = namespace as BusinessLine;
    if (resource === 'statistics') {
      return { type: 'statistics', businessLine };
    }
    if (resource === 'index') {
      return { type: 'index', businessLine };
    }
    if (subResource) {
      return { type: 'item', businessLine, itemId: subResource };
    }

    return { type: 'category', businessLine, category: resource };
  }

  private async getCategoryResource(
    businessLine: BusinessLine,
    category: string
  ): Promise<{ content: string; mimeType: string }> {
    const items = await this.knowledgeSearch.getKnowledgeByCategory(businessLine, category);

    return {
      content: JSON.stringify({
        businessLine,
        category,
        totalItems: items.length,
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          source: item.businessLine,
          tags: item.tags,
          uri: `knowledge://${businessLine}/${category}/${item.id}`,
          lastUpdated: item.lastUpdated,
          version: item.version
        })),
        generatedAt: new Date().toISOString()
      }, null, 2),
      mimeType: 'application/json'
    };
  }

  private async getStatisticsResource(
    businessLine: BusinessLine
  ): Promise<{ content: string; mimeType: string }> {
    const stats = await this.knowledgeSearch.getStatistics(businessLine);

    return {
      content: JSON.stringify({
        businessLine,
        ...stats,
        generatedAt: new Date().toISOString()
      }, null, 2),
      mimeType: 'application/json'
    };
  }

  private async getIndexResource(
    businessLine: BusinessLine
  ): Promise<{ content: string; mimeType: string }> {
    const index: {
      businessLine: BusinessLine;
      categories: Record<string, { count: number; items: Array<Record<string, unknown>> }>;
      totalItems: number;
      generatedAt: string;
    } = {
      businessLine,
      categories: {},
      totalItems: 0,
      generatedAt: new Date().toISOString()
    };

    for (const category of KNOWLEDGE_CATEGORIES) {
      const items = await this.knowledgeSearch.getKnowledgeByCategory(businessLine, category);
      index.categories[category] = {
        count: items.length,
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          source: item.businessLine,
          uri: `knowledge://${businessLine}/${category}/${item.id}`,
          tags: item.tags
        }))
      };
      index.totalItems += items.length;
    }

    return {
      content: JSON.stringify(index, null, 2),
      mimeType: 'application/json'
    };
  }

  private async getComparisonResource(): Promise<{ content: string; mimeType: string }> {
    const comparison: Record<string, unknown> = {
      generatedAt: new Date().toISOString(),
      businessLines: {}
    };

    for (const businessLine of BUSINESS_LINES) {
      const stats = await this.knowledgeSearch.getStatistics(businessLine);
      comparison.businessLines = {
        ...comparison.businessLines as Record<string, unknown>,
        [businessLine]: {
          ...stats,
          characteristics: this.getBusinessLineCharacteristics(businessLine)
        }
      };
    }

    return {
      content: JSON.stringify(comparison, null, 2),
      mimeType: 'application/json'
    };
  }

  private async getDetectionRulesResource(): Promise<{ content: string; mimeType: string }> {
    const rules = this.contextDetector.getDetectionRules();

    return {
      content: JSON.stringify({
        rules,
        description: 'Reglas utilizadas para detectar automáticamente la línea de negocio y el patrón de solución.',
        generatedAt: new Date().toISOString()
      }, null, 2),
      mimeType: 'application/json'
    };
  }

  private async getKnowledgeItemResource(
    businessLine: BusinessLine,
    itemId: string
  ): Promise<{ content: string; mimeType: string }> {
    const item = await this.knowledgeSearch.getKnowledgeItem(businessLine, itemId);
    if (!item) {
      throw new Error(`Knowledge item not found: ${itemId}`);
    }

    const relatedItems = await this.knowledgeSearch.getRelatedItems(businessLine, itemId);

    return {
      content: JSON.stringify({
        ...item,
        relatedItemsDetails: relatedItems.map((related) => ({
          id: related.id,
          title: related.title,
          description: related.description,
          source: related.businessLine,
          category: related.category,
          uri: `knowledge://${businessLine}/${related.category}/${related.id}`
        })),
        accessedAt: new Date().toISOString()
      }, null, 2),
      mimeType: 'application/json'
    };
  }

  private async getTemplatesResource(
    businessLine: BusinessLine,
    templateType: 'test' | 'lambda'
  ): Promise<{ content: string; mimeType: string }> {
    const items = await this.knowledgeSearch.getKnowledgeByCategory(businessLine, 'templates');
    const filteredItems = items.filter((item) => {
      const haystack = `${item.title} ${item.description} ${item.tags.join(' ')} ${item.content}`.toLowerCase();
      return templateType === 'test' ? haystack.includes('test') : haystack.includes('lambda');
    });

    const content = filteredItems.length > 0
      ? filteredItems.map((item) => `# ${item.title}\n\n${item.content}`).join('\n\n---\n\n')
      : `No se encontraron plantillas de tipo ${templateType} para ${businessLine}.`;

    return {
      content,
      mimeType: 'text/markdown'
    };
  }

  private getBusinessLineCharacteristics(businessLine: BusinessLine): string[] {
    if (businessLine === 'organic') {
      return [
        'Monolito legacy en Visual FoxPro',
        'Ruta fija C:\\ZOO y control de versiones heredado',
        'Framework Organic con ADN en DBF y generados din_*'
      ];
    }

    if (businessLine === 'dragon2028') {
      return [
        'Soluciones modulares en Visual FoxPro con DOVFP',
        'Estructura .vfpsln/.vfpproj inspirada en .NET',
        'PromptOps local y separación entre BusinessLogic, Generated y Tests'
      ];
    }

    return [
      'Línea enfocada en performance y agilidad',
      'Prioridad en throughput, latencia y observabilidad',
      'Soporte tipado y enfoque de optimización continua'
    ];
  }
}