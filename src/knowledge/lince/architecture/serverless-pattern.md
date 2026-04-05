# Arquitectura Serverless Lince

## Descripción
Patrón arquitectónico principal para aplicaciones de la línea Lince, enfocado en velocidad, escalabilidad instantánea y costos optimizados.

## Principios Fundamentales

### 1. Velocidad de Desarrollo
- Despliegues rápidos y frecuentes
- Infraestructura como código
- Desarrollo orientado a funciones

### 2. Escalabilidad Automática
- Auto-scaling inmediato basado en demanda
- Pay-per-use real
- Zero server management

### 3. Performance First
- Cold start optimization
- Edge computing integration
- Minimal latency patterns

## Estructura Recomendada

```
lince-app/
├── functions/
│   ├── user-api/
│   ├── product-api/
│   └── order-processing/
├── shared/
│   ├── libs/
│   ├── types/
│   └── middleware/
├── infrastructure/
│   ├── terraform/
│   └── cloudformation/
└── tests/
```

## Tecnologías Recomendadas

- **Functions**: AWS Lambda, Vercel Functions, Cloudflare Workers
- **API Gateway**: AWS API Gateway, Cloudflare Workers
- **Database**: DynamoDB, FaunaDB, PlanetScale
- **Storage**: S3, R2, Vercel Blob
- **Monitoring**: DataDog, New Relic, Vercel Analytics

## Patrones de Implementación

### 1. Function-per-Endpoint
```typescript
// functions/users/create.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createUser } from '../../shared/services/user.service';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const userData = JSON.parse(event.body || '{}');
    const user = await createUser(userData);
    
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(user)
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### 2. Event-Driven Processing
```typescript
// functions/order-processor.ts
import { SQSHandler } from 'aws-lambda';

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const orderData = JSON.parse(record.body);
    
    // Procesamiento paralelo
    await Promise.all([
      processPayment(orderData),
      updateInventory(orderData),
      sendNotifications(orderData)
    ]);
  }
};
```

### 3. Edge Computing
```typescript
// functions/edge/geolocation.ts
export default {
  async fetch(request: Request): Promise<Response> {
    const country = request.cf?.country || 'US';
    const region = getOptimalRegion(country);
    
    return new Response(JSON.stringify({ region }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=3600'
      }
    });
  }
};
```

## Optimizaciones de Performance

### Cold Start Mitigation
```typescript
// Inicialización fuera del handler
const dbConnection = createConnection();
const cache = new Map();

export const handler = async (event) => {
  // Handler logic aquí
  // La conexión DB ya está inicializada
};
```

### Connection Pooling
```typescript
// shared/database/connection.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1, // Límite para serverless
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 2000
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};
```

### Bundle Optimization
```javascript
// webpack.config.js
module.exports = {
  target: 'node',
  mode: 'production',
  optimization: {
    minimize: true,
    sideEffects: false
  },
  externals: {
    'aws-sdk': 'aws-sdk' // Exclude AWS SDK en Lambda
  },
  resolve: {
    alias: {
      // Tree-shaking optimizations
      'lodash': 'lodash-es'
    }
  }
};
```

## Infrastructure as Code

### Terraform Configuration
```hcl
# infrastructure/lambda.tf
resource "aws_lambda_function" "user_api" {
  filename         = "user-api.zip"
  function_name    = "lince-user-api"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 30
  memory_size     = 256

  environment {
    variables = {
      DATABASE_URL = var.database_url
      NODE_ENV    = "production"
    }
  }

  dead_letter_config {
    target_arn = aws_sqs_queue.dlq.arn
  }
}

resource "aws_api_gateway_integration" "user_api" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.users.id
  http_method = aws_api_gateway_method.users_post.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.user_api.invoke_arn
}
```

### Deployment Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy Lince Functions

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build functions
        run: npm run build
      
      - name: Deploy to AWS
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          npm run deploy:staging
          npm run test:integration
          npm run deploy:production
```

## Monitoring y Observabilidad

### Distributed Tracing
```typescript
// shared/middleware/tracing.ts
import { trace } from '@opentelemetry/api';

export const tracingMiddleware = (handler: Function) => {
  return async (event: any, context: any) => {
    const tracer = trace.getTracer('lince-app');
    
    return tracer.startActiveSpan('lambda-execution', async (span) => {
      try {
        span.setAttributes({
          'function.name': context.functionName,
          'function.version': context.functionVersion,
          'request.id': context.awsRequestId
        });
        
        return await handler(event, context);
      } finally {
        span.end();
      }
    });
  };
};
```

### Custom Metrics
```typescript
// shared/monitoring/metrics.ts
import { CloudWatch } from 'aws-sdk';

const cloudwatch = new CloudWatch();

export const recordMetric = async (
  metricName: string,
  value: number,
  unit: string = 'Count'
) => {
  await cloudwatch.putMetricData({
    Namespace: 'Lince/Application',
    MetricData: [{
      MetricName: metricName,
      Value: value,
      Unit: unit,
      Timestamp: new Date()
    }]
  }).promise();
};

// Uso en functions
await recordMetric('UserCreated', 1);
await recordMetric('ResponseTime', responseTime, 'Milliseconds');
```

## Mejores Prácticas

### Security
```typescript
// shared/middleware/auth.ts
import { verify } from 'jsonwebtoken';

export const authMiddleware = (handler: Function) => {
  return async (event: any) => {
    const token = event.headers.Authorization?.replace('Bearer ', '');
    
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Missing token' })
      };
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!);
      event.user = decoded;
      return handler(event);
    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid token' })
      };
    }
  };
};
```

### Error Handling
```typescript
// shared/middleware/error-handler.ts
export const errorHandler = (handler: Function) => {
  return async (event: any) => {
    try {
      return await handler(event);
    } catch (error) {
      console.error('Function error:', error);
      
      // Send to monitoring service
      await recordMetric('Error', 1);
      
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Internal server error',
          requestId: event.requestContext?.requestId
        })
      };
    }
  };
};
```

### Caching Strategy
```typescript
// shared/cache/redis.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL, {
  connectTimeout: 1000,
  lazyConnect: true
});

export const withCache = (ttl: number = 300) => {
  return (handler: Function) => {
    return async (event: any) => {
      const cacheKey = generateCacheKey(event);
      
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (error) {
        // Fallback to handler if cache fails
      }
      
      const result = await handler(event);
      
      try {
        await redis.setex(cacheKey, ttl, JSON.stringify(result));
      } catch (error) {
        // Log but don't fail
      }
      
      return result;
    };
  };
};
```

## Ventajas para Lince

1. **Time-to-Market**: Despliegues instantáneos y desarrollo rápido
2. **Escalabilidad**: Auto-scaling sin configuración
3. **Costos**: Pay-per-use real, sin servidores ociosos
4. **Mantenimiento**: Zero server management
5. **Performance**: Edge computing y optimizaciones automáticas
6. **Desarrollo**: Focus en lógica de negocio, no en infraestructura
