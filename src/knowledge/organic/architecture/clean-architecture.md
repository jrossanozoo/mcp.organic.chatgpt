---
id: organic-clean-architecture
title: Clean Architecture para Organic
description: Implementación de Clean Architecture adaptada a los principios de sostenibilidad de Organic
tags: [architecture, clean-architecture, organic, sustainability]
version: 1.0.0
relatedItems: [organic-microservices-pattern, organic-ddd-pattern]
---

# Clean Architecture Organic

## Visión General

La Clean Architecture en Organic se enfoca en crear sistemas mantenibles y sostenibles a largo plazo, priorizando la separación de responsabilidades y la independencia de frameworks.

## Estructura de Capas

### 1. Entities (Núcleo)
```typescript
// src/entities/User.ts
export class User {
  constructor(
    private readonly id: UserId,
    private readonly email: Email,
    private readonly profile: UserProfile
  ) {}

  updateProfile(newProfile: UserProfile): User {
    // Lógica de negocio pura
    return new User(this.id, this.email, newProfile);
  }
}
```

### 2. Use Cases (Casos de Uso)
```typescript
// src/use-cases/CreateUser.ts
export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService
  ) {}

  async execute(userData: CreateUserRequest): Promise<User> {
    const user = new User(userData);
    await this.userRepository.save(user);
    await this.emailService.sendWelcomeEmail(user.email);
    return user;
  }
}
```

### 3. Interface Adapters
```typescript
// src/adapters/controllers/UserController.ts
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.createUserUseCase.execute(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

### 4. Frameworks & Drivers
```typescript
// src/infrastructure/database/UserRepository.ts
export class PostgresUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    // Implementación específica de PostgreSQL
  }
}
```

## Principios Organic Aplicados

### Inversión de Dependencias
- Las capas internas no dependen de las externas
- Uso de interfaces para abstraer dependencias
- Inyección de dependencias centralizada

### Separación de Responsabilidades
- Entities: Lógica de negocio pura
- Use Cases: Orquestación de flujos
- Adapters: Transformación de datos
- Infrastructure: Detalles técnicos

### Testabilidad
```typescript
// tests/use-cases/CreateUser.test.ts
describe('CreateUserUseCase', () => {
  it('should create user and send welcome email', async () => {
    const mockUserRepo = new MockUserRepository();
    const mockEmailService = new MockEmailService();
    const useCase = new CreateUserUseCase(mockUserRepo, mockEmailService);

    const result = await useCase.execute(validUserData);

    expect(mockUserRepo.saveCalled).toBe(true);
    expect(mockEmailService.emailSent).toBe(true);
  });
});
```

## Estructura de Proyecto

```
src/
├── entities/           # Entidades de dominio
├── use-cases/          # Casos de uso
├── adapters/
│   ├── controllers/    # Controladores web
│   ├── presenters/     # Formateo de respuestas
│   └── gateways/       # Interfaces externas
├── infrastructure/
│   ├── database/       # Implementaciones de BD
│   ├── web/           # Framework web
│   └── external/      # APIs externas
└── main/              # Composición e inyección
```

## Configuración de Dependencias

```typescript
// src/main/composition-root.ts
export class CompositionRoot {
  private static instance: CompositionRoot;

  public readonly userRepository: UserRepository;
  public readonly createUserUseCase: CreateUserUseCase;
  public readonly userController: UserController;

  private constructor() {
    this.userRepository = new PostgresUserRepository();
    this.createUserUseCase = new CreateUserUseCase(
      this.userRepository,
      new EmailService()
    );
    this.userController = new UserController(this.createUserUseCase);
  }

  static getInstance(): CompositionRoot {
    if (!CompositionRoot.instance) {
      CompositionRoot.instance = new CompositionRoot();
    }
    return CompositionRoot.instance;
  }
}
```

## Ventajas para Organic

1. **Mantenibilidad**: Código más fácil de mantener y evolucionar
2. **Testabilidad**: Testing independiente de frameworks
3. **Flexibilidad**: Fácil cambio de tecnologías externas
4. **Sostenibilidad**: Arquitectura que perdura en el tiempo
5. **Claridad**: Separación clara de responsabilidades

## Mejores Prácticas

- Usar Value Objects para validaciones
- Implementar Domain Events para comunicación
- Aplicar SOLID principles consistentemente
- Documentar interfaces claramente
- Mantener entities libres de dependencias externas
