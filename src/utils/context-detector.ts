import * as fs from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob';
import {
  BusinessLine,
  DependencySummary,
  DetectionRule,
  ProjectContext,
  SolutionRole,
  SolutionType
} from '../types';

const DRAGON_BASE_MODULES = new Set([
  'Organic.Core',
  'Organic.Drawing',
  'Organic.Generator',
  'Organic.Feline'
]);

const DRAGON_PRODUCT_SOLUTIONS = new Set([
  'Organic.Dragonfish',
  'Organic.ZL'
]);

const DRAGON_INDEPENDENT_SOLUTIONS = new Set([
  'Organic.AdnImplant',
  'dovfp.fxuLegacy'
]);

const DRAGON_EXPECTED_APP_REFERENCES: Record<string, string[]> = {
  'Organic.Core': [],
  'Organic.Drawing': ['Organic.Core'],
  'Organic.Generator': ['Organic.Core', 'Organic.Drawing'],
  'Organic.Feline': ['Organic.Core', 'Organic.Drawing', 'Organic.Generator'],
  'Organic.Dragonfish': ['Organic.Core', 'Organic.Drawing', 'Organic.Generator', 'Organic.Feline'],
  'Organic.ZL': ['Organic.Core', 'Organic.Drawing', 'Organic.Generator', 'Organic.Feline']
};

const ORGANIC_LEGACY_DIRECTORIES = [
  'Nucleo',
  'Felino',
  'Dibujante',
  'Generadores',
  'ColorYTalle',
  'ZL'
];

const FOXPRO_FILE_PATTERNS = ['**/*.prg', '**/*.vcx', '**/*.scx', '**/*.dbf', '**/*.h'];

/**
 * Detector de contexto para identificar automáticamente la línea de negocio
 * basándose en la estructura del proyecto, archivos y contenido.
 */
export class ContextDetector {
  private knowledgeBasePath: string;

  private detectionRules: DetectionRule[] = [
    {
      name: 'Dragon 2028 Modular Solution',
      businessLine: 'dragon2028',
      patterns: {
        files: ['*.vfpsln', '*.vfpproj', 'Organic.BusinessLogic/*.vfpproj'],
        directories: ['Organic.BusinessLogic', 'Organic.Generated', 'Organic.Tests'],
        content: ['dovfp', 'organic.businesslogic', 'organic.generated', 'organic.tests'],
        pathIncludes: ['Organic.']
      },
      weight: 120
    },
    {
      name: 'Organic Legacy Monolith',
      businessLine: 'organic',
      patterns: {
        files: ['**/*.dbf', '**/ADN/*.dbf', '**/adn/*.dbf'],
        directories: ORGANIC_LEGACY_DIRECTORIES,
        content: ['c:\\zoo', 'sourcesafe', 'visual sourcesafe', 'din_entidad', 'ent_'],
        pathIncludes: ['C:\\ZOO']
      },
      weight: 110
    },
    {
      name: 'Lince Performance Context',
      businessLine: 'lince',
      patterns: {
        files: FOXPRO_FILE_PATTERNS,
        content: ['lince', 'throughput', 'latencia', 'performance', 'benchmark', 'cache agresivo'],
        pathIncludes: ['lince']
      },
      weight: 90
    }
  ];

  constructor(knowledgeBasePath: string = './src/knowledge') {
    this.knowledgeBasePath = knowledgeBasePath;
  }

