# User Management System

A full-stack user management application with JWT authentication, role-based access control (RBAC), and a modern UI built with React and NestJS.

![License](https://img.shields.io/badge/license-UNLICENSED-red)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7%2B-blue)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Authentication & Authorization](#authentication--authorization)
- [Contributing](#contributing)

## ✨ Features

### Authentication & Authorization
- 🔐 **JWT-based Authentication** - Secure token-based authentication
- 👥 **Role-Based Access Control (RBAC)** - Admin and User roles with different permissions
- 🔄 **Refresh Token Support** - Automatic token refresh for seamless user experience
- 🛡️ **Route Guards** - Protected routes with JWT and Role guards

### User Management
- ✅ **Complete CRUD Operations** - Create, Read, Update, Delete users
- 👤 **User Profile Management** - Users can update their own profiles
- 🗑️ **Soft Delete** - Users are soft-deleted, preserving data integrity
- 🔍 **User Listing** - Admin can view all users

### Security Features
- 🔒 **Password Hashing** - Bcrypt encryption for secure password storage
- ✋ **Input Validation** - Class-validator for robust input validation
- 🚫 **Forbidden Access Handling** - Clear error messages for unauthorized access
- 🌐 **CORS Protection** - Configured CORS for secure cross-origin requests

### Developer Experience
- 📚 **Swagger API Documentation** - Interactive API documentation at `/api`
- 🧪 **Comprehensive Tests** - E2E tests for all CRUD operations
- 🎨 **Modern UI** - Built with React, TailwindCSS, and Radix UI
- 🔥 **Hot Reload** - Development mode with instant reload

## 🛠 Tech Stack

### Backend
- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[TypeORM](https://typeorm.io/)** - ORM for database management
- **[MySQL](https://www.mysql.com/)** - Relational database
- **[JWT](https://jwt.io/)** - JSON Web Tokens for authentication
- **[Passport](http://www.passportjs.org/)** - Authentication middleware
- **[Bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Password hashing
- **[Class Validator](https://github.com/typestack/class-validator)** - Input validation
- **[Swagger](https://swagger.io/)** - API documentation

### Frontend
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vite.dev/)** - Build tool and dev server
- **[TailwindCSS 4](https://tailwindcss.com/)** - Utility-first CSS
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI components
- **[React Router](https://reactrouter.com/)** - Client-side routing
- **[Axios](https://axios-http.com/)** - HTTP client

### Testing
- **[Jest](https://jestjs.io/)** - Testing framework
- **[Supertest](https://github.com/ladjs/supertest)** - HTTP assertions

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "User Management System"
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=user_management

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=3600  # 1 hour in seconds

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```

### Database Setup

1. Create a MySQL database:

```sql
CREATE DATABASE user_management;
```

2. The tables will be automatically created by TypeORM when you start the backend server.

## 🏃 Running the Application

### Development Mode

#### Start Backend Server

```bash
cd backend
npm run start:dev
```

The backend server will start at `http://localhost:3000`
- API Documentation: `http://localhost:3000/api`

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start at `http://localhost:5173`

### Production Mode

#### Build and Run Backend

```bash
cd backend
npm run build
npm run start:prod
```

#### Build and Serve Frontend

```bash
cd frontend
npm run build
npm run preview
```

## 📚 API Documentation

Once the backend is running, visit `http://localhost:3000/api` to access the interactive Swagger documentation.

### Authentication Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/auth/register` | Register a new user | None |
| POST | `/auth/login` | Login with email and password | None |
| POST | `/auth/refresh` | Refresh access token | None |
| POST | `/auth/logout` | Logout user | JWT |
| GET | `/auth/user` | Get current user profile | JWT |

### User Management Endpoints

| Method | Endpoint | Description | Authentication | Role |
|--------|----------|-------------|----------------|------|
| GET | `/users` | Get all users | JWT | Admin |
| GET | `/users/:id` | Get user by ID | JWT | Admin |
| POST | `/users` | Create a new user | JWT | Admin |
| PUT | `/users/me` | Update own profile | JWT | Any |
| PUT | `/users/:id` | Update user by ID | JWT | Admin |
| DELETE | `/users/:id` | Delete user (soft delete) | JWT | Admin |

### Authentication Flow

1. **Register**: Create an account at `/auth/register`
   - Users with email `admin@example.com` automatically get Admin role
   - Other users get User role by default

2. **Login**: Get JWT tokens at `/auth/login`
   - Returns `accessToken` and `refreshToken`

3. **Access Protected Routes**: Include token in Authorization header
   ```
   Authorization: Bearer <access_token>
   ```

4. **Refresh Token**: Use `/auth/refresh` when access token expires

## 🧪 Testing

### Run E2E Tests

```bash
cd backend
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

### Test Results

All CRUD operations are tested:
- ✅ Create user
- ✅ Read all users
- ✅ Read user by ID
- ✅ Update user
- ✅ Delete user

## 📁 Project Structure

```
User Management System/
├── backend/
│   ├── src/
│   │   ├── auth/                 # Authentication module
│   │   │   ├── roles/           # Role-based access control
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.guard.ts    # JWT Auth Guard
│   │   │   ├── auth.strategy.ts # JWT Strategy
│   │   │   ├── auth.helper.ts
│   │   │   └── dto/
│   │   ├── users/               # Users module
│   │   │   ├── enums/
│   │   │   │   ├── role.enum.ts
│   │   │   │   └── gender.enum.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.entity.ts
│   │   ├── common/              # Common utilities
│   │   ├── shared/              # Shared modules
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/                    # E2E tests
│   │   ├── users.controller.spec.ts
│   │   └── jest-e2e.json
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   └── Unauthorized.tsx
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── users.service.ts
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── assets/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── README.md (this file)
```

## 🔐 Authentication & Authorization

### How It Works

1. **JWT Authentication Guard** (`JWTAuthGuard`)
   - Validates JWT tokens
   - Attaches user object to request
   - Runs before RolesGuard

2. **Roles Guard** (`RolesGuard`)
   - Checks user roles against required roles
   - Uses `@Roles()` decorator
   - Checks both class-level and method-level decorators
   - Throws `403 Forbidden` if access denied

3. **User Roles**
   - **Admin**: Full access to all endpoints
   - **User**: Limited access (can only update own profile)

### Example Usage

```typescript
@Controller('users')
@UseGuards(JWTAuthGuard, RolesGuard)  // Applied to all routes
export class UsersController {
  
  @Get()
  @Roles(Role.ADMIN)  // Only admins can access
  findAll() {
    return this.usersService.findAll();
  }
  
  @Put('me')  // No @Roles decorator, any authenticated user can access
  update(@Request() req, @Body() body) {
    return this.usersService.update(req.user.id, body);
  }
}
```

## 🎯 Key Implementation Details

### RolesGuard Implementation

The RolesGuard uses `reflector.getAllAndOverride()` to check for `@Roles()` decorators at both the class and method level:

```typescript
const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
  context.getHandler(),  // Method level
  context.getClass(),     // Class level
]);
```

This ensures proper role-based access control throughout the application.

### Password Security

- Passwords are hashed using bcrypt with a salt round of 10
- Plain text passwords are never stored in the database
- Password comparison is done securely using bcrypt's compare function

### Soft Delete

Users are soft-deleted using TypeORM's `@DeleteDateColumn`:
- Deleted users have a `deletedAt` timestamp
- Deleted users are automatically excluded from queries
- Data can be recovered if needed

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is UNLICENSED - see the package.json for details.

## 👨‍💻 Author

Built with ❤️ by Diane

## 🐛 Known Issues

None at the moment. Please report any issues you encounter.

## 🔮 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] User profile pictures
- [ ] Activity logs
- [ ] Advanced filtering and pagination
- [ ] Export users to CSV/PDF
- [ ] Rate limiting
- [ ] Account lockout after failed login attempts

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Happy Coding! 🚀**
