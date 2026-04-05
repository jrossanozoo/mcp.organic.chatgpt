# Estándares de Código TypeScript - Organic

## Convenciones de Naming

### Variables y Funciones
```typescript
// ✅ Correcto - camelCase
const userName = 'john_doe';
const calculateTotalPrice = (items: Item[]) => { ... };

// ❌ Incorrecto
const user_name = 'john_doe';
const CalculateTotalPrice = (items: Item[]) => { ... };
```

### Clases e Interfaces
```typescript
// ✅ Correcto - PascalCase
class UserService { ... }
interface PaymentGateway { ... }
type DatabaseConnection = { ... };

// ❌ Incorrecto
class userService { ... }
interface paymentGateway { ... }
```

### Constantes
```typescript
// ✅ Correcto - SCREAMING_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.organic.com';

// ❌ Incorrecto
const maxRetryAttempts = 3;
const apiBaseUrl = 'https://api.organic.com';
```

### Archivos y Directorios
```
// ✅ Correcto - kebab-case
user-service.ts
payment-gateway.interface.ts
database-connection.type.ts

// ❌ Incorrecto
UserService.ts
paymentGateway.interface.ts
database_connection.type.ts
```

## Estructura de Archivos

### Organización por Dominio
```
src/
├── domains/
│   ├── user/
│   │   ├── entities/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── controllers/
│   └── product/
│       ├── entities/
│       ├── repositories/
│       ├── services/
│       └── controllers/
├── shared/
│   ├── interfaces/
│   ├── types/
│   └── utils/
└── infrastructure/
```

### Naming de Archivos
```typescript
// Entidades
user.entity.ts
product.entity.ts

// Servicios
user.service.ts
email.service.ts

// Controladores
user.controller.ts
product.controller.ts

// Interfaces
payment-gateway.interface.ts
database-connection.interface.ts

// Types
api-response.type.ts
user-profile.type.ts

// Tests
user.service.test.ts
user.controller.spec.ts
```

## Configuración TypeScript

### tsconfig.json Recomendado
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Patrones de Código

### Error Handling
```typescript
// ✅ Correcto - Result Pattern
type Result<T, E = Error> = {
  success: true;
  data: T;
} | {
  success: false;
  error: E;
};

class UserService {
  async createUser(userData: CreateUserDTO): Promise<Result<User>> {
    try {
      const user = await this.userRepository.create(userData);
      return { success: true, data: user };
    } catch (error) {
      return { 
        success: false, 
        error: new Error(`Failed to create user: ${error.message}`) 
      };
    }
  }
}
```

### Validación de Entrada
```typescript
// ✅ Correcto - Usar bibliotecas de validación
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  age: z.number().min(18)
});

type CreateUserDTO = z.infer<typeof CreateUserSchema>;

class UserController {
  async createUser(req: Request, res: Response) {
    const validation = CreateUserSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        errors: validation.error.errors 
      });
    }

    // Procesar con datos validados
    const result = await this.userService.createUser(validation.data);
    // ...
  }
}
```

### Logging Estructurado
```typescript
// ✅ Correcto - Logger estructurado
import { Logger } from 'winston';

class UserService {
  constructor(private logger: Logger) {}

  async createUser(userData: CreateUserDTO): Promise<Result<User>> {
    this.logger.info('Creating user', { 
      email: userData.email,
      correlationId: this.getCorrelationId() 
    });

    try {
      // Lógica de creación
      this.logger.info('User created successfully', { 
        userId: user.id,
        email: userData.email 
      });
    } catch (error) {
      this.logger.error('Failed to create user', { 
        error: error.message,
        stack: error.stack,
        userData: this.sanitizeForLogging(userData)
      });
    }
  }
}
```

## Code Quality

### ESLint Configuración
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Prettier Configuración
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

## Testing Standards

### Unit Tests
```typescript
// user.service.test.ts
describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    userService = new UserService(mockUserRepository);
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      // Arrange
      const userData = createValidUserData();
      mockUserRepository.create.mockResolvedValue(mockUser);

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result.success).toBe(true);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
    });

    it('should return error when repository fails', async () => {
      // Arrange
      const userData = createValidUserData();
      mockUserRepository.create.mockRejectedValue(new Error('DB Error'));

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error.message).toContain('Failed to create user');
    });
  });
});
```

## Documentación

### JSDoc Comments
```typescript
/**
 * Service responsible for user management operations
 * Implements sustainable practices for resource usage
 */
class UserService {
  /**
   * Creates a new user in the system
   * @param userData - The user data to create
   * @returns Promise resolving to creation result
   * @throws {ValidationError} When user data is invalid
   * @example
   * ```typescript
   * const result = await userService.createUser({
   *   email: 'user@example.com',
   *   name: 'John Doe'
   * });
   * ```
   */
  async createUser(userData: CreateUserDTO): Promise<Result<User>> {
    // Implementation
  }
}
```

## Performance Guidelines

### Async/Await Best Practices
```typescript
// ✅ Correcto - Operaciones en paralelo
async function getUserData(userId: string) {
  const [user, preferences, permissions] = await Promise.all([
    userRepository.findById(userId),
    preferencesService.getByUserId(userId),
    permissionsService.getByUserId(userId)
  ]);

  return { user, preferences, permissions };
}

// ❌ Incorrecto - Operaciones secuenciales innecesarias
async function getUserData(userId: string) {
  const user = await userRepository.findById(userId);
  const preferences = await preferencesService.getByUserId(userId);
  const permissions = await permissionsService.getByUserId(userId);

  return { user, preferences, permissions };
}
```
