# Servidor MCP Corporativo - Repositorio de Conocimiento Organic/Lince

## Descripción del Proyecto

Este servidor MCP (Model Context Protocol) ha sido diseñado específicamente para proporcionar a GitHub Copilot acceso a repositorios de conocimiento corporativo estructurados por líneas de negocio (Organic y Lince). El objetivo principal es establecer un mecanismo robusto donde Copilot pueda acceder a las mejores prácticas, patrones de código y estándares corporativos antes de recurrir a conocimiento público.

## Evaluación de la Solución

### Fortalezas de esta Aproximación

1. **Separación por Contexto**: Cada línea de negocio (Organic/Lince) tiene su propio repositorio de conocimiento
2. **Detección Automática**: El MCP puede detectar el contexto de desarrollo actual
3. **Priorización de Conocimiento**: El conocimiento corporativo se consulta antes que fuentes externas
4. **Escalabilidad**: Fácil agregar nuevas líneas de negocio o expandir repositorios
5. **Mantenimiento**: Los repositorios de conocimiento son independientes del código de producción

### Casos de Uso

- **Arquitectura de Referencia**: Patrones arquitectónicos específicos por línea de negocio
- **Estándares de Código**: Convenciones de naming, estructura de proyectos
- **Componentes Reutilizables**: Librerías y módulos corporativos
- **Mejores Prácticas**: Guidelines de seguridad, performance, testing
- **Documentación Técnica**: APIs internas, procedimientos de deployment

## Arquitectura del Servidor MCP

```
zoocode.mcpOrganic/
├── src/
│   ├── server.ts                 # Servidor MCP principal
│   ├── handlers/
│   │   ├── tools.ts             # Herramientas MCP
│   │   ├── resources.ts         # Recursos MCP
│   │   └── prompts.ts           # Prompts contextuales
│   ├── knowledge/
│   │   ├── organic/             # Repositorio Organic
│   │   │   ├── architecture/
│   │   │   ├── patterns/
│   │   │   ├── standards/
│   │   │   └── best-practices/
│   │   └── lince/               # Repositorio Lince
│   │       ├── architecture/
│   │       ├── patterns/
│   │       ├── standards/
│   │       └── best-practices/
│   ├── utils/
│   │   ├── context-detector.ts  # Detección de contexto
│   │   └── knowledge-search.ts  # Búsqueda en repositorios
│   └── types/
│       └── index.ts             # Definiciones de tipos
├── package.json
├── tsconfig.json
└── mcp-config.json
```

## Funcionalidades Principales

### 1. Detección Automática de Contexto
- Análisis de estructura de directorios
- Detección por contenido de archivos (package.json, configuraciones)
- Identificación por keywords en el código
- Configuración manual por proyecto

### 2. Repositorio de Conocimiento Estructurado
- **Arquitectura**: Patrones arquitectónicos, diagramas, decisiones técnicas
- **Patrones**: Design patterns específicos por dominio
- **Estándares**: Convenciones de código, estructura de proyectos
- **Mejores Prácticas**: Guidelines de desarrollo, testing, deployment

### 3. Herramientas MCP Específicas
- `get-context-prompt`: Obtiene el prompt contextual según el ambiente detectado
- `search-knowledge`: Busca en el repositorio de conocimiento correspondiente
- `get-best-practices`: Retorna mejores prácticas por tecnología/dominio
- `validate-pattern`: Valida si el código sigue patrones corporativos

## Pasos para Construcción del MCP

### Paso 1: Inicialización del Proyecto

```bash
cd d:\repo\zoocode.mcpOrganic
npm init -y
npm install @modelcontextprotocol/sdk typescript @types/node ts-node
npm install --save-dev @types/fs-extra fs-extra
```

### Paso 2: Configuración TypeScript

```bash
npx tsc --init
```

### Paso 3: Estructura de Directorios

```bash
mkdir -p src/{handlers,knowledge/{organic,lince}/{architecture,patterns,standards,best-practices},utils,types}
```

### Paso 4: Implementación del Servidor Base

1. Configurar el servidor MCP principal
2. Implementar detectores de contexto
3. Crear manejadores para tools, resources y prompts
4. Desarrollar sistema de búsqueda en repositorios

### Paso 5: Población de Repositorios de Conocimiento

1. Migrar documentación existente
2. Crear templates y ejemplos
3. Documentar patrones específicos por línea de negocio
4. Establecer proceso de actualización

## Despliegue

### Opción 1: Despliegue Local
```bash
# Compilación
npm run build

# Ejecución
npm start
```

### Opción 2: Despliegue como Servicio
```bash
# Usando PM2
npm install -g pm2
pm2 start ecosystem.config.js
```

### Opción 3: Containerización
```bash
# Docker
docker build -t mcp-organic .
docker run -p 3000:3000 mcp-organic
```

## Configuración de GitHub Copilot

### 1. Configuración en VS Code

Archivo `settings.json`:
```json
{
  "github.copilot.advanced": {
    "mcp": {
      "servers": {
        "organic-knowledge": {
          "command": "node",
          "args": ["d:/repo/zoocode.mcpOrganic/dist/server.js"],
          "env": {
            "KNOWLEDGE_PATH": "d:/repo/zoocode.mcpOrganic/src/knowledge"
          }
        }
      }
    }
  }
}
```

### 2. Configuración por Proyecto

Archivo `.vscode/settings.json` en cada proyecto:
```json
{
  "github.copilot.advanced": {
    "context": {
      "businessLine": "organic", // o "lince"
      "mcpServer": "organic-knowledge"
    }
  }
}
```

### 3. Variables de Entorno

```bash
# .env
BUSINESS_LINE=organic
MCP_SERVER_PORT=3000
KNOWLEDGE_BASE_PATH=./src/knowledge
LOG_LEVEL=info
```

## Flujo de Trabajo

1. **Detección**: Copilot detecta el contexto del proyecto actual
2. **Consulta**: El MCP identifica la línea de negocio (Organic/Lince)
3. **Prompt**: Se carga el prompt contextual específico
4. **Búsqueda**: Se consulta el repositorio de conocimiento correspondiente
5. **Respuesta**: Copilot responde con conocimiento corporativo prioritario

## Mantenimiento y Actualización

### Actualización de Repositorios
- Process automatizado de sincronización
- Versionado de conocimiento
- Validación de contenido antes de deployment

### Métricas y Monitoreo
- Queries más frecuentes por línea de negocio
- Efectividad de respuestas
- Tiempo de respuesta del MCP

### Governance
- Proceso de revisión de contenido
- Roles y responsabilidades por repositorio
- Procedimientos de escalación

## Roadmap Futuro

1. **Fase 1**: Implementación básica con detección manual
2. **Fase 2**: Detección automática inteligente
3. **Fase 3**: Machine learning para mejora de respuestas
4. **Fase 4**: Integración con sistemas corporativos adicionales
5. **Fase 5**: Analytics avanzado y optimización continua

## Soporte y Contacto

- **Documentación**: [Wiki interno]
- **Issues**: [Sistema de tickets]
- **Contacto**: equipo-arquitectura@empresa.com
