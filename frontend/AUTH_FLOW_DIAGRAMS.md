# CompliAI Authentication System - Flow Diagram

## 🔄 Complete Authentication Flow

```mermaid
graph TD
    A[User Visits App] --> B{Is Authenticated?}
    B -->|No| C[Login Page]
    B -->|Yes| D[Dashboard]
    
    C --> E{Login Attempt}
    E -->|Success| F{2FA Required?}
    E -->|Failure| G[Error Message]
    G --> C
    
    F -->|Yes| H[2FA Login Page]
    F -->|No| I{Email Verified?}
    
    H --> J{2FA Code Valid?}
    J -->|Yes| I
    J -->|No| K[2FA Error]
    K --> H
    
    I -->|Yes| D
    I -->|No| L[Email Verification Required]
    
    L --> M[Verify Email Pending]
    M --> N{Email Verified?}
    N -->|Yes| D
    N -->|No| M
    
    D --> O[Profile Page]
    O --> P[Security Settings]
    P --> Q[Auth Management]
    
    Q --> R[Change Password]
    Q --> S[Setup 2FA]
    Q --> T[Active Sessions]
    Q --> U[Security Logs]
    Q --> V[Device Management]
    Q --> W[Recovery Codes]
```

## 🛡️ Security Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth Store
    participant B as Backend API
    participant E as Email Service
    
    U->>F: Enter Credentials
    F->>A: Login Request
    A->>B: POST /auth/login
    B->>B: Validate Credentials
    
    alt Valid Credentials
        B->>A: Success + JWT Token
        A->>F: Update Auth State
        F->>U: Redirect to Dashboard
    else Invalid Credentials
        B->>A: Error Response
        A->>F: Show Error
        F->>U: Display Error Message
    end
    
    alt 2FA Required
        B->>A: 2FA Required Flag
        A->>F: Redirect to 2FA
        F->>U: Show 2FA Input
        U->>F: Enter 2FA Code
        F->>B: POST /auth/verify-2fa
        B->>A: Final Authentication
    end
```

## 📱 Component Interaction Flow

```mermaid
graph LR
    A[App.tsx] --> B[Routes.tsx]
    B --> C{Auth State}
    
    C -->|Unauthenticated| D[Public Routes]
    C -->|Authenticated| E[Protected Routes]
    
    D --> F[Login]
    D --> G[Register]
    D --> H[Forgot Password]
    D --> I[Reset Password]
    
    E --> J[Dashboard]
    E --> K[Profile]
    E --> L[Settings]
    
    K --> M[Security Panel]
    M --> N[Auth Components]
    
    N --> O[Change Password]
    N --> P[2FA Setup]
    N --> Q[Active Sessions]
    N --> R[Security Logs]
    N --> S[Device Management]
    N --> T[Recovery Codes]
```

## 🔐 Security Feature Map

```mermaid
mindmap
  root((Auth Security))
    Multi-Factor Auth
      TOTP Setup
      Recovery Codes
      Device Trust
      Emergency Recovery
    Session Management
      Active Sessions
      Session Monitoring
      Device Tracking
      Remote Logout
    Password Security
      Strength Validation
      Secure Reset
      Change Protection
      History Prevention
    Account Protection
      Email Verification
      Account Lockout
      Rate Limiting
      Audit Logging
    Monitoring & Logs
      Security Events
      Login Attempts
      Device Changes
      Suspicious Activity
```

---

*Complete flow diagrams showing how the CompliAI authentication system works from user interaction to security monitoring.*