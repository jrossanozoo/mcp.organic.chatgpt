# Mejores Prácticas de Performance - Lince

## Filosofía de Performance-First

En Lince, el performance no es una consideración posterior sino el principio fundamental que guía todas las decisiones de desarrollo. Cada línea de código debe justificar su impacto en el rendimiento del sistema.

## Métricas Core de Performance

### 1. Métricas de Respuesta
- **TTFB (Time To First Byte)**: < 200ms
- **FCP (First Contentful Paint)**: < 1.5s
- **LCP (Largest Contentful Paint)**: < 2.5s
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FID (First Input Delay)**: < 100ms

### 2. Métricas de Sistema
- **Cold Start**: < 500ms para funciones serverless
- **Memory Usage**: Optimizar para el mínimo necesario
- **CPU Utilization**: Mantener bajo 70% en producción
- **Database Query Time**: < 50ms para queries simples

## Frontend Performance

### Code Splitting y Lazy Loading
```typescript
// ✅ Correcto - Dynamic imports para rutas
const UserProfile = lazy(() => import('./components/UserProfile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Route-based code splitting
const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Suspense fallback={<Spinner />}><Dashboard /></Suspense>
  },
  {
    path: "/profile",
    element: <Suspense fallback={<Spinner />}><UserProfile /></Suspense>
  }
]);

// Component-based lazy loading
const HeavyChart = lazy(() => 
  import('./HeavyChart').then(module => ({ default: module.HeavyChart }))
);
```

### Image Optimization
```typescript
// ✅ Correcto - Next.js Image optimization
import Image from 'next/image';

const ProductImage = ({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src}
    alt={alt}
    width={400}
    height={300}
    priority={false}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,..."
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
);

// Progressive image loading
const useProgressiveImage = (lowQualitySrc: string, highQualitySrc: string) => {
  const [src, setSrc] = useState(lowQualitySrc);
  
  useEffect(() => {
    const img = new Image();
    img.src = highQualitySrc;
    img.onload = () => setSrc(highQualitySrc);
  }, [highQualitySrc]);
  
  return src;
};
```

### Bundle Optimization
```javascript
// webpack.config.js - Optimizaciones Lince
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        common: {
          minChunks: 2,
          chunks: 'all',
          priority: 5
        }
      }
    },
    usedExports: true,
    sideEffects: false
  },
  resolve: {
    alias: {
      // Tree-shaking optimizations
      'lodash': 'lodash-es',
      'moment': 'dayjs'
    }
  }
};

// Tree-shaking específico
// ❌ Incorrecto
import _ from 'lodash';

// ✅ Correcto
import { debounce, throttle } from 'lodash-es';
```

## Backend Performance

### Database Optimization
```typescript
// ✅ Correcto - Query optimization
class UserRepository {
  // Usar índices eficientemente
  async findActiveUsers(limit: number = 10): Promise<User[]> {
    return this.db.query(`
      SELECT u.id, u.email, u.name, u.last_active
      FROM users u
      WHERE u.status = 'active'
        AND u.last_active > NOW() - INTERVAL '30 days'
      ORDER BY u.last_active DESC
      LIMIT $1
    `, [limit]);
  }

  // Batch operations
  async createUsers(users: CreateUserDTO[]): Promise<User[]> {
    const values = users.map((user, index) => 
      `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`
    ).join(', ');
    
    const params = users.flatMap(user => [user.email, user.name, user.status]);
    
    return this.db.query(`
      INSERT INTO users (email, name, status)
      VALUES ${values}
      RETURNING *
    `, params);
  }

  // Connection pooling
  private static pool = new Pool({
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  });
}
```

### Caching Strategies
```typescript
// Multi-layer caching
class CacheService {
  private memoryCache = new Map<string, CacheItem>();
  private redis: Redis;

  async get<T>(key: string): Promise<T | null> {
    // L1: Memory cache (fastest)
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem && !this.isExpired(memoryItem)) {
      return memoryItem.value;
    }

    // L2: Redis cache
    try {
      const redisValue = await this.redis.get(key);
      if (redisValue) {
        const parsed = JSON.parse(redisValue);
        this.memoryCache.set(key, {
          value: parsed,
          expiry: Date.now() + 60000 // 1 min memory cache
        });
        return parsed;
      }
    } catch (error) {
      console.warn('Redis cache miss:', error);
    }

    return null;
  }

  async set<T>(key: string, value: T, ttl: number = 300): Promise<void> {
    // Set in both layers
    this.memoryCache.set(key, {
      value,
      expiry: Date.now() + Math.min(ttl * 1000, 60000)
    });

    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.warn('Redis cache set failed:', error);
    }
  }
}

// Cache patterns
const withCache = <T>(
  cacheKey: string,
  fn: () => Promise<T>,
  ttl: number = 300
) => {
  return async (): Promise<T> => {
    const cached = await cacheService.get<T>(cacheKey);
    if (cached) return cached;

    const result = await fn();
    await cacheService.set(cacheKey, result, ttl);
    return result;
  };
};
```