  /**
   * Detecta el contexto del proyecto basándose en la ruta proporcionada.
   */
  async detectContext(projectPath: string): Promise<ProjectContext> {
    const normalizedPath = await this.normalizeProjectPath(projectPath);
    const scores: Record<BusinessLine, number> = {
      organic: 0,
      lince: 0,
      dragon2028: 0
    };
    const detectedPatterns = new Set<string>();

    const technologies = await this.detectTechnologies(normalizedPath);
    const solutionName = await this.detectSolutionName(normalizedPath);
    const solutionType = await this.detectSolutionType(normalizedPath);

    await this.applyBuiltInHeuristics(normalizedPath, solutionName, scores, detectedPatterns);
    await this.applyCustomRules(normalizedPath, scores, detectedPatterns);

    const businessLine = this.pickBusinessLine(scores, detectedPatterns);
    const solutionRole = this.detectSolutionRole(businessLine, solutionName, normalizedPath);
    const dependencySummary = businessLine === 'dragon2028'
      ? await this.buildDragonDependencySummary(normalizedPath, solutionName)
      : undefined;
    const relatedSolutions = dependencySummary?.siblingSolutions ?? await this.findRelatedSolutions(normalizedPath);

    return {
      businessLine,
      projectPath: normalizedPath,
      projectType: this.detectProjectType(businessLine, solutionType),
      solutionName,
      solutionType,
      solutionRole,
      technologies,
      confidence: this.calculateConfidence(scores, businessLine),
      detectedPatterns: [...detectedPatterns].sort(),
      relatedSolutions,
      dependencySummary
    };
  }

  /**
   * Detecta el contexto basándose en variables de entorno o configuración manual.
   */
  detectFromEnvironment(): BusinessLine | null {
    const envBusinessLine = process.env.BUSINESS_LINE;
    if (envBusinessLine === 'organic' || envBusinessLine === 'lince' || envBusinessLine === 'dragon2028') {
      return envBusinessLine;
    }
    return null;
  }

  /**
   * Carga el contexto específico para Copilot integration.
   */
  async loadContextForCopilot(businessLine: BusinessLine): Promise<string> {
    const contextPath = path.join(this.knowledgeBasePath, businessLine, 'context', `${businessLine}-context.md`);

    try {
      if (await fs.pathExists(contextPath)) {
        return await fs.readFile(contextPath, 'utf-8');
      }
    } catch (error) {
      console.warn(`Could not load context for ${businessLine}: ${error}`);
    }

    return this.getDefaultContext(businessLine);
  }

  /**
   * Análisis de repositorio de código fuente para aprendizaje.
   */
  async analyzeSourceRepository(businessLine: BusinessLine): Promise<{
    patterns: string[];
    styles: {
      namingConventions: string[];
      commentStyles: string[];
      indentationStyle: string;
      functionStructure: string;
    };
    architectures: string[];
    sourceFiles: {
      totalFiles: number;
      fileTypes: Record<string, number>;
      directories: string[];
      lastModified: Date;
    };
  }> {
    const sourceRepoPath = path.join(this.knowledgeBasePath, businessLine, 'source-repository');

    if (!await fs.pathExists(sourceRepoPath)) {
      return {
        patterns: [],
        styles: {
          namingConventions: [],
          commentStyles: [],
          indentationStyle: 'unknown',
          functionStructure: 'unknown'
        },
        architectures: [],
        sourceFiles: {
          totalFiles: 0,
          fileTypes: {},
          directories: [],
          lastModified: new Date(0)
        }
      };
    }

    return {
      patterns: await this.extractCodePatterns(sourceRepoPath),
      styles: await this.extractCodingStyles(sourceRepoPath),
      architectures: await this.extractArchitectures(sourceRepoPath),
      sourceFiles: await this.inventorySourceFiles(sourceRepoPath)
    };
  }

  /**
   * Resume la estructura PromptOps disponible en una solución.
   */
  async summarizePromptOps(projectPath: string): Promise<{
    hasPromptOps: boolean;
    rootPath: string;
    agents: string[];
    instructions: string[];
    prompts: string[];
    skills: string[];
  }> {
    const normalizedPath = await this.normalizeProjectPath(projectPath);
    const githubPath = path.join(normalizedPath, '.github');

    if (!await fs.pathExists(githubPath)) {
      return {
        hasPromptOps: false,
        rootPath: normalizedPath,
        agents: [],
        instructions: [],
        prompts: [],
        skills: []
      };
    }

    const [agents, instructions, prompts, skills] = await Promise.all([
      this.listRelativeMatches(githubPath, 'agents/**/*.md'),
      this.listRelativeMatches(githubPath, 'instructions/**/*.md'),
      this.listRelativeMatches(githubPath, 'prompts/**/*.md'),
      this.listRelativeMatches(githubPath, 'skills/**/SKILL.md')
    ]);

    return {
      hasPromptOps: true,
      rootPath: normalizedPath,
      agents,
      instructions,
      prompts,
      skills
    };
  }

