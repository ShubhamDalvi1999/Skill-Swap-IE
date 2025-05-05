declare module 'lucide-react' {
  import { ComponentType } from 'react';

  export interface LucideProps {
    color?: string;
    size?: string | number;
    strokeWidth?: string | number;
    className?: string;
    onClick?: () => void;
    [key: string]: any;
  }
  
  type LucideIcon = ComponentType<LucideProps>;
  
  // Define each icon as a named export
  export const AlertCircle: LucideIcon;
  export const Bell: LucideIcon;
  export const BookOpen: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Circle: LucideIcon;
  export const Github: LucideIcon;
  export const Info: LucideIcon;
  export const Linkedin: LucideIcon;
  export const Lock: LucideIcon;
  export const LogOut: LucideIcon;
  export const Mail: LucideIcon;
  export const Maximize2: LucideIcon;
  export const Minimize2: LucideIcon;
  export const PlayCircle: LucideIcon;
  export const Settings: LucideIcon;
  export const Twitter: LucideIcon;
  export const User: LucideIcon;
  export const X: LucideIcon;
  export const XCircle: LucideIcon;
} 