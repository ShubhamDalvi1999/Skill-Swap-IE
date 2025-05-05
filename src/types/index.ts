// Re-export all type definitions for easy access
export * from './user'
export * from './auth'
export * from './course'

// Define core types without direct dependencies on external packages
// IconComponent type to replace LucideIcon
export type IconComponent = string

// Renamed to avoid conflict with Course from './course'
export interface NavItem {
  label: string
  href: string
  icon?: IconComponent
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  type: 'webinar' | 'workshop' | 'assignment'
}

// This file ensures that TypeScript picks up the type declarations
// No actual code is needed here - the imports are just for TypeScript

// Ensure type declarations are loaded
import './supabase.d.ts'
import './process.d.ts'
import './react.d.ts'
import './next.d.ts'
import './lucide-react.d.ts' 