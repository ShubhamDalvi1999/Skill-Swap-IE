'use client'

import React from 'react'
import * as LucideIcons from 'lucide-react'

// Simplified DynamicIcon component
const DynamicIcon = ({ 
  icon, 
  className,
  ...props 
}: { 
  icon: string;
  className?: string;
  [key: string]: any;
}) => {
  // Access the icon from Lucide icons
  // @ts-ignore - we're bypassing TypeScript's type checking here
  const IconComponent = LucideIcons[icon] || LucideIcons['HelpCircle']
  
  return <IconComponent className={className} {...props} />
}

export default DynamicIcon 