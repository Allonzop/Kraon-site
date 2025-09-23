# KRAON - Premium Digital Marketing Agency Website

## Overview

KRAON is a premium single-page digital marketing agency website built for SMEs (small & mid-size businesses) with a modern, futuristic aesthetic. The application features a dark theme with electric blue and violet accents, smooth animations, and a responsive design. It includes sections for services, portfolio, process, about, and contact with a fully functional contact form that sends emails to the agency.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript for type safety and modern development
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessibility
- **Animations**: Framer Motion for smooth animations, transitions, and parallax effects
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Form Handling**: React Hook Form with Zod schema validation for type-safe forms

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Structure**: RESTful API with `/api/contact` endpoint for form submissions
- **Email Service**: Nodemailer for sending contact form submissions via SMTP
- **Storage**: In-memory storage implementation with interface for future database integration
- **Validation**: Zod schemas shared between frontend and backend for consistent validation

### Data Storage Solutions
- **Current**: In-memory storage for contact form submissions
- **Prepared**: Drizzle ORM configuration with PostgreSQL dialect ready for database integration
- **Schema**: Centralized schema definitions in `/shared/schema.ts` for type consistency

### Authentication and Authorization
- Currently no authentication system implemented
- CORS and basic security headers configured
- Form validation and sanitization for contact submissions

### Development Environment
- **Hot Reloading**: Vite dev server with HMR for frontend
- **Development Server**: Express server with automatic restart
- **Code Quality**: TypeScript strict mode, ESLint configuration
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)

### Deployment Architecture
- **Build Process**: Vite builds frontend to `dist/public`, esbuild bundles backend to `dist/`
- **Production**: Single Node.js process serving both API and static files
- **Environment**: Environment variables for SMTP configuration and database URL

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver (prepared for future use)
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-kit**: Database migration and schema management tools
- **nodemailer**: Email sending service with SMTP support

### UI and Animation
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **framer-motion**: Animation library for smooth transitions and effects
- **lucide-react**: Icon library for consistent iconography
- **class-variance-authority**: Utility for creating variant-based component APIs
- **tailwind-merge**: Utility for merging Tailwind CSS classes

### Development Tools
- **@replit/vite-plugin-***: Replit-specific development plugins for enhanced development experience
- **tsx**: TypeScript execution environment for development
- **esbuild**: Fast JavaScript bundler for production builds

### Email Configuration
- SMTP service integration via environment variables:
  - `SMTP_HOST`: Email server hostname
  - `SMTP_PORT`: Email server port
  - `SMTP_USER`: Authentication username
  - `SMTP_PASS`: Authentication password
  - `EMAIL_USER`: Fallback email username
  - `EMAIL_PASS`: Fallback email password

### Database Integration (Prepared)
- PostgreSQL database via `DATABASE_URL` environment variable
- Drizzle ORM with migration support in `/migrations` directory
- Schema definitions ready for contact form data persistence