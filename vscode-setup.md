# Configuración de GitHub Copilot para MCP Organic/Lince

## 1. Configuración Global de VS Code

Agregar en `settings.json` de VS Code:

```json
{
  "github.copilot.advanced": {
    "mcp": {
      "servers": {
        "organic-knowledge": {
          "command": "node",
          "args": ["d:/repo/zoocode.mcpOrganic/dist/server.js"],
          "env": {
            "KNOWLEDGE_BASE_PATH": "d:/repo/zoocode.mcpOrganic/src/knowledge",
            "DEFAULT_BUSINESS_LINE": "organic",
            "LOG_LEVEL": "info"
          }
        }
      }
    }
  },
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "markdown": true,
    "typescript": true,
    "javascript": true
  }
}
```

## 2. Configuración por Proyecto

### Para Proyectos Organic

Crear `.vscode/settings.json` en el proyecto:

```json
{
  "github.copilot.advanced": {
    "context": {
      "businessLine": "organic",
      "mcpServer": "organic-knowledge",
      "promptTemplate": "context-prompt"
    }
  },
  "github.copilot.chat.welcomeMessage": "Hola! Estoy configurado para usar las mejores prácticas de ORGANIC. Puedo ayudarte con arquitectura sostenible, patrones de código limpio y desarrollo eficiente.",
  "files.associations": {
    "*.organic": "yaml",
    "*.organic.json": "json"
  }
}
```

### Para Proyectos Lince

Crear `.vscode/settings.json` en el proyecto:

```json
{
  "github.copilot.advanced": {
    "context": {
      "businessLine": "lince",
      "mcpServer": "organic-knowledge",
      "promptTemplate": "context-prompt"
    }
  },
  "github.copilot.chat.welcomeMessage": "¡Hola! Estoy optimizado para LINCE. Puedo ayudarte con performance, serverless, y desarrollo ágil de alta velocidad.",
  "files.associations": {
    "*.lince": "yaml",
    "*.lince.json": "json"
  }
}
```

## 3. Configuración de Workspace

### Organic Workspace

```json
{
  "folders": [
    {
      "name": "My Organic Project",
      "path": "./src"
    }
  ],
  "settings": {
    "github.copilot.advanced": {
      "context": {
        "businessLine": "organic",
        "projectType": "web-application",
        "technologies": ["typescript", "react", "nodejs"]
      }
    }
  },
  "extensions": {
    "recommendations": [
      "github.copilot",
      "github.copilot-chat",
      "ms-vscode.vscode-typescript-next"
    ]
  }
}
```

### Lince Workspace

```json
{
  "folders": [
    {
      "name": "My Lince Project",
      "path": "./src"
    }
  ],
  "settings": {
    "github.copilot.advanced": {
      "context": {
        "businessLine": "lince",
        "projectType": "serverless",
        "technologies": ["typescript", "aws-lambda", "edge-computing"]
      }
    }
  },
  "extensions": {
    "recommendations": [
      "github.copilot",
      "github.copilot-chat",
      "aws-toolkit-vscode"
    ]
  }
}
```

## 4. Variables de Entorno para Desarrollo

### .env.local para desarrollo

```bash
# MCP Configuration
MCP_SERVER_ENABLED=true
MCP_SERVER_PATH=d:/repo/zoocode.mcpOrganic/dist/server.js
KNOWLEDGE_BASE_PATH=d:/repo/zoocode.mcpOrganic/src/knowledge

# Business Line Detection
BUSINESS_LINE=organic  # o 'lince'
PROJECT_TYPE=web-application
TECHNOLOGIES=typescript,react,nodejs

# Logging
LOG_LEVEL=debug
MCP_DEBUG=true
```

## 5. Snippets Personalizados

### Organic Snippets (.vscode/organic.code-snippets)