  /**
   * Agrega una regla personalizada de detección.
   */
  addDetectionRule(rule: DetectionRule): void {
    this.detectionRules.push(rule);
  }

  /**
   * Obtiene todas las reglas de detección configuradas.
   */
  getDetectionRules(): DetectionRule[] {
    return [...this.detectionRules];
  }

  private async normalizeProjectPath(projectPath: string): Promise<string> {
    if (!await fs.pathExists(projectPath)) {
      throw new Error(`Project path does not exist: ${projectPath}`);
    }

    const stats = await fs.stat(projectPath);
    return stats.isDirectory() ? path.resolve(projectPath) : path.dirname(path.resolve(projectPath));
  }

  private async applyBuiltInHeuristics(
    projectPath: string,
    solutionName: string | undefined,
    scores: Record<BusinessLine, number>,
    detectedPatterns: Set<string>
  ): Promise<void> {
    const pathUpper = projectPath.toUpperCase();

    if (pathUpper.includes('C:\\ZOO')) {
      scores.organic += 35;
      detectedPatterns.add('ORGANIC_FIXED_PATH');
    }

    if (await this.hasDirectories(projectPath, ORGANIC_LEGACY_DIRECTORIES)) {
      scores.organic += 30;
      detectedPatterns.add('ORGANIC_LEGACY_MODULES');
    }

    if (await this.hasAnyFile(projectPath, ['**/ADN/*.dbf', '**/adn/*.dbf'])) {
      scores.organic += 18;
      detectedPatterns.add('ORGANIC_ADN_DBF');
    }

    if (await this.hasAnyFile(projectPath, ['vssver.scc', '**/*.pjx'])) {
      scores.organic += 10;
      detectedPatterns.add('ORGANIC_LEGACY_VCS');
    }

    if (await this.hasAnyFile(projectPath, ['*.vfpsln', '*.vfpproj', 'Organic.BusinessLogic/*.vfpproj'])) {
      scores.dragon2028 += 28;
      detectedPatterns.add('DRAGON2028_DOVFP_FILES');
    }

    if (await this.hasDirectories(projectPath, ['Organic.BusinessLogic', 'Organic.Generated', 'Organic.Tests'])) {
      scores.dragon2028 += 40;
      detectedPatterns.add('DRAGON2028_CORE_LAYOUT');
    }

    if (await this.hasDirectories(projectPath, ['Organic.Hooks', 'Organic.Mocks', 'Organic.Assets'])) {
      scores.dragon2028 += 12;
      detectedPatterns.add('DRAGON2028_OPTIONAL_PROJECTS');
    }

    if (await this.hasAnyFile(projectPath, ['.github/AGENTS.md', '.github/copilot-instructions.md'])) {
      scores.dragon2028 += 10;
      detectedPatterns.add('PROMPTOPS_LAYOUT');
    }

    if (await this.hasAnyFile(projectPath, ['Organic.Generated/Generados/**/*.prg', 'Organic.Generated/ADN/**/*.{dbf,xml}', 'Organic.Generated/adn/**/*.{dbf,xml}'])) {
      scores.dragon2028 += 14;
      detectedPatterns.add('DRAGON2028_GENERATED_PROJECT');
    }

    if (solutionName?.startsWith('Organic.')) {
      scores.dragon2028 += 10;
      detectedPatterns.add(`SOLUTION_NAME_${solutionName.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`);
    }

    if (solutionName && DRAGON_INDEPENDENT_SOLUTIONS.has(solutionName)) {
      scores.dragon2028 += 20;
      detectedPatterns.add('DRAGON2028_INDEPENDENT_SOLUTION');
    }

    if (await this.hasAnyContent(projectPath, ['README*', '*.vfpsln', '*.vfpproj', '.github/**/*.md'], ['dovfp', 'organic.businesslogic', 'organic.generated', 'organic.tests'])) {
      scores.dragon2028 += 12;
      detectedPatterns.add('DRAGON2028_DOCUMENTED_LAYOUT');
    }

    if (await this.hasAnyContent(projectPath, ['README*', '**/*.prg', '**/*.md'], ['lince', 'throughput', 'latencia', 'benchmark', 'cache agresivo'])) {
      scores.lince += 20;
      detectedPatterns.add('LINCE_PERFORMANCE_SIGNAL');
    }

    if (await this.hasAnyContent(projectPath, ['**/*.prg'], ['goparametros.lince'])) {
      scores.lince += 15;
      detectedPatterns.add('LINCE_PARAMETER_USAGE');
    }

    if (await this.hasAnyContent(projectPath, ['**/*.prg'], ['goparametros.organic', 'din_entidad', 'ent_', 'dodefault()'])) {
      scores.organic += 10;
      detectedPatterns.add('ORGANIC_FRAMEWORK_USAGE');
    }
  }

