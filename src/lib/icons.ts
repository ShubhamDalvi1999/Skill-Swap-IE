/**
 * Icon map to centralize icon names and make it easier to update them
 * This allows us to reference icons by a semantic name and change the underlying icon easily
 */
export const ICONS = {
  // Navigation
  home: 'Home',
  learn: 'BookOpen',
  practice: 'Code',
  build: 'Award',
  community: 'Users',
  progress: 'BarChart',
  settings: 'Settings',
  
  // User actions
  profile: 'User',
  logout: 'LogOut',
  notifications: 'Bell',
  
  // UI elements
  expand: 'ChevronDown',
  collapse: 'ChevronUp',
  next: 'ChevronRight',
  previous: 'ChevronLeft',
  close: 'X',
  menu: 'Menu',
  
  // Course status
  completed: 'CheckCircle',
  inProgress: 'PlayCircle',
  locked: 'Lock',
  notStarted: 'Circle',
  
  // Social
  github: 'Github',
  twitter: 'Twitter',
  linkedin: 'Linkedin',
  email: 'Mail',
  
  // Event types
  calendar: 'Calendar', 
  webinar: 'Video',
  workshop: 'Users',
  assignment: 'FileText',
  
  // Course information
  duration: 'Clock',
  students: 'Users',
  rating: 'Star',
  
  // Alerts and feedback
  success: 'CheckCircle',
  error: 'XCircle',
  warning: 'AlertCircle',
  info: 'Info',
  
  // Fallback
  fallback: 'HelpCircle'
} as const

// Type for the keys of the ICONS object (e.g., 'home', 'learn', etc.)
export type IconKey = keyof typeof ICONS

// Type for icon names (string type for compatibility)
export type IconName = string

/**
 * Function to get the icon name from the icon key
 * @param key The icon key from the ICONS object
 * @returns The corresponding icon name (Lucide icon name or custom icon path)
 */
export function getIconName(key: IconKey): IconName {
  return ICONS[key]
} 