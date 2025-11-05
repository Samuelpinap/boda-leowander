# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js wedding invitation website created with v0.dev. The project uses:
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** component library with Radix UI primitives
- **Lucide React** for icons
- **MongoDB Atlas** for data persistence (RSVPs and well wishes)
- **Custom fonts**: Geist (primary), Playfair Display, Dancing Script, Great Vibes, Cormorant Garamond

The site features a personalized wedding invitation system with envelope animation, RSVP management, guest tracking, and well wishes collection.

## Development Commands

### Core Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run Next.js linter

### Package Management
This project uses **pnpm** as the package manager (evident from pnpm-lock.yaml).

## Architecture

### Project Structure
- `app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with custom fonts and global styles
  - `page.tsx` - Main wedding invitation page component
  - `globals.css` - Global styles and CSS variables
  - `api/` - Backend API routes
    - `rsvp/` - RSVP submission and retrieval endpoints
    - `rsvp/check/` - Check existing RSVP status
    - `well-wishes/` - Guest message endpoints
    - `test-db/` - Database connection testing
- `components/` - Reusable React components
  - `ui/` - shadcn/ui component library (50+ components)
  - `EnvelopeAnimation.tsx` - Interactive envelope animation
  - `theme-provider.tsx` - Theme context provider
- `lib/` - Utility functions
  - `mongodb.ts` - MongoDB connection singleton
  - `utils.ts` - className merging and utilities
- `types/` - TypeScript type definitions
- `hooks/` - Custom React hooks
- `public/` - Static assets
  - `images/` - Wedding photos and graphics
  - `audio/` - Wedding music files

### Component System
The project uses shadcn/ui configured with:
- Default style variant
- RSC (React Server Components) enabled
- CSS variables for theming
- Stone/wedding color palette
- Lucide icon library

### Database Architecture
- **MongoDB Atlas** for data persistence
- Collections:
  - `rsvps` - Guest RSVP responses
  - `wellWishes` - Guest messages
- Singleton pattern for connection management
- Environment variable: `MONGODB_URI`

### Styling Approach
- **Tailwind CSS** for utility-first styling
- **CSS Variables** for theme system (defined in globals.css)
- **Custom animations**: fadeIn, slideUp, float
- **Mobile-first responsive design** (CRITICAL)
- **Wedding color palette**: stone/neutral tones with accent colors

### Key Features
- **Personalized invitations** with unique guest IDs
- **Envelope animation** for interactive opening experience
- **RSVP management** with guest count tracking
- **Well wishes collection** for guest messages
- **Responsive design** optimized for mobile devices
- **Image optimization** with Next.js Image component
- **Smooth scrolling** navigation between sections

## API Endpoints

### RSVP Management
- `POST /api/rsvp` - Submit new RSVP
- `GET /api/rsvp?id={guestId}` - Retrieve RSVP by guest ID
- `POST /api/rsvp/check` - Check if RSVP exists

### Well Wishes
- `POST /api/well-wishes` - Submit guest message
- `GET /api/well-wishes` - Retrieve all messages

### Testing
- `GET /api/test-db` - Test database connection

## Configuration Notes

### Build Configuration
- ESLint errors are ignored in production builds
- TypeScript errors are ignored in production builds
- Images are set to unoptimized mode

### Environment Variables
Required in `.env.local`:
```
MONGODB_URI=your_mongodb_connection_string
```

## v0.dev Integration

This project is synced with v0.dev and automatically deploys to Vercel. Changes made in v0.dev will be pushed to this repository automatically.

## Development Guidelines

### Form Handling
- RSVP forms use controlled React state
- Guest validation based on `possibleInvites` field
- Confirmation numbers are generated for tracking

### Error Handling
- API routes include try-catch blocks
- User-friendly error messages
- Database connection errors are logged

### Mobile-First Approach
- **CRITICAL**: This webpage MUST be 100% mobile-first
- Test all features on mobile devices
- Ensure touch-friendly interactions
- Optimize performance for slower connections

## Testing

Currently, there is **no automated testing framework** configured. When implementing tests:
- Consider adding Jest or Vitest for unit tests
- Test API endpoints with integration tests
- Add E2E tests for critical user flows (RSVP submission)