  private async applyCustomRules(
    projectPath: string,
    scores: Record<BusinessLine, number>,
    detectedPatterns: Set<string>
  ): Promise<void> {
    for (const rule of this.detectionRules) {
      const score = await this.evaluateRule(rule, projectPath);
      if (score > 0) {
        scores[rule.businessLine] += score;
        detectedPatterns.add(`RULE_${rule.name.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`);
      }
    }
  }

  private async evaluateRule(rule: DetectionRule, projectPath: string): Promise<number> {
    let score = 0;

    if (rule.patterns.files && await this.hasAnyFile(projectPath, rule.patterns.files)) {
      score += rule.weight * 0.35;
    }

    if (rule.patterns.directories && await this.hasDirectories(projectPath, rule.patterns.directories)) {
      score += rule.weight * 0.25;
    }

    if (rule.patterns.content) {
      const contentScore = await this.countContentMatches(projectPath, rule.patterns.content);
      score += Math.min(1, contentScore / Math.max(rule.patterns.content.length, 1)) * rule.weight * 0.25;
    }

    if (rule.patterns.packageNames) {
      const packageScore = await this.checkPackageNames(projectPath, rule.patterns.packageNames);
      score += packageScore * rule.weight * 0.1;
    }

    if (rule.patterns.pathIncludes) {
      const normalizedPath = projectPath.toLowerCase();
      const matches = rule.patterns.pathIncludes.filter((fragment) => normalizedPath.includes(fragment.toLowerCase())).length;
      score += Math.min(1, matches / rule.patterns.pathIncludes.length) * rule.weight * 0.05;
    }

    return score;
  }

  private async detectSolutionName(projectPath: string): Promise<string | undefined> {
    const baseName = path.basename(projectPath);
    if (baseName.startsWith('Organic.') || baseName === 'dovfp.fxuLegacy') {
      return baseName;
    }

    const solutionFiles = await glob('*.vfpsln', {
      cwd: projectPath,
      nocase: true,
      dot: true
    });
    if (solutionFiles.length > 0) {
      return path.basename(solutionFiles[0], '.vfpsln');
    }

    const projectFiles = await glob('{*.vfpproj,Organic.BusinessLogic/*.vfpproj}', {
      cwd: projectPath,
      nocase: true,
      dot: true
    });
    if (projectFiles.length > 0) {
      return path.basename(projectFiles[0], '.vfpproj');
    }

    return undefined;
  }

  private async detectSolutionType(projectPath: string): Promise<SolutionType> {
    if (await this.hasAnyFile(projectPath, ['*.vfpsln'])) {
      return 'solution';
    }

    if (await this.hasAnyFile(projectPath, ['*.vfpproj', 'Organic.BusinessLogic/*.vfpproj'])) {
      return 'project';
    }

    if (await this.hasDirectories(projectPath, ['Organic.BusinessLogic', 'Nucleo', 'Felino'])) {
      return 'workspace';
    }

    if (projectPath.toUpperCase().includes('C:\\ZOO')) {
      return 'legacy';
    }

    return 'unknown';
  }

