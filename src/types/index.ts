/**
 * Tipos principales para el servidor MCP de conocimiento Zoo Logic.
 */

export const BUSINESS_LINES = ['organic', 'lince', 'dragon2028'] as const;
export type BusinessLine = typeof BUSINESS_LINES[number];

export const KNOWLEDGE_CATEGORIES = [
  'architecture',
  'patterns',
  'standards',
  'best-practices',
  'context',
  'templates',
  'source-repository',
  'promptops'
] as const;
export type KnowledgeCategory = typeof KNOWLEDGE_CATEGORIES[number];

export type KnowledgeScope = BusinessLine | 'shared';

export type SolutionType = 'legacy' | 'solution' | 'project' | 'workspace' | 'unknown';

export type SolutionRole =
  | 'legacy-monolith'
  | 'base-module'
  | 'product-solution'
  | 'independent-solution'
  | 'supporting-solution'
  | 'unknown';

export interface DependencySummary {
  projectReferences: string[];
  appReferences: string[];
  includedProjects: string[];
  expectedReferences: string[];
  missingReferences: string[];
  unexpectedReferences: string[];
  siblingSolutions: string[];
}

export interface ProjectContext {
  businessLine: BusinessLine;
  projectPath: string;
  projectType?: string;
  solutionName?: string;
  solutionType?: SolutionType;
  solutionRole?: SolutionRole;
  technologies: string[];
  confidence: number;
  detectedPatterns: string[];
  relatedSolutions: string[];
  dependencySummary?: DependencySummary;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  category: KnowledgeCategory;
  businessLine: KnowledgeScope;
  tags: string[];
  content: string;
  examples?: CodeExample[];
  relatedItems?: string[];
  lastUpdated: Date;
  version: string;
}

export interface CodeExample {
  language: string;
  title: string;
  code: string;
  description?: string;
}

export interface ContextPrompt {
  businessLine: BusinessLine;
  prompt: string;
  variables?: Record<string, string>;
  includedKnowledge: string[];
}

export interface SearchResult {
  items: KnowledgeItem[];
  totalCount: number;
  searchTerms: string[];
  businessLine: BusinessLine;
}

export interface TestGenerationRequest {
  testName: string;
  testFileName: string;
  businessLine: BusinessLine;
  technology: string;
  testType: 'unit' | 'integration' | 'e2e';
  framework?: string;
  targetFile?: string;
}

export interface LambdaGenerationRequest {
  functionName: string;
  parameters: LambdaParameter[];
  formula: string;
  businessLine: BusinessLine;
  runtime: 'nodejs' | 'python' | 'java' | 'csharp';
  returnType?: string;
  description?: string;
}

export interface LambdaParameter {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  defaultValue?: any;
}

export interface GeneratedContent {
  fileName: string;
  content: string;
  language: string;
  dependencies?: string[];
  instructions?: string[];
}

export interface FoxProTestGroupRequest {
  testGroupName: string;
  testDirectory: string;
  businessLine: BusinessLine;
  description?: string;
}

export interface FoxProTestMethodRequest {
  testFileName: string;
  methodName: string;
  testDirectory: string;
  businessLine: BusinessLine;
  description?: string;
}

export interface DetectionRule {
  name: string;
  businessLine: BusinessLine;
  patterns: {
    files?: string[];
    directories?: string[];
    content?: string[];
    packageNames?: string[];
    pathIncludes?: string[];
  };
  weight: number;
}

export interface MCPConfig {
  server: {
    name: string;
    version: string;
    port: number;
  };
  knowledge: {
    basePath: string;
    indexingEnabled: boolean;
    cacheTimeout: number;
  };
  detection: {
    rules: DetectionRule[];
    defaultBusinessLine: BusinessLine;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    file?: string;
  };
}

export interface ToolRequest {
  name: string;
  arguments: Record<string, any>;
}

export interface ToolResponse {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

export interface ResourceInfo {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface PromptInfo {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}
