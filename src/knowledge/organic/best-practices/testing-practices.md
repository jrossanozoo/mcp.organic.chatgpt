# Mejores Prácticas de Testing - Organic

## Estrategia de Testing

### Pirámide de Testing Organic
```
    🔺 E2E Tests (10%)
   🔺🔺 Integration Tests (20%)
  🔺🔺🔺 Unit Tests (70%)
```

### Principios Fundamentales
1. **Fast**: Tests rápidos que ejecuten en milisegundos
2. **Independent**: Tests independientes entre sí
3. **Repeatable**: Resultados consistentes en cualquier ambiente
4. **Self-validating**: Resultado claro (pass/fail)
5. **Timely**: Escritos antes o junto con el código de producción

## Unit Testing

### Estructura AAA (Arrange, Act, Assert)
```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData: CreateUserDTO = {
        email: 'test@organic.com',
        name: 'Test User',
        age: 25
      };
      const expectedUser = new User('123', userData.email, userData.name);
      mockUserRepository.create.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(expectedUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
    });
  });
});
```

### Mocking Best Practices
```typescript
// ✅ Correcto - Mock específico y limpio
const mockUserRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
} as jest.Mocked<UserRepository>;

// ✅ Correcto - Factory para datos de test
const createTestUser = (overrides: Partial<User> = {}): User => ({
  id: '123',
  email: 'test@organic.com',
  name: 'Test User',
  createdAt: new Date('2024-01-01'),
  ...overrides
});

// ✅ Correcto - Reset entre tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

### Test Data Builders
```typescript
class UserBuilder {
  private userData: Partial<CreateUserDTO> = {};

  withEmail(email: string): UserBuilder {
    this.userData.email = email;
    return this;
  }

  withName(name: string): UserBuilder {
    this.userData.name = name;
    return this;
  }

  withAge(age: number): UserBuilder {
    this.userData.age = age;
    return this;
  }

  build(): CreateUserDTO {
    return {
      email: 'default@organic.com',
      name: 'Default User',
      age: 25,
      ...this.userData
    };
  }
}

// Uso en tests
it('should validate email format', () => {
  const invalidUserData = new UserBuilder()
    .withEmail('invalid-email')
    .build();

  const result = validateUser(invalidUserData);
  expect(result.isValid).toBe(false);
});
```

## Integration Testing

### Database Testing
```typescript
describe('UserRepository Integration', () => {
  let db: Database;
  let userRepository: UserRepository;

  beforeAll(async () => {
    db = await createTestDatabase();
    userRepository = new PostgresUserRepository(db);
  });

  afterAll(async () => {
    await db.close();
  });

  beforeEach(async () => {
    await db.seed('users'); // Limpia y siembra datos de test
  });

  it('should persist user to database', async () => {
    const userData = createTestUser();
    
    const savedUser = await userRepository.create(userData);
    const retrievedUser = await userRepository.findById(savedUser.id);

    expect(retrievedUser).toEqual(savedUser);
  });
});
```

### API Testing
```typescript
describe('User API Integration', () => {
  let app: Application;
  let server: Server;

  beforeAll(async () => {
    app = await createTestApp();
    server = app.listen(0); // Puerto aleatorio
  });

  afterAll(async () => {
    await server.close();
  });

  it('should create user via POST /users', async () => {
    const userData = {
      email: 'test@organic.com',
      name: 'Test User',
      age: 25
    };

    const response = await request(app)
      .post('/users')
      .send(userData)
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(String),
      email: userData.email,
      name: userData.name
    });
  });
});
```

## E2E Testing

### Cypress Best Practices
```typescript
// cypress/support/commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      createUser(userData: CreateUserData): Chainable<User>;
      loginAs(userType: 'admin' | 'user'): Chainable<void>;
    }
  }
}

Cypress.Commands.add('createUser', (userData) => {
  return cy.request('POST', '/api/users', userData).then(response => {
    return response.body;
  });
});

// cypress/e2e/user-management.cy.ts
describe('User Management Flow', () => {
  beforeEach(() => {
    cy.seedDatabase(); // Comando personalizado para limpiar DB
  });

  it('should allow admin to create and manage users', () => {
    cy.loginAs('admin');
    
    cy.visit('/admin/users');
    cy.get('[data-testid=create-user-btn]').click();
    
    cy.get('[data-testid=email-input]').type('newuser@organic.com');
    cy.get('[data-testid=name-input]').type('New User');
    cy.get('[data-testid=submit-btn]').click();

    cy.get('[data-testid=success-message]')
      .should('contain', 'User created successfully');
  });
});
```

## Test Configuration

### Jest Setup
```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/test/**/*'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testTimeout: 10000
};

// src/test/setup.ts
import 'reflect-metadata';

// Mock console para tests más limpios
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};
```

### Test Database Setup
```typescript
// src/test/database.ts
export class TestDatabase {
  private static instance: Database;

  static async getInstance(): Promise<Database> {
    if (!TestDatabase.instance) {
      TestDatabase.instance = await createConnection({
        type: 'postgres',
        host: process.env.TEST_DB_HOST || 'localhost',
        port: parseInt(process.env.TEST_DB_PORT || '5433'),
        database: `test_organic_${Date.now()}`, // DB única por test run
        entities: [User, Product, Order],
        synchronize: true,
        dropSchema: true
      });
    }
    return TestDatabase.instance;
  }

  static async cleanup(): Promise<void> {
    if (TestDatabase.instance) {
      await TestDatabase.instance.close();
    }
  }
}
```

## Mejores Prácticas por Tipo

### Domain Logic Testing
```typescript
describe('User Domain Logic', () => {
  it('should not allow user under 18 to register', () => {
    expect(() => {
      new User({
        email: 'minor@organic.com',
        name: 'Minor User',
        age: 17
      });
    }).toThrow('User must be at least 18 years old');
  });

  it('should calculate correct membership tier', () => {
    const user = new User(validUserData);
    user.addPurchase(new Purchase(500)); // Premium tier
    
    expect(user.membershipTier).toBe(MembershipTier.PREMIUM);
  });
});
```

### Service Layer Testing
```typescript
describe('UserService', () => {
  it('should send welcome email after user creation', async () => {
    const userData = createTestUser();
    mockEmailService.sendWelcomeEmail.mockResolvedValue(true);

    await userService.createUser(userData);

    expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(
      userData.email,
      expect.objectContaining({ name: userData.name })
    );
  });
});
```

### Error Scenarios Testing
```typescript
describe('Error Handling', () => {
  it('should handle database connection errors gracefully', async () => {
    mockUserRepository.create.mockRejectedValue(
      new Error('Connection timeout')
    );

    const result = await userService.createUser(validUserData);

    expect(result.success).toBe(false);
    expect(result.error.message).toContain('Failed to create user');
  });

  it('should handle validation errors properly', async () => {
    const invalidData = { email: 'invalid' };

    const result = await userService.createUser(invalidData);

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(ValidationError);
  });
});
```

## Coverage y Quality Gates

### Coverage Requirements
- **Statements**: Mínimo 80%
- **Branches**: Mínimo 80%
- **Functions**: Mínimo 80%
- **Lines**: Mínimo 80%

### Quality Metrics
```typescript
// package.json scripts
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:ci": "jest --ci --coverage --watchAll=false",
  "test:e2e": "cypress run",
  "test:all": "npm run test:ci && npm run test:e2e"
}
```

### CI/CD Integration
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:ci
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v1
```
