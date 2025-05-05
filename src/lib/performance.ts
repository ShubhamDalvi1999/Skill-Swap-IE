/**
 * Utilities for improving application performance
 */

/**
 * Delays execution until the browser is idle
 * @param callback The function to execute
 * @param timeout Maximum time to wait before forcing execution
 */
export function runWhenIdle(callback: () => void, timeout = 2000): void {
  if (typeof window === 'undefined') {
    // Server-side, execute immediately
    callback()
    return
  }

  if ('requestIdleCallback' in window) {
    // Use requestIdleCallback when available
    window.requestIdleCallback(() => callback(), { timeout })
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(callback, 1)
  }
}

/**
 * Debounces a function to prevent too many executions
 * @param fn The function to debounce
 * @param delay The delay in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (...args: Parameters<T>): void {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }
}

/**
 * Throttles a function to limit its execution frequency
 * @param fn The function to throttle
 * @param limit The minimum time between executions in milliseconds
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit = 300
): (...args: Parameters<T>) => void {
  let inThrottle = false
  let lastArgs: Parameters<T> | null = null

  return function (...args: Parameters<T>): void {
    // Store the latest arguments
    lastArgs = args

    if (!inThrottle) {
      fn(...args)
      inThrottle = true

      setTimeout(() => {
        inThrottle = false
        // If new arguments came in during the wait, execute with those
        if (lastArgs && lastArgs !== args) {
          fn(...lastArgs)
          lastArgs = null
        }
      }, limit)
    }
  }
}

/**
 * Memoizes a function to cache its results for repeated calls with the same parameters
 * @param fn The function to memoize
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>()

  return function (...args: Parameters<T>): ReturnType<T> {
    // Create a key based on the stringified arguments
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  } as T
}

/**
 * Get metrics about the page's performance
 */
export function getPerformanceMetrics(): Record<string, number | null> {
  if (typeof window === 'undefined' || !window.performance || !window.performance.getEntriesByType) {
    return {
      FCP: null,
      LCP: null,
      CLS: null,
      FID: null,
      TTFB: null,
    }
  }

  try {
    let FCP = null
    let LCP = null
    let CLS = null
    let FID = null
    let TTFB = null

    // First Contentful Paint
    const paintEntries = window.performance.getEntriesByType('paint')
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    if (fcpEntry) {
      FCP = fcpEntry.startTime
    }

    // Time to First Byte
    const navigationEntries = window.performance.getEntriesByType('navigation')
    if (navigationEntries.length > 0) {
      const navigationEntry = navigationEntries[0] as PerformanceNavigationTiming
      TTFB = navigationEntry.responseStart
    }

    // These require additional listener setup and PerformanceObserver
    // For a complete implementation, consider using web-vitals library

    return { FCP, LCP, CLS, FID, TTFB }
  } catch (error) {
    console.error('Error getting performance metrics:', error)
    return {
      FCP: null,
      LCP: null,
      CLS: null,
      FID: null,
      TTFB: null,
    }
  }
}

/**
 * Preload resources that will likely be needed soon
 * @param resources List of URLs to preload
 */
export function preloadResources(resources: string[]): void {
  if (typeof window === 'undefined' || !document.head) {
    return
  }

  resources.forEach(resource => {
    const type = getResourceType(resource)
    if (!type) return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = type
    link.href = resource
    document.head.appendChild(link)
  })
}

/**
 * Determine the resource type based on its URL
 * @param url The resource URL
 */
function getResourceType(url: string): string | null {
  const extension = url.split('.').pop()?.toLowerCase()

  if (!extension) return null

  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(extension)) {
    return 'image'
  }

  if (['js'].includes(extension)) {
    return 'script'
  }

  if (['css'].includes(extension)) {
    return 'style'
  }

  if (['woff', 'woff2', 'ttf', 'otf'].includes(extension)) {
    return 'font'
  }

  if (['mp4', 'webm'].includes(extension)) {
    return 'video'
  }

  return null
}

/**
 * Track a user interaction for analytics
 * This is a placeholder that would be expanded in a production environment
 * @param eventName The name of the event
 * @param eventData Additional data about the event
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>): void {
  // In a real application, this would send data to an analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}`, eventData)
  }

  // Example: Send to a hypothetical analytics service
  // analyticsService.trackEvent(eventName, eventData)
} 