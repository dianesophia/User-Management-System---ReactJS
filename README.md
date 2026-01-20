# User Management Portal

A full-stack web application for managing users with role-based access control, built with React, TypeScript, NestJS, and MySQL.

## 📋 Description

The User Management Portal is a modern, secure application that provides comprehensive user management functionality. It features separate dashboards for administrators and regular users, with authentication, authorization, and full CRUD operations. The application is built with a focus on security, usability, and clean code architecture.

## ✨ Features

### Authentication & Authorization
- **User Registration**: New users can create accounts with email verification and strong password requirements
- **Secure Login**: JWT-based authentication with token refresh mechanism
- **Role-Based Access Control**: Separate access levels for Admin and User roles
- **Protected Routes**: Automatic redirection based on user roles and authentication status

### Admin Dashboard
- **User Management**: Create, view, edit, and delete user accounts
- **Search Functionality**: Quickly find users by name or email
- **Profile Management**: Admins can edit their own profile and change passwords
- **Real-time Updates**: Automatic refresh after CRUD operations
- **Secure Actions**: Confirmation dialogs for destructive operations

### User Dashboard
- **Profile Viewing**: Users can view their complete profile information
- **Profile Editing**: Update personal information including name, email, phone, address, and gender
- **Password Management**: Secure password change with validation
- **User-Friendly Interface**: Clean, intuitive design with real-time validation

### Security Features
- **Password Strength Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&#)
- **JWT Token Authentication**: Secure API communication
- **Input Validation**: Both client-side and server-side validation


## Installation / Setup


### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the backend directory with the following:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_DATABASE=user_management

   # JWT Configuration
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRATION=1h
   JWT_REFRESH_SECRET=your_refresh_secret_key_here
   JWT_REFRESH_EXPIRATION=7d

   # Application
   PORT=3000
   ```

4. **Create the MySQL database**:
   ```sql
   CREATE DATABASE user_management;
   ```

5. **Start the backend server**:
   ```bash
   # Development mode
   npm run start:dev

   ```

   The backend will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables** (optional):
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`


## Usage

### First Time Setup

1. **Start both backend and frontend servers** as described in the installation section.

2. **Access the application** at `http://localhost:5173`

3. **Register a new account**:
   - Click on "Create Account" or "Register"
   - Fill in all required fields
   - Ensure password meets strength requirements
   - Submit the form

4. **Login** with your credentials

### Admin Features

To create an admin user, you need to manually update the user's role in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

**Admin Dashboard Features**:
- View all users in a searchable table
- Create new users with the "New User" button
- View user details by clicking the eye icon
- Edit users by clicking the pencil icon
- Delete users by clicking the trash icon (cannot delete yourself)
- Access "My Profile" to edit admin profile and change password
- Logout using the "Exit" button in My Profile or header

### User Features

**User Dashboard Features**:
- View personal profile information
- Click "Edit" to update profile details
- Change password (optional during profile update)
- Logout using the logout button

### Password Requirements

All passwords must meet the following criteria:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&#)

##  Testing

The project uses **Jest** for unit and integration testing.

### Running Backend Tests

```bash
cd backend

# Run all tests
npm test

### Test Coverage

The backend includes tests for:
- User controller endpoints
- Authentication flows
- CRUD operations
- Role-based access control

## Screenshots

### Login Page
![Login Page](./frontend/src/assets/screenshots/login.png)
*Secure login interface with email and password fields*

### Registration Page
![Registration Page](./frontend/src/assets/screenshots/register.png)
*User registration form with comprehensive validation*

### Admin Dashboard
![Admin Dashboard](./frontend/src/assets/screenshots/adminDashboard.png)
*Admin panel with user management table and search functionality*

### User Dashboard
![User Dashboard](./frontend/src/assets/screenshots/userDashboard.png)
*User profile view and edit interface*

### Jest Test Results
![Jest Test Results](./frontend/src/assets/screenshots/jestResults.png)
*Comprehensive test coverage with Jest*

## Technologies Used

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Class Variance Authority** - Component variants

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - ORM for TypeScript and JavaScript
- **MySQL** - Relational database
- **JWT (Passport)** - Authentication and authorization
- **Bcrypt** - Password hashing
- **Class Validator** - Validation decorators
- **Swagger** - API documentation


## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile
- `POST /auth/refresh` - Refresh JWT token

### Users (Protected)
- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get user by ID (Admin only)
- `POST /users` - Create new user (Admin only)
- `PATCH /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Delete user (Admin only)
- `PATCH /users/me` - Update own profile (Authenticated users)

