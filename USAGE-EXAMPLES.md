# Ejemplo de Uso - Nuevas Funcionalidades MCP

## Ejemplo 1: Generación de Tests para ORGANIC

### 1. Detectar línea de negocio
```json
{
  "method": "tools/call",
  "params": {
    "name": "detect-business-line",
    "arguments": {
      "projectPath": "/path/to/sustainable-api"
    }
  }
}
```

### 2. Obtener prompt especializado para testing
```json
{
  "method": "tools/call",
  "params": {
    "name": "get-specific-prompt", 
    "arguments": {
      "businessLine": "organic",
      "promptType": "test-generation",
      "context": "API testing with sustainability focus"
    }
  }
}
```

### 3. Generar estructura de test
```json
{
  "method": "tools/call",
  "params": {
    "name": "generate-test-structure",
    "arguments": {
      "testName": "EcoProductService",
      "testFileName": "eco-product-service.test.js", 
      "businessLine": "organic",
      "technology": "javascript",
      "testType": "unit",
      "framework": "jest",
      "targetFile": "./src/services/eco-product-service.js"
    }
  }
}
```

### Resultado Esperado ORGANIC:
```javascript
// ORGANIC - EcoProductService Unit Tests
// Sustainable and maintainable testing approach
// Environmental impact: Optimized for efficiency

const { EcoProductService } = require('./src/services/eco-product-service.js');

describe('EcoProductService', () => {
  // Setup and teardown with resource optimization
  beforeAll(() => {
    // Initialize resources efficiently
  });

  afterAll(() => {
    // Clean up resources sustainably
  });

  test('should calculate carbon footprint correctly', () => {
    // Arrange - Sustainable data setup
    const product = {
      name: 'Organic Coffee',
      weight: 250,
      transportDistance: 1000
    };
    
    // Act
    const footprint = EcoProductService.calculateCarbonFootprint(product);
    
    // Assert
    expect(footprint).toBeGreaterThan(0);
    expect(footprint).toBeLessThan(100); // Sustainable threshold
  });

  test('should be performant and resource-efficient', () => {
    const startTime = Date.now();
    const largeDataset = Array(1000).fill().map((_, i) => ({ id: i }));
    
    const result = EcoProductService.processBatch(largeDataset);
    
    const executionTime = Date.now() - startTime;
    expect(executionTime).toBeLessThan(100); // ms
    expect(result).toBeDefined();
  });
});
```

## Ejemplo 2: Generación de Lambda para LINCE

### 1. Obtener prompt especializado para lambdas
```json
{
  "method": "tools/call",
  "params": {
    "name": "get-specific-prompt",
    "arguments": {
      "businessLine": "lince",
      "promptType": "lambda-generation", 
      "context": "High-performance price calculation"
    }
  }
}
```

### 2. Generar función lambda
```json
{
  "method": "tools/call",
  "params": {
    "name": "generate-lambda-function",
    "arguments": {
      "functionName": "calculateDynamicPrice",
      "parameters": [
        {
          "name": "basePrice",
          "type": "number",
          "required": true,
          "description": "Precio base del producto"
        },
        {
          "name": "demandMultiplier", 
          "type": "number",
          "required": true,
          "description": "Multiplicador de demanda (0.5-2.0)"
        },
        {
          "name": "seasonalFactor",
          "type": "number", 
          "required": false,
          "defaultValue": 1.0,
          "description": "Factor estacional"
        }
      ],
      "formula": "basePrice * demandMultiplier * seasonalFactor",
      "businessLine": "lince",
      "runtime": "nodejs",
      "description": "Calcula precio dinámico basado en demanda y estacionalidad"
    }
  }
}
```

