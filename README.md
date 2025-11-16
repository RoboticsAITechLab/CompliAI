# CompliAI - Enterprise Compliance Management Platform

A modern, production-ready SaaS platform built with React + TypeScript for managing enterprise compliance frameworks.

## 🚀 Features

### ✅ Authentication System
- User registration and login
- Password recovery functionality
- Protected routes with authentication guards

### ✅ Dashboard & Analytics
- Real-time compliance metrics
- Interactive charts and visualizations
- Activity feed and notifications
- Summary cards with key statistics

### ✅ Policy Management
- Policy document upload with drag & drop
- Advanced search and filtering
- Status management (Active/Review/Draft/Archived)
- Metadata management (categories, frameworks, review cycles)

### ✅ Controls Management
- Control framework implementation
- Evidence upload and tracking
- Compliance score monitoring
- Risk assessment and remediation

### ✅ Reports & Analytics
- Compliance overview reports
- Risk assessment dashboards
- Audit trail and history
- Export capabilities

### ✅ Settings & Configuration
- User profile management
- Company settings
- Integration configurations
- Notification preferences

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern functional components with hooks
- **TypeScript** - Full type safety and developer experience
- **Vite** - Fast development and build system
- **React Router v6** - Client-side routing
- **Tailwind CSS v3** - Utility-first styling framework

### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📦 Project Structure

```
CompliAI/
├── frontend/
│   ├── src/
│   │   ├── app/                 # Main app configuration
│   │   │   ├── App.tsx         # Root component
│   │   │   ├── main.tsx        # Entry point
│   │   │   └── routes.tsx      # Route configuration
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Basic UI components (Button, Input, Card, etc.)
│   │   │   ├── layout/        # Layout components (AppShell, Navbar, Sidebar)
│   │   │   ├── charts/        # Chart components
│   │   │   └── tables/        # Table components
│   │   ├── pages/             # Page components
│   │   │   ├── auth/          # Authentication pages
│   │   │   ├── dashboard/     # Dashboard page
│   │   │   ├── policies/      # Policy management
│   │   │   ├── controls/      # Controls management
│   │   │   ├── reports/       # Reports and analytics
│   │   │   ├── settings/      # Settings page
│   │   │   └── errors/        # Error pages (404, 403, etc.)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service layer
│   │   ├── store/             # State management (Zustand)
│   │   ├── styles/            # Global styles and CSS
│   │   └── utils/             # Utility functions and helpers
│   ├── public/                # Static assets
│   └── package.json           # Dependencies and scripts
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ankitdevelops/CompliAI.git
   cd CompliAI
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎨 UI Components

### Component Library
- **Button** - Multiple variants (primary, secondary, outline, ghost, danger)
- **Input** - Form inputs with validation support
- **Card** - Container components with headers and body
- **Badge** - Status and category indicators
- **Spinner** - Loading state indicators

### Layout Components
- **AppShell** - Main application layout wrapper
- **Navbar** - Top navigation bar with user menu
- **Sidebar** - Left navigation menu with icons

### Features
- Fully responsive design
- Accessibility (ARIA labels, keyboard navigation)
- Dark/light mode support (ready for implementation)
- Animation and transition effects

## 📱 Pages & Features

### Authentication
- **Login Page** - User authentication with form validation
- **Register Page** - New user registration
- **Forgot Password** - Password recovery workflow

### Dashboard
- **Analytics Overview** - Key compliance metrics
- **Charts & Visualizations** - Interactive data representations
- **Activity Feed** - Recent system activities
- **Quick Actions** - Common workflow shortcuts

### Policy Management
- **Policy List** - Searchable and filterable policy table
- **Policy Upload** - Drag & drop file upload with progress tracking
- **Policy Details** - Comprehensive policy information views

### Compliance Framework Support
- **GDPR** - General Data Protection Regulation
- **HIPAA** - Health Insurance Portability and Accountability Act
- **SOX** - Sarbanes-Oxley Act
- **ISO 27001** - Information Security Management
- **PCI DSS** - Payment Card Industry Data Security Standard
- **SOC 2** - Service Organization Control 2

## 🔧 Configuration

### Environment Setup
The application uses environment-specific configurations. Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=CompliAI
```

### Tailwind CSS
Custom configuration in `tailwind.config.js` with:
- Custom color palette
- Extended spacing and typography
- Component-specific utilities

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🛡️ Security Features

- **Authentication Guards** - Protected route access
- **Form Validation** - Client-side input validation
- **XSS Protection** - Sanitized user inputs
- **CSRF Protection** - Ready for backend integration

## 🔄 State Management

Currently uses React's built-in state management with:
- `useState` for local component state
- `useContext` for global state (auth, theme)
- Zustand integration ready for complex state management

## 📊 Mock Data

The application includes comprehensive mock data for development:
- **Policies** - Sample policy documents with metadata
- **Controls** - Control frameworks and evidence
- **Reports** - Compliance reports and analytics
- **Users** - Sample user profiles and activities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏗️ Architecture

### Frontend Architecture
- **Component-based** - Modular and reusable components
- **Type-safe** - Full TypeScript implementation
- **Performance optimized** - Lazy loading and code splitting ready
- **Accessible** - WCAG 2.1 compliant design patterns

### Future Backend Integration
- RESTful API integration ready
- Authentication service integration
- File upload handling
- Database persistence layer

## 📈 Roadmap

### Phase 1 - Core Platform ✅
- [x] Authentication system
- [x] Dashboard and analytics
- [x] Policy management
- [x] Basic reporting

### Phase 2 - Advanced Features (Coming Soon)
- [ ] Real-time notifications
- [ ] Advanced analytics and insights
- [ ] Integration with external compliance tools
- [ ] Multi-tenant support

### Phase 3 - Enterprise Features (Planned)
- [ ] Custom workflow builder
- [ ] API integrations
- [ ] Advanced user management
- [ ] Enterprise SSO support

## 💬 Support

For support, email support@compliai.com or join our Slack channel.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Vite team for the fast development experience
- TypeScript team for type safety

---

**Built with ❤️ by the CompliAI team**