  private detectSolutionRole(
    businessLine: BusinessLine,
    solutionName: string | undefined,
    projectPath: string
  ): SolutionRole {
    if (businessLine === 'organic' || projectPath.toUpperCase().includes('C:\\ZOO')) {
      return 'legacy-monolith';
    }

    if (!solutionName) {
      return 'unknown';
    }

    if (DRAGON_BASE_MODULES.has(solutionName)) {
      return 'base-module';
    }

    if (DRAGON_PRODUCT_SOLUTIONS.has(solutionName)) {
      return 'product-solution';
    }

    if (DRAGON_INDEPENDENT_SOLUTIONS.has(solutionName)) {
      return 'independent-solution';
    }

    if (solutionName.startsWith('Organic.')) {
      return 'supporting-solution';
    }

    return 'unknown';
  }

  private detectProjectType(businessLine: BusinessLine, solutionType: SolutionType): string {
    if (businessLine === 'dragon2028') {
      return solutionType === 'solution' || solutionType === 'project'
        ? 'visual-foxpro-modular'
        : 'visual-foxpro-ecosystem';
    }

    if (businessLine === 'organic') {
      return 'visual-foxpro-legacy';
    }

    return 'visual-foxpro-performance';
  }

  private pickBusinessLine(scores: Record<BusinessLine, number>, detectedPatterns: Set<string>): BusinessLine {
    const ordered = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const [winner, winnerScore] = ordered[0] as [BusinessLine, number];
    const [, secondScore] = ordered[1] as [BusinessLine, number];

    if (winnerScore === 0) {
      return 'organic';
    }

    if (winnerScore === secondScore && detectedPatterns.has('DRAGON2028_CORE_LAYOUT')) {
      return 'dragon2028';
    }

    return winner;
  }

  private calculateConfidence(scores: Record<BusinessLine, number>, businessLine: BusinessLine): number {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    if (total === 0) {
      return 0.25;
    }

    const confidence = scores[businessLine] / total;
    return Math.max(0.25, Math.min(confidence, 1));
  }

  private async buildDragonDependencySummary(
    projectPath: string,
    solutionName?: string
  ): Promise<DependencySummary> {
    const includedProjects = await this.parseSolutionProjects(projectPath);
    const mainProjectFile = await this.findMainProjectFile(projectPath, solutionName);
    const { projectReferences, appReferences } = await this.parseProjectReferences(mainProjectFile);
    const normalizedAppReferences = [...new Set(appReferences.map((item) => this.normalizeAppReference(item)).filter(Boolean))];
    const expectedReferences = solutionName ? (DRAGON_EXPECTED_APP_REFERENCES[solutionName] || []) : [];
    const missingReferences = expectedReferences.filter((item) => !normalizedAppReferences.includes(item));
    const unexpectedReferences = normalizedAppReferences.filter((item) => {
      if (!item.startsWith('Organic.')) {
        return false;
      }

      if (expectedReferences.includes(item)) {
        return false;
      }

      return item !== solutionName;
    });

    return {
      projectReferences,
      appReferences: normalizedAppReferences,
      includedProjects,
      expectedReferences,
      missingReferences,
      unexpectedReferences,
      siblingSolutions: await this.findRelatedSolutions(projectPath)
    };
  }

  private async parseSolutionProjects(projectPath: string): Promise<string[]> {
    const solutionFiles = await glob('*.vfpsln', {
      cwd: projectPath,
      nocase: true,
      dot: true,
      absolute: true
    });

    if (solutionFiles.length === 0) {
      return [];
    }

    const content = await fs.readFile(solutionFiles[0], 'utf-8');
    const matches = [...content.matchAll(/<RelativePath>(.*?)<\/RelativePath>/gi)];

    return matches.map((match) => {
      const relativePath = match[1].trim();
      const normalized = relativePath.replace(/\\/g, '/');
      return normalized.split('/')[0];
    });
  }

