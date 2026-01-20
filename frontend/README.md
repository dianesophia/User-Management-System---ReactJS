# User Management System - Frontend

Modern React frontend with TypeScript, TailwindCSS, and Radix UI components.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend server running on `http://localhost:3000`

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Application runs at `http://localhost:5173`

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## 🎨 Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **TailwindCSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **React Router v7** - Client-side routing
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx          # Login page
│   │   │   └── Register.tsx       # Registration page
│   │   └── Unauthorized.tsx       # 403 error page
│   │
│   ├── services/
│   │   ├── auth.service.ts        # Authentication API calls
│   │   └── users.service.ts       # User management API calls
│   │
│   ├── hooks/
│   │   └── use-mobile.ts          # Mobile detection hook
│   │
│   ├── lib/
│   │   └── utils.ts               # Utility functions (cn, etc.)
│   │
│   ├── assets/
│   │   ├── logo.png
│   │   └── react.svg
│   │
│   ├── App.tsx                    # Main app component
│   ├── App.css                    # App-specific styles
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles
│
├── public/                        # Static assets
├── .env                          # Environment variables
├── .gitignore
├── components.json               # Radix UI config
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔐 Authentication Flow

### 1. Register

Navigate to `/register` or use the registration form:

```typescript
// Example registration
await authService.register({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '09123456789',
  address: '123 Main St',
  gender: 'male'
});
```

### 2. Login

Navigate to `/login`:

```typescript
// Example login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Response contains:
// - token.accessToken
// - token.refreshToken
// - user object
```

### 3. Authenticated Requests

The auth service automatically includes the JWT token in requests:

```typescript
// Token is automatically included in Authorization header
const users = await usersService.getAllUsers();
```

### 4. Token Storage

Tokens are stored in `localStorage`:
- `accessToken` - Used for API requests
- `refreshToken` - Used to refresh expired access tokens
- `user` - Current user data

## 🎯 Services

### Auth Service (`src/services/auth.service.ts`)

```typescript
import { authService } from './services/auth.service';

// Register new user
await authService.register(userData);

// Login
const { token, user } = await authService.login(credentials);

// Refresh token
await authService.refresh(refreshToken);

// Logout
authService.logout();

// Get current user
const currentUser = authService.getCurrentUser();

// Check if authenticated
const isAuth = authService.isAuthenticated();
```

### Users Service (`src/services/users.service.ts`)

```typescript
import { usersService } from './services/users.service';

// Get all users (Admin only)
const users = await usersService.getAllUsers();

// Get user by ID (Admin only)
const user = await usersService.getUserById(userId);

// Create user (Admin only)
await usersService.createUser(userData);

// Update own profile
await usersService.updateOwnProfile(updates);

// Update user (Admin only)
await usersService.updateUser(userId, updates);

// Delete user (Admin only)
await usersService.deleteUser(userId);
```

## 🎨 UI Components

### Using Radix UI Components

The project uses Radix UI for accessible, unstyled components:

```tsx
import { Dialog } from '@radix-ui/react-dialog';
import { Label } from '@radix-ui/react-label';
import { Separator } from '@radix-ui/react-separator';

// Example usage
<Dialog>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Title</Dialog.Title>
    <Dialog.Description>Description</Dialog.Description>
  </Dialog.Content>
</Dialog>
```

### Using TailwindCSS

TailwindCSS 4 is used for styling:

```tsx
<button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
  Click me
</button>
```

### Utility Function

The `cn()` utility combines Tailwind classes:

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  condition && 'conditional-classes',
  'more-classes'
)}>
```

## 🛣️ Routing

Using React Router v7:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/unauthorized" element={<Unauthorized />} />
    {/* Add more routes */}
  </Routes>
</BrowserRouter>
```

## 🔒 Protected Routes

To protect routes that require authentication:

```tsx
import { Navigate } from 'react-router-dom';
import { authService } from './services/auth.service';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Usage
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## 🎨 Styling Best Practices

### TailwindCSS Conventions

```tsx
// ✅ Good: Responsive design
<div className="w-full px-4 md:w-1/2 lg:w-1/3">

// ✅ Good: Dark mode support
<div className="bg-white text-black dark:bg-gray-900 dark:text-white">

// ✅ Good: Hover states
<button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700">
```

### Component Organization

```tsx
// ✅ Good: Organized component
const Button = ({ variant, size, children, ...props }) => {
  return (
    <button
      className={cn(
        'rounded-md font-medium transition-colors',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-900',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'lg' && 'px-6 py-3 text-lg'
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

## 🚀 Build & Deploy

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Environment Variables in Production

Make sure to set `VITE_API_URL` to your production backend URL:

```env
VITE_API_URL=https://api.yourapp.com
```

## 🐛 Troubleshooting

### CORS Issues

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution**: Ensure backend CORS is configured to allow your frontend origin.

### API Connection Failed

```
Network Error / Connection Refused
```

**Solution**: Check that `VITE_API_URL` is correct and backend is running.

### Token Expired

```
401 Unauthorized
```

**Solution**: Implement automatic token refresh or redirect to login.

### Build Warnings

```
(!) Some chunks are larger than 500 KiB
```

**Solution**: Use code splitting and lazy loading:

```tsx
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

## 🔧 Configuration

### Vite Config

Customize `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});
```

### TypeScript Config

The project uses strict TypeScript settings for better type safety.

### Tailwind Config

Customize colors, fonts, and more in `tailwind.config.js`.

## 📱 Responsive Design

The application is mobile-first and responsive:

```tsx
// Example responsive layout
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* Content */}
</div>
```

## ♿ Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader support (via Radix UI)
- ✅ Focus indicators

## 🧪 Testing (Future)

Testing setup recommendations:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

## 📞 Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ using React + Vite
