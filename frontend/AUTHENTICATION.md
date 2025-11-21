# CompliAI Frontend - Authentication System

## Overview

The CompliAI frontend features a production-ready authentication system integrated with the secure backend APIs. The implementation includes comprehensive error handling, user state management, and proper security practices.

## Architecture

### Authentication Service (`authService.ts`)
- **Type-safe API client** with comprehensive error handling
- **Standardized error codes** (INVALID_CREDENTIALS, EMAIL_NOT_VERIFIED, etc.)
- **Automatic token refresh** logic
- **Network error resilience** with human-readable messages
- **Complete method coverage** for all auth operations

### State Management (`authStore.ts`)
- **Zustand store** with persistence for user state
- **Automatic token refresh** when requests fail with 401
- **Role-based access control** (SUPER_ADMIN, ADMIN, MANAGER, etc.)
- **Session management** with remember-me functionality
- **Profile management** with update capabilities

### UI Components
- **Login page** with comprehensive error handling
- **Registration page** with validation and error mapping
- **Forgot Password** with backend integration
- **Reset Password** with token validation
- **Email Verification** with resend functionality
- **Protected routes** with automatic redirects

## Authentication Flows

### 1. Registration Flow
1. User submits registration form
2. Frontend validates input and calls `authService.register()`
3. Backend creates account and sends verification email
4. User redirected to login with success message
5. User verifies email via verification link

### 2. Login Flow
1. User enters credentials
2. Frontend calls `authService.login()`
3. Backend validates and returns JWT tokens
4. Tokens stored in persistent state
5. User redirected to dashboard

### 3. Password Reset Flow
1. User requests password reset via email
2. Backend sends reset token via email
3. User clicks reset link with token
4. Reset password page validates token
5. New password submitted and account updated

### 4. Token Refresh Flow
1. API request fails with 401 Unauthorized
2. `apiClient` interceptor automatically attempts refresh
3. If refresh succeeds, original request retried
4. If refresh fails, user logged out

## Error Handling

### Backend Error Codes
The system handles these specific error codes from the backend:

- `INVALID_CREDENTIALS` - Wrong email/password
- `EMAIL_NOT_VERIFIED` - Account requires email verification
- `ACCOUNT_LOCKED` - Account temporarily locked
- `TOO_MANY_ATTEMPTS` - Rate limiting triggered
- `CONFLICT` - Email already exists
- `VALIDATION_ERROR` - Input validation failed
- `NETWORK_ERROR` - Connection issues

### User Experience
- **Human-readable error messages** for all error scenarios
- **Field-specific validation** with real-time feedback
- **Loading states** with spinners during API calls
- **Success messages** for positive actions
- **Contextual help text** for complex operations

## Security Features

### Frontend Security
- **Automatic logout** on token expiration
- **Secure token storage** with proper cleanup
- **CSRF protection** via token-based auth
- **Route protection** based on authentication state
- **Role-based access control** for different user types

### API Integration
- **Automatic Authorization headers** via Axios interceptors
- **Token refresh logic** to maintain sessions
- **Request/response logging** for debugging
- **Error boundary integration** for graceful failures

## Development Setup

### Prerequisites
```bash
npm install
```

### Environment Variables
Create `.env.local`:
```
VITE_API_BASE_URL=http://localhost:3001
```

### Running Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

## API Endpoints

The frontend integrates with these backend authentication endpoints:

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update profile
- `POST /api/v1/auth/logout` - Logout current session
- `POST /api/v1/auth/logout-all` - Logout all sessions
- `POST /api/v1/auth/request-password-reset` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password with token
- `GET /api/v1/auth/verify-email` - Verify email with token
- `POST /api/v1/auth/resend-verification` - Resend verification email

## Component Integration

### Using Authentication in Components
```typescript
import { useAuthStore } from '../store/authStore';

const MyComponent: React.FC = () => {
  const { user, isAuthenticated, hasRole } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!hasRole(['ADMIN', 'MANAGER'])) {
    return <AccessDenied />;
  }
  
  return <div>Hello, {user?.firstName}!</div>;
};
```

### Error Handling Pattern
```typescript
try {
  await authService.someOperation();
} catch (error) {
  if (error && typeof error === 'object' && 'code' in error) {
    const authError = error as AuthError;
    // Handle specific error codes
    switch (authError.code) {
      case 'INVALID_CREDENTIALS':
        // Show specific message
        break;
      default:
        // Show generic message
    }
  }
}
```

## Production Considerations

### Performance
- **Lazy loading** for auth pages to reduce initial bundle size
- **Memoized components** for user state checks
- **Optimized re-renders** via proper state management

### Monitoring
- **Error tracking** integrated into auth flows
- **Analytics events** for auth success/failure rates
- **Performance metrics** for login/registration times

### Accessibility
- **Screen reader support** for all auth forms
- **Keyboard navigation** throughout auth flows
- **High contrast mode** support
- **Focus management** for better UX

## Testing Strategy

### Unit Tests
- Authentication service methods
- State management logic
- Error handling functions
- Component rendering

### Integration Tests
- Complete auth flows end-to-end
- API error scenario handling
- Route protection validation
- State persistence testing

This authentication system provides enterprise-grade security and user experience while maintaining clean, maintainable code architecture.