  private async findMainProjectFile(projectPath: string, solutionName?: string): Promise<string | null> {
    const directCandidate = solutionName
      ? path.join(projectPath, 'Organic.BusinessLogic', `${solutionName}.vfpproj`)
      : '';

    if (directCandidate && await fs.pathExists(directCandidate)) {
      return directCandidate;
    }

    const projectFiles = await glob('{Organic.BusinessLogic/*.vfpproj,*.vfpproj}', {
      cwd: projectPath,
      nocase: true,
      dot: true,
      absolute: true
    });

    return projectFiles[0] || null;
  }

  private async parseProjectReferences(projectFile: string | null): Promise<{
    projectReferences: string[];
    appReferences: string[];
  }> {
    if (!projectFile) {
      return {
        projectReferences: [],
        appReferences: []
      };
    }

    const content = await fs.readFile(projectFile, 'utf-8');
    const projectReferences = [...content.matchAll(/<ProjectReference Include="([^"]+)"/gi)].map((match) => {
      const normalized = match[1].replace(/\\/g, '/');
      const parts = normalized.split('/');
      return parts.length > 1 ? parts[parts.length - 2] : path.basename(parts[0], '.vfpproj');
    });
    const appReferences = [...content.matchAll(/<AppReference Include="([^"]+)"/gi)].map((match) => match[1]);

    return {
      projectReferences: [...new Set(projectReferences)],
      appReferences: [...new Set(appReferences)]
    };
  }

  private normalizeAppReference(reference: string): string {
    return reference.replace(/\.app$/i, '').trim();
  }

  private async findRelatedSolutions(projectPath: string): Promise<string[]> {
    const parentPath = path.dirname(projectPath);
    if (!await fs.pathExists(parentPath)) {
      return [];
    }

    const siblings = await glob('Organic.*', {
      cwd: parentPath,
      nocase: true,
      dot: true
    });
    const currentName = path.basename(projectPath);

    const filtered: string[] = [];
    for (const sibling of siblings) {
      const siblingPath = path.join(parentPath, sibling);
      if (sibling === currentName) {
        continue;
      }

      try {
        const stats = await fs.stat(siblingPath);
        if (stats.isDirectory()) {
          filtered.push(sibling);
        }
      } catch (error) {
        // Ignorar entradas inválidas.
      }
    }

    return filtered.sort();
  }

  private async hasAnyFile(projectPath: string, patterns: string[]): Promise<boolean> {
    for (const pattern of patterns) {
      const matches = await glob(pattern, {
        cwd: projectPath,
        nocase: true,
        dot: true
      });
      if (matches.length > 0) {
        return true;
      }
    }

    return false;
  }

  private async hasDirectories(projectPath: string, directories: string[]): Promise<boolean> {
    for (const directory of directories) {
      const fullPath = path.join(projectPath, directory);
      if (await fs.pathExists(fullPath)) {
        const stats = await fs.stat(fullPath);
        if (stats.isDirectory()) {
          return true;
        }
      }
    }

    return false;
  }

  private async hasAnyContent(projectPath: string, filePatterns: string[], searchTerms: string[]): Promise<boolean> {
    return (await this.countContentMatches(projectPath, searchTerms, filePatterns)) > 0;
  }

  private async countContentMatches(
    projectPath: string,
    searchTerms: string[],
    filePatterns: string[] = ['README*', 'package.json', '*.vfpsln', '*.vfpproj', '**/*.prg']
  ): Promise<number> {
    const contentFiles = new Set<string>();
    for (const pattern of filePatterns) {
      const matches = await glob(pattern, {
        cwd: projectPath,
        nocase: true,
        dot: true,
        absolute: true
      });
      matches.slice(0, 12).forEach((match) => contentFiles.add(match));
    }

    let matchCount = 0;
    for (const filePath of contentFiles) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const lowerContent = content.toLowerCase();
        for (const term of searchTerms) {
          if (lowerContent.includes(term.toLowerCase())) {
            matchCount += 1;
          }
        }
      } catch (error) {
        // Ignorar archivos no legibles.
      }
    }

    return matchCount;
  }

  private async checkPackageNames(projectPath: string, packagePatterns: string[]): Promise<number> {
    const packageJsonPath = path.join(projectPath, 'package.json');

    if (!await fs.pathExists(packageJsonPath)) {
      return 0;
    }

    try {
      const packageJson = await fs.readJSON(packageJsonPath);
      const allDependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
        ...packageJson.peerDependencies
      };

      let matches = 0;
      for (const pattern of packagePatterns) {
        if (Object.keys(allDependencies).some((dependency) => dependency.includes(pattern))) {
          matches += 1;
        }
      }

      return Math.min(1, matches / Math.max(packagePatterns.length, 1));
    } catch (error) {
      return 0;
    }
  }

  private async detectTechnologies(projectPath: string): Promise<string[]> {
    const technologies = new Set<string>();

    if (await this.hasAnyFile(projectPath, FOXPRO_FILE_PATTERNS)) {
      technologies.add('Visual FoxPro');
    }

    if (await this.hasAnyFile(projectPath, ['*.vfpsln', '*.vfpproj'])) {
      technologies.add('DOVFP');
    }

    if (await fs.pathExists(path.join(projectPath, '.github'))) {
      technologies.add('PromptOps');
    }

    if (await fs.pathExists(path.join(projectPath, '.git'))) {
      technologies.add('Git');
    }

    if (await this.hasAnyFile(projectPath, ['azure-pipelines.yml'])) {
      technologies.add('Azure DevOps');
    }

    if (await this.hasAnyFile(projectPath, ['**/*.xml'])) {
      technologies.add('XML');
    }

    if (await this.hasAnyFile(projectPath, ['**/*.dbf'])) {
      technologies.add('DBF');
    }

    if (await this.hasAnyFile(projectPath, ['package.json', 'tsconfig.json'])) {
      technologies.add('TypeScript');
      technologies.add('Node.js');
    }

    return [...technologies].sort();
  }

  private async listRelativeMatches(basePath: string, pattern: string): Promise<string[]> {
    const matches = await glob(pattern, {
      cwd: basePath,
      nocase: true,
      dot: true
    });
    return matches.map((match) => match.replace(/\\/g, '/')).sort();
  }

  /**
   * Extrae patrones de código de archivos .prg, .vcx, .scx.
   */
  private async extractCodePatterns(sourceRepoPath: string): Promise<string[]> {
    const patterns: string[] = [];
    const foxproFiles = await glob('**/*.{prg,vcx,scx}', {
      cwd: sourceRepoPath,
      nocase: true,
      absolute: true
    });

    for (const filePath of foxproFiles) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        patterns.push(...this.extractFoxProPatterns(content));
      } catch (error) {
        // Ignorar errores de lectura.
      }
    }

    return [...new Set(patterns)].sort();
  }

  /**
   * Extrae patrones específicos de FoxPro.
   */
  private extractFoxProPatterns(content: string): string[] {
    const patterns: string[] = [];
    const lowerContent = content.toLowerCase();

    if (lowerContent.includes('define class')) {
      patterns.push('CLASS_DEFINITION');
    }
    if (lowerContent.includes('function ') && lowerContent.includes('endfunc')) {
      patterns.push('FUNCTION_DEFINITION');
    }
    if (lowerContent.includes('dodefault()')) {
      patterns.push('INHERITANCE_DODEFAULT');
    }
    if (lowerContent.includes('local ')) {
      patterns.push('LOCAL_VARIABLE_PATTERN');
    }
    if (lowerContent.includes('with this') || lowerContent.includes('with this.')) {
      patterns.push('WITH_THIS_PATTERN');
    }
    if (lowerContent.includes('try') && lowerContent.includes('catch')) {
      patterns.push('EXCEPTION_HANDLING');
    }
    if (lowerContent.includes('#include') || lowerContent.includes('#if')) {
      patterns.push('PREPROCESSOR_USAGE');
    }
    if (lowerContent.includes('goparametros.organic')) {
      patterns.push('ORGANIC_PARAMETER_USAGE');
    }
    if (lowerContent.includes('goparametros.lince')) {
      patterns.push('LINCE_PARAMETER_USAGE');
    }

    return patterns;
  }

  /**
   * Extrae estilos de codificación.
   */
  private async extractCodingStyles(sourceRepoPath: string): Promise<{
    namingConventions: string[];
    commentStyles: string[];
    indentationStyle: string;
    functionStructure: string;
  }> {
    const files = await glob('**/*.prg', {
      cwd: sourceRepoPath,
      nocase: true,
      absolute: true
    });
    const sampleFile = files[0];

    if (!sampleFile) {
      return {
        namingConventions: [],
        commentStyles: [],
        indentationStyle: 'unknown',
        functionStructure: 'unknown'
      };
    }

    const content = await fs.readFile(sampleFile, 'utf-8');
    return {
      namingConventions: ['tc/tn/tl/to/tx para parámetros', 'lc/ln/ll/lo para locales', 'go para globales'],
      commentStyles: ['*', '&&', '*!*'],
      indentationStyle: content.includes('\t') ? 'tabs' : 'spaces',
      functionStructure: content.toLowerCase().includes('endfunc') ? 'function-endfunc' : 'unknown'
    };
  }

  /**
   * Extrae arquitecturas utilizadas.
   */
  private async extractArchitectures(sourceRepoPath: string): Promise<string[]> {
    const architectures: string[] = [];
    const subdirs = await this.getSubdirectories(sourceRepoPath);

    if (subdirs.includes('classes')) {
      architectures.push('CLASS_BASED_ARCHITECTURE');
    }
    if (subdirs.includes('forms')) {
      architectures.push('FORM_BASED_UI_ARCHITECTURE');
    }
    if (subdirs.includes('controls')) {
      architectures.push('COMPONENT_BASED_ARCHITECTURE');
    }
    if (subdirs.includes('patterns')) {
      architectures.push('PATTERN_BASED_ARCHITECTURE');
    }

    return architectures;
  }

  /**
   * Inventario de archivos fuente.
   */
  private async inventorySourceFiles(sourceRepoPath: string): Promise<{
    totalFiles: number;
    fileTypes: Record<string, number>;
    directories: string[];
    lastModified: Date;
  }> {
    const inventory = {
      totalFiles: 0,
      fileTypes: {} as Record<string, number>,
      directories: [] as string[],
      lastModified: new Date(0)
    };

    try {
      const allFiles = await glob('**/*', {
        cwd: sourceRepoPath,
        nocase: true
      });
      inventory.totalFiles = allFiles.length;
      inventory.directories = await this.getSubdirectories(sourceRepoPath);

      for (const file of allFiles) {
        const ext = path.extname(file).toLowerCase() || '<no-ext>';
        inventory.fileTypes[ext] = (inventory.fileTypes[ext] || 0) + 1;
      }

      const stats = await fs.stat(sourceRepoPath);
      inventory.lastModified = stats.mtime;
    } catch (error) {
      console.warn(`Error creating inventory: ${error}`);
    }

    return inventory;
  }

  /**
   * Obtiene subdirectorios.
   */
  private async getSubdirectories(dirPath: string): Promise<string[]> {
    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true });
      return items.filter((item) => item.isDirectory()).map((item) => item.name);
    } catch (error) {
      return [];
    }
  }

  /**
   * Contexto por defecto si no existe archivo específico.
   */
  private getDefaultContext(businessLine: BusinessLine): string {
    if (businessLine === 'organic') {
      return `# Contexto ORGANIC por defecto
Proyecto Visual FoxPro monolítico con código fuente legacy, ADN en DBF y especializaciones sobre generados.`;
    }

    if (businessLine === 'dragon2028') {
      return `# Contexto DRAGON 2028 por defecto
Proyecto Visual FoxPro modular con DOVFP, soluciones desacopladas, generated/custom code y PromptOps por solución.`;
    }

    return `# Contexto LINCE por defecto
Línea orientada a performance y velocidad, con foco en profiling, latencia y throughput.`;
  }
}