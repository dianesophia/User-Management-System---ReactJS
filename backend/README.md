# User Management System - Backend

NestJS backend API with JWT authentication and role-based access control.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the backend directory:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=user_management

# JWT
JWT_SECRET_KEY=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=3600

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Run Development Server

```bash
npm run start:dev
```

Server runs at `http://localhost:3000`
Swagger docs at `http://localhost:3000/api`

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start development server with hot reload |
| `npm run start:prod` | Start production server |
| `npm run build` | Build for production |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Run tests with coverage |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## 🔐 Authentication

### Register Admin User

The first user with email `admin@example.com` automatically receives admin privileges:

```bash
POST /auth/register
{
  "email": "admin@example.com",
  "password": "admin12345",
  "firstName": "Admin",
  "lastName": "User",
  "phoneNumber": "09999999999",
  "address": "Admin Address",
  "gender": "male"
}
```

### Login

```bash
POST /auth/login
{
  "email": "admin@example.com",
  "password": "admin12345"
}
```

Response:
```json
{
  "token": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "role": "admin",
    ...
  }
}
```

### Using Protected Endpoints

Include the JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer <accessToken>" http://localhost:3000/users
```

## 🛡️ Role-Based Access Control

### Roles

- **Admin**: Full access to all endpoints
- **User**: Limited access (own profile only)

### Implementation

```typescript
@Controller('users')
@UseGuards(JWTAuthGuard, RolesGuard)
export class UsersController {
  
  @Get()
  @Roles(Role.ADMIN)  // Admin only
  findAll() { ... }
  
  @Put('me')  // Any authenticated user
  updateProfile() { ... }
}
```

### How Guards Work

1. **JWTAuthGuard** runs first:
   - Validates JWT token
   - Fetches user from database (including role)
   - Attaches user to `request.user`

2. **RolesGuard** runs second:
   - Checks `@Roles()` decorator
   - Compares `request.user.role` with required roles
   - Allows or denies access

## 🧪 Testing

### Run All E2E Tests

```bash
npm run test:e2e
```

### Run Specific Test File

```bash
npm run test:e2e -- users.controller.spec.ts
```

### Test Coverage

```bash
npm run test:cov
```

### Test Details

The E2E tests (`test/users.controller.spec.ts`) cover:

1. **Setup**
   - Clears database before tests
   - Registers admin user
   - Logs in to get JWT token

2. **CRUD Operations**
   - ✅ Create user (POST /users)
   - ✅ Get all users (GET /users)
   - ✅ Get user by ID (GET /users/:id)
   - ✅ Update user (PUT /users/:id)
   - ✅ Delete user (DELETE /users/:id)

3. **Cleanup**
   - Closes application after tests

## 📁 Project Structure

```
backend/
├── src/
│   ├── auth/                     # Authentication module
│   │   ├── roles/               # RBAC implementation
│   │   │   ├── roles.decorator.ts    # @Roles() decorator
│   │   │   └── roles.guard.ts        # Role guard implementation
│   │   ├── dto/                 # Data transfer objects
│   │   │   ├── auth.dto.ts
│   │   │   └── users.dto.ts
│   │   ├── auth.controller.ts   # Auth endpoints
│   │   ├── auth.service.ts      # Auth business logic
│   │   ├── auth.guard.ts        # JWT authentication guard
│   │   ├── auth.strategy.ts     # Passport JWT strategy
│   │   ├── auth.helper.ts       # Auth utilities
│   │   ├── auth.type.ts         # Auth types
│   │   └── auth.module.ts
│   │
│   ├── users/                   # Users module
│   │   ├── enums/
│   │   │   ├── role.enum.ts         # Role enum (admin, user)
│   │   │   └── gender.enum.ts       # Gender enum
│   │   ├── users.controller.ts  # User CRUD endpoints
│   │   ├── users.service.ts     # User business logic
│   │   ├── users.entity.ts      # User database entity
│   │   └── users.module.ts
│   │
│   ├── common/                  # Common utilities
│   │   ├── helper/
│   │   └── password.utility.ts
│   │
│   ├── shared/                  # Shared modules
│   │   └── typeorm/
│   │       └── typeorm.service.ts
│   │
│   ├── app.module.ts            # Root module
│   └── main.ts                  # Application entry point
│
├── test/                        # E2E tests
│   ├── users.controller.spec.ts # User CRUD tests
│   └── jest-e2e.json           # Jest E2E config
│
├── .env                         # Environment variables
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

## 🔑 Key Features

### Security
- ✅ JWT authentication with refresh tokens
- ✅ Bcrypt password hashing
- ✅ Role-based access control (RBAC)
- ✅ Input validation with class-validator
- ✅ CORS protection
- ✅ Guard-based route protection

### Database
- ✅ TypeORM with MySQL
- ✅ Entity relationships
- ✅ Soft delete functionality
- ✅ Automatic timestamps

### API Documentation
- ✅ Swagger/OpenAPI documentation
- ✅ Interactive API testing
- ✅ Bearer token authentication in Swagger

## 🐛 Troubleshooting

### Database Connection Issues

```bash
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution**: Ensure MySQL is running and credentials in `.env` are correct.

### JWT Secret Not Set

```bash
BadRequestException: JWT Secret is not set
```

**Solution**: Add `JWT_SECRET_KEY` to your `.env` file.

### Tests Failing with 403 Forbidden

```bash
expected 200 "OK", got 403 "Forbidden"
```

**Solution**: This was fixed! The RolesGuard now correctly checks both class and method-level decorators using `reflector.getAllAndOverride()`.

### Port Already in Use

```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**: Kill the process using port 3000 or change `PORT` in `.env`.

## 📖 API Endpoints Reference

### Auth Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/register` | POST | ❌ | Register new user |
| `/auth/login` | POST | ❌ | Login user |
| `/auth/refresh` | POST | ❌ | Refresh access token |
| `/auth/logout` | POST | ✅ | Logout user |
| `/auth/user` | GET | ✅ | Get current user |

### User Endpoints

| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/users` | GET | ✅ | Admin | Get all users |
| `/users/:id` | GET | ✅ | Admin | Get user by ID |
| `/users` | POST | ✅ | Admin | Create user |
| `/users/me` | PUT | ✅ | Any | Update own profile |
| `/users/:id` | PUT | ✅ | Admin | Update user |
| `/users/:id` | DELETE | ✅ | Admin | Delete user |

## 🔄 Database Migrations

TypeORM automatically syncs entities with the database in development mode. For production:

1. Set `synchronize: false` in TypeORM config
2. Use migrations:

```bash
npm run migration:generate -- -n MigrationName
npm run migration:run
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Run Production Build

```bash
npm run start:prod
```

### Environment Variables

Ensure all production environment variables are set:
- Use strong `JWT_SECRET_KEY`
- Set `NODE_ENV=production`
- Configure production database
- Set appropriate `CORS_ORIGIN`

## 📞 Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ using NestJS
