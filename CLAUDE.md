# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js wedding invitation website created with v0.dev. The project uses:
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** component library with Radix UI primitives
- **Lucide React** for icons
- **Geist font** as primary typeface with Playfair Display and Dancing Script for wedding typography

The site features a single-page wedding invitation layout with sections for hero, save-the-dates timeline, about us, location details, and RSVP form.

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
- `components/` - Reusable React components
  - `ui/` - shadcn/ui component library
  - `theme-provider.tsx` - Theme context provider
- `lib/` - Utility functions (utils.ts for className merging)
- `hooks/` - Custom React hooks
- `public/` - Static assets including wedding photos

### Component System
The project uses shadcn/ui configured with:
- Default style variant
- RSC (React Server Components) enabled
- CSS variables for theming
- Neutral base color palette
- Lucide icon library

### Styling Approach
- **Tailwind CSS** for utility-first styling
- **CSS Variables** for theme system (defined in globals.css)
- **Custom fonts**: Geist (primary), Playfair Display (serif), Dancing Script (script)
- **Design system**: Stone color palette for elegant wedding aesthetic

### Key Features
- **Responsive design** with mobile-first approach
- **Image optimization** with Next.js Image component
- **Form handling** with controlled React state
- **Smooth scrolling navigation** between sections
- **Backdrop blur effects** for modern aesthetic

## v0.dev Integration

This project is synced with v0.dev and automatically deploys to Vercel. Changes made in v0.dev will be pushed to this repository automatically. The project URL: https://v0.dev/chat/projects/xKbnMvhNZPZ

## Development Notes

### Image Assets
- Hero image: `/images/hero-couple.jpg`
- Placeholder images use `/placeholder.svg` format
- Reference image: `/images/save-dates-reference.png`

### Form Handling
The RSVP form currently logs to console - implement actual submission logic as needed.

### Styling Conventions
- Use `className` prop with Tailwind utilities
- Follow existing color scheme (stone palette)
- Maintain consistent spacing with Tailwind scale
- Use semantic HTML elements for accessibility