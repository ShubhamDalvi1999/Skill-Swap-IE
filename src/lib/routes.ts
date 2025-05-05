/**
 * Utility functions for route handling
 */

// Define the routes that are currently implemented
export const implementedRoutes = [
  '/',
  '/dashboard',
  '/auth/signin',
  '/auth/signup',
  '/auth/verify-email',
  '/settings',
  '/learn',
  '/practice',
  '/build',
  '/community',
  '/progress'
];

/**
 * Check if a route is implemented
 * @param path The path to check
 * @returns True if the route is implemented, false otherwise
 */
export function isRouteImplemented(path: string): boolean {
  // Check exact matches
  if (implementedRoutes.includes(path)) {
    return true;
  }
  
  // Check for dynamic routes with patterns
  // For example, if we have a route like /courses/[id]
  const dynamicRoutePatterns = [
    { pattern: /^\/courses\/[^\/]+$/, implemented: true },
    { pattern: /^\/learn\/[^\/]+$/, implemented: true },
    { pattern: /^\/profile\/[^\/]+$/, implemented: true },
  ];
  
  for (const { pattern, implemented } of dynamicRoutePatterns) {
    if (pattern.test(path) && implemented) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get the appropriate redirect path for a non-implemented route
 * @param path The current path
 * @returns The path to redirect to
 */
export function getRedirectPath(path: string): string {
  // For now, just redirect to the 404 page
  return '/not-found';
} 