```json
{
  "Organic Service Class": {
    "prefix": "organic-service",
    "body": [
      "/**",
      " * Service siguiendo principios Organic",
      " * Enfoque: Sostenibilidad y eficiencia",
      " */",
      "export class ${1:ServiceName} {",
      "  constructor(",
      "    private readonly ${2:dependency}: ${3:DependencyType}",
      "  ) {}",
      "",
      "  async ${4:methodName}(): Promise<${5:ReturnType}> {",
      "    // Implementación sostenible y eficiente",
      "    $0",
      "  }",
      "}"
    ],
    "description": "Crea una clase de servicio siguiendo patrones Organic"
  }
}
```

### Lince Snippets (.vscode/lince.code-snippets)

```json
{
  "Lince Lambda Function": {
    "prefix": "lince-lambda",
    "body": [
      "import { APIGatewayProxyHandler } from 'aws-lambda';",
      "",
      "/**",
      " * Función Lambda optimizada para Lince",
      " * Enfoque: Performance y velocidad",
      " */",
      "export const ${1:functionName}: APIGatewayProxyHandler = async (event) => {",
      "  try {",
      "    // Lógica optimizada para performance",
      "    $0",
      "    ",
      "    return {",
      "      statusCode: 200,",
      "      headers: {",
      "        'Content-Type': 'application/json',",
      "        'X-Function': '${1:functionName}'",
      "      },",
      "      body: JSON.stringify(result)",
      "    };",
      "  } catch (error) {",
      "    return {",
      "      statusCode: 500,",
      "      body: JSON.stringify({ error: error.message })",
      "    };",
      "  }",
      "};"
    ],
    "description": "Crea una función Lambda optimizada para Lince"
  }
}
```

## 6. Comandos Personalizados

### tasks.json para proyectos Organic/Lince

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "MCP: Detect Business Line",
      "type": "shell",
      "command": "node",
      "args": [
        "-e",
        "const detector = require('./dist/utils/context-detector'); detector.detectContext(process.cwd()).then(console.log)"
      ],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "MCP: Search Knowledge",
      "type": "shell",
      "command": "${input:mcpSearchCommand}",
      "group": "build"
    }
  ],
  "inputs": [
    {
      "id": "mcpSearchCommand",
      "description": "Buscar en repositorio de conocimiento",
      "type": "promptString",
      "default": "node -e \"console.log('Buscar: ');\""
    }
  ]
}
```

## 7. Keybindings Personalizados

### keybindings.json

```json
[
  {
    "key": "ctrl+shift+o ctrl+shift+k",
    "command": "workbench.action.terminal.sendSequence",
    "args": {
      "text": "npm run mcp:search "
    },
    "when": "terminalFocus"
  },
  {
    "key": "ctrl+shift+o ctrl+shift+d",
    "command": "workbench.action.tasks.runTask",
    "args": "MCP: Detect Business Line"
  }
]
```

## 8. Integración con GitHub Copilot Chat

### Comandos personalizados para Chat

```
# Para obtener prompt contextual
@copilot /mcp get-context-prompt organic

# Para buscar en conocimiento
@copilot /mcp search-knowledge "microservices patterns" --business-line=organic

# Para validar código
@copilot /mcp validate-standards --business-line=lince --language=typescript
```

## 9. Verificación de Configuración

### Script de verificación

```bash
# Verificar que MCP está funcionando
node -e "
const { ContextDetector } = require('./dist/utils/context-detector');
const detector = new ContextDetector();
detector.detectContext('.').then(result => {
  console.log('✅ MCP Server funcionando');
  console.log('Business Line detectada:', result.businessLine);
  console.log('Confianza:', result.confidence);
}).catch(err => {
  console.error('❌ Error en MCP Server:', err.message);
});
"
```

## 10. Troubleshooting

### Problemas comunes

1. **MCP Server no responde**: Verificar que el servidor esté compilado (`npm run build`)
2. **Detección incorrecta**: Ajustar reglas en `ContextDetector`
3. **Cache issues**: Limpiar cache con `npm run clean && npm run build`
4. **Permisos**: Verificar permisos de lectura en directorio de conocimiento
