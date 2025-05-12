// Common types used across sections

// Course Type
export interface Course {
  id: number;
  title: string;
  instructor: string;
  rating: number;
  studentsCount: number;
  image: string;
  price: string;
  slug: string;
}

// Partner/Company Logo Type
export interface Partner {
  id: number | string;
  name: string;
  logo: string;
}

// Feature Type
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
}

// Topic/Skill Type
export interface Topic {
  id: string;
  name: string;
  icon: string;
  courses: number;
  color: string;
  slug: string;
}

// Case Study / Testimonial Type
export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  avatar: string;
}

// Stat Type
export interface Stat {
  id: number;
  value: string;
  label: string;
}

// Pricing Plan Type
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  popular: boolean;
  callToAction: string;
}

// Footer Link Type
export interface FooterLink {
  title: string;
  href: string;
}

// Footer Column Type
export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

// Language Type
export interface Language {
  code: string;
  name: string;
} 