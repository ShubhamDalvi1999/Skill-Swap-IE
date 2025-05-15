/**
 * Icon map to centralize icon names and make it easier to update them
 * This allows us to reference icons by a semantic name and change the underlying icon easily
 */
export const ICONS = {
  // Navigation
  home: 'LayoutDashboard',
  learn: 'GraduationCap',
  practice: 'Code2',
  build: 'Rocket',
  community: 'UsersRound',
  progress: 'LineChart',
  teach: 'Presentation',
  settings: 'Settings',
  
  // User actions
  profile: 'UserCircle',
  logout: 'LogOut',
  notifications: 'BellRing',
  
  // UI elements
  expand: 'ChevronDown',
  collapse: 'ChevronUp',
  next: 'ChevronRight',
  previous: 'ChevronLeft',
  close: 'X',
  menu: 'Menu',
  
  // Course status
  completed: 'CheckCircle2',
  inProgress: 'PlayCircle',
  locked: 'ShieldLock',
  notStarted: 'Circle',
  
  // Social
  github: 'Github',
  twitter: 'Twitter',
  linkedin: 'Linkedin',
  email: 'MailPlus',
  
  // Event types
  calendar: 'Calendar', 
  webinar: 'Video',
  workshop: 'UsersRound',
  assignment: 'ClipboardList',
  
  // Course information
  duration: 'Timer',
  students: 'GraduationCap',
  rating: 'StarHalf',
  
  // Alerts and feedback
  success: 'CheckCircle2',
  error: 'XCircle',
  warning: 'AlertTriangle',
  info: 'InfoIcon',
  
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