### API Performance
```typescript
// Rate limiting y throttling
import { RateLimiterRedis } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'lince_rl',
  points: 100, // requests
  duration: 60, // per 60 seconds
  blockDuration: 60 // block for 60 seconds if exceeded
});

const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000)
    });
  }
};

// Response compression
import compression from 'compression';

app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    return compression.filter(req, res) && 
           !req.headers['x-no-compression'];
  }
}));

// HTTP/2 Push
app.get('/dashboard', (req, res) => {
  // Push critical resources
  if (res.push) {
    res.push('/css/dashboard.css');
    res.push('/js/dashboard.js');
  }
  res.render('dashboard');
});
```

## Serverless Performance

### Cold Start Optimization
```typescript
// ✅ Correcto - Initialization outside handler
import { DynamoDB } from 'aws-sdk';
import { Pool } from 'pg';

// Initialize connections outside
const dynamodb = new DynamoDB.DocumentClient();
const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1 // Single connection for serverless
});

// Pre-compute heavy operations
const CONFIG = JSON.parse(process.env.APP_CONFIG || '{}');

export const handler = async (event: APIGatewayEvent) => {
  // Handler logic here - connections already initialized
  const result = await dynamodb.get({
    TableName: 'Users',
    Key: { id: event.pathParameters?.id }
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item)
  };
};

// Bundle size optimization
import { S3 } from 'aws-sdk/clients/s3'; // Import only needed services
```

### Edge Computing
```typescript
// Cloudflare Workers - Edge performance
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Cache at edge
    const cacheKey = `edge:${url.pathname}`;
    const cached = await env.CACHE.get(cacheKey);
    
    if (cached) {
      return new Response(cached, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
          'X-Cache': 'HIT'
        }
      });
    }

    // Geo-routing para latencia mínima
    const country = request.cf?.country || 'US';
    const region = getOptimalRegion(country);
    const apiUrl = `https://api-${region}.lince.com${url.pathname}`;

    const response = await fetch(apiUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });

    const data = await response.text();
    
    // Cache for 5 minutes
    await env.CACHE.put(cacheKey, data, { expirationTtl: 300 });

    return new Response(data, {
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'MISS',
        'X-Region': region
      }
    });
  }
};
```

## Performance Monitoring

### Real User Monitoring
```typescript
// Performance API integration
class PerformanceMonitor {
  static trackPageLoad(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');

        const metrics = {
          ttfb: navigation.responseStart - navigation.requestStart,
          domComplete: navigation.domComplete - navigation.domLoading,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
        };

        // Send to analytics
        this.sendMetrics('page-load', metrics);
      }, 0);
    });
  }

  static trackApiCall(endpoint: string, startTime: number): void {
    const duration = performance.now() - startTime;
    this.sendMetrics('api-call', {
      endpoint,
      duration,
      timestamp: Date.now()
    });
  }

  private static sendMetrics(type: string, data: any): void {
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
      keepalive: true // Important for page unload
    }).catch(() => {
      // Fallback to beacon API
      navigator.sendBeacon('/api/metrics', 
        JSON.stringify({ type, data })
      );
    });
  }
}
```

### Performance Testing
```typescript
// Load testing con Artillery
// artillery.yml
config:
  target: 'https://api.lince.com'
  phases:
    - duration: 60
      arrivalRate: 10
      rampTo: 50
    - duration: 120
      arrivalRate: 50
    - duration: 60
      arrivalRate: 50
      rampTo: 10

scenarios:
  - name: "User journey"
    flow:
      - post:
          url: "/auth/login"
          json:
            email: "test@lince.com"
            password: "password"
          capture:
            - json: "$.token"
              as: "token"
      - get:
          url: "/api/users/profile"
          headers:
            Authorization: "Bearer {{ token }}"
      - post:
          url: "/api/orders"
          headers:
            Authorization: "Bearer {{ token }}"
          json:
            productId: "{{ $randomInt(1, 1000) }}"
            quantity: "{{ $randomInt(1, 5) }}"

// Benchmark testing
describe('Performance Benchmarks', () => {
  it('should handle user creation under 100ms', async () => {
    const startTime = performance.now();
    
    await userService.createUser(validUserData);
    
    const duration = performance.now() - startTime;
    expect(duration).toBeLessThan(100);
  });

  it('should handle 1000 concurrent requests', async () => {
    const requests = Array(1000).fill(null).map(() => 
      userService.getUser('user-123')
    );

    const startTime = performance.now();
    await Promise.all(requests);
    const duration = performance.now() - startTime;

    expect(duration).toBeLessThan(5000); // 5 seconds for 1000 requests
  });
});
```

## Performance Checklist

### Pre-Deployment
- [ ] Bundle size analysis completado
- [ ] Database queries optimizadas
- [ ] Cache strategy implementada
- [ ] Images optimizadas
- [ ] Critical CSS inlined
- [ ] Tree-shaking configurado
- [ ] Code splitting implementado

### Production
- [ ] CDN configurado
- [ ] Gzip/Brotli habilitado
- [ ] HTTP/2 activado
- [ ] Performance monitoring activo
- [ ] Error tracking configurado
- [ ] Alertas de performance configuradas

### Continuous Optimization
- [ ] Performance budgets definidos
- [ ] A/B testing de performance
- [ ] Regular performance audits
- [ ] Lighthouse CI integrado