### Resultado Esperado LINCE:
```javascript
// LINCE Lambda Function: calculateDynamicPrice
// Calcula precio dinámico basado en demanda y estacionalidad
// High-performance serverless computing optimized for speed and scalability

const AWS = require('aws-sdk');

// Connection reuse and performance optimization
let cachedResults = new Map();
const CACHE_TTL = 300000; // 5 minutes

exports.handler = async (event, context) => {
    // Optimize context for performance
    context.callbackWaitsForEmptyEventLoop = false;
    
    const startTime = process.hrtime.bigint();
    const requestId = context.awsRequestId;
    
    try {
        // Fast parameter extraction
        const basePrice = event.basePrice;
        const demandMultiplier = event.demandMultiplier;
        const seasonalFactor = event.seasonalFactor || 1.0;
        
        // Quick validation (fail fast)
        validateInputsFast(basePrice, demandMultiplier, seasonalFactor);
        
        // Check cache for performance optimization
        const cacheKey = generateCacheKey(basePrice, demandMultiplier, seasonalFactor);
        const cached = getCachedResult(cacheKey);
        if (cached) {
            return formatSuccessResponse(cached, startTime, requestId, true);
        }
        
        // Execute high-performance business logic
        const result = basePrice * demandMultiplier * seasonalFactor;
        
        // Cache result for future requests
        setCachedResult(cacheKey, result);
        
        return formatSuccessResponse(result, startTime, requestId);
        
    } catch (error) {
        const executionTime = Number(process.hrtime.bigint() - startTime) / 1000000;
        
        return {
            statusCode: error.statusCode || 500,
            headers: {
                'Content-Type': 'application/json',
                'X-Execution-Time': executionTime.toString()
            },
            body: JSON.stringify({
                success: false,
                error: {
                    message: error.message,
                    type: error.name || 'InternalError'
                }
            })
        };
    }
};

function validateInputsFast(basePrice, demandMultiplier, seasonalFactor) {
    if (basePrice === undefined || basePrice === null) throw new Error('basePrice is required');
    if (demandMultiplier === undefined || demandMultiplier === null) throw new Error('demandMultiplier is required');
    if (typeof basePrice !== 'number' || basePrice <= 0) throw new Error('basePrice must be a positive number');
    if (typeof demandMultiplier !== 'number' || demandMultiplier <= 0) throw new Error('demandMultiplier must be a positive number');
}
```

## Ejemplo 3: Acceso a Templates como Resources

### 1. Listar recursos disponibles
```json
{
  "method": "resources/list",
  "params": {}
}
```

### 2. Obtener plantillas específicas
```json
{
  "method": "resources/read",
  "params": {
    "uri": "templates://organic/test-templates"
  }
}
```

```json
{
  "method": "resources/read", 
  "params": {
    "uri": "templates://lince/lambda-templates"
  }
}
```

## Ejemplo 4: Flujo Completo de Desarrollo

### Escenario: Desarrollar API de productos sostenibles para ORGANIC

```bash
# 1. Detección automática
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "detect-business-line", 
      "arguments": {
        "projectPath": "/workspace/sustainable-products-api"
      }
    }
  }'

# 2. Generar tests para el servicio principal
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \  
  -d '{
    "method": "tools/call",
    "params": {
      "name": "generate-test-structure",
      "arguments": {
        "testName": "ProductCatalogService",
        "testFileName": "product-catalog.integration.test.js",
        "businessLine": "organic",
        "technology": "nodejs",
        "testType": "integration",
        "targetFile": "./src/services/product-catalog.js"
      }
    }
  }'

# 3. Generar lambda para cálculo de precios sostenibles
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call", 
    "params": {
      "name": "generate-lambda-function",
      "arguments": {
        "functionName": "calculateSustainablePrice",
        "parameters": [
          {
            "name": "basePrice",
            "type": "number",
            "required": true,
            "description": "Precio base del producto"
          },
          {
            "name": "sustainabilityScore", 
            "type": "number",
            "required": true,
            "description": "Puntuación de sostenibilidad (0-100)"
          },
          {
            "name": "carbonOffset",
            "type": "number",
            "required": false, 
            "defaultValue": 0,
            "description": "Costo de compensación de carbono"
          }
        ],
        "formula": "basePrice + (sustainabilityScore * 0.1) + carbonOffset",
        "businessLine": "organic",
        "runtime": "nodejs",
        "description": "Calcula precio ajustado por sostenibilidad"
      }
    }
  }'

# 4. Obtener mejores prácticas específicas
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "get-best-practices",
      "arguments": {
        "businessLine": "organic",
        "technology": "nodejs" 
      }
    }
  }'
```

## Beneficios Observados

### ✅ **Desarrollo Acelerado**
- Generación de código en segundos vs horas
- Estructura consistente y estandarizada
- Menos errores de configuración inicial

### ✅ **Adherencia a Principios Corporativos**
- ORGANIC: Código sostenible y eficiente
- LINCE: Código de alta performance y escalable
- Mejores prácticas integradas automáticamente

### ✅ **Mantenibilidad**
- Templates actualizables centralizadamente
- Código generado sigue estándares corporativos
- Documentación incluida en el código

### ✅ **Experiencia de Desarrollo**
- Feedback inmediato con prompts contextuales
- Recursos accesibles vía MCP
- Integración natural con el workflow existente

Este enfoque transforma el MCP de un repositorio pasivo de conocimiento a un asistente activo de desarrollo que genera código funcional optimizado para cada línea de negocio.
