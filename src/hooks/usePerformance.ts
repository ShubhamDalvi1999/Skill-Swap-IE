'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { debounce, throttle, runWhenIdle, memoize, getPerformanceMetrics, preloadResources } from '@/lib/performance'

/**
 * Hook for performance optimizations in components
 */
export function usePerformance() {
  const [metrics, setMetrics] = useState<Record<string, number | null>>({
    FCP: null,
    LCP: null,
    CLS: null,
    FID: null,
    TTFB: null,
  })
  
  // Create memoized versions of performance utilities
  const createDebouncedFunction = useCallback(
    <T extends (...args: any[]) => any>(fn: T, delay = 300) => debounce(fn, delay),
    []
  )
  
  const createThrottledFunction = useCallback(
    <T extends (...args: any[]) => any>(fn: T, limit = 300) => throttle(fn, limit),
    []
  )
  
  const createMemoizedFunction = useCallback(
    <T extends (...args: any[]) => any>(fn: T) => memoize(fn),
    []
  )
  
  // Ref to track if a component is mounted
  const isMountedRef = useRef(true)
  
  useEffect(() => {
    // Set mounted status
    isMountedRef.current = true
    
    // Collect performance metrics
    runWhenIdle(() => {
      if (isMountedRef.current) {
        setMetrics(getPerformanceMetrics())
      }
    })
    
    return () => {
      isMountedRef.current = false
    }
  }, [])
  
  /**
   * Preload resources needed for this component
   */
  const preload = useCallback((resources: string[]) => {
    runWhenIdle(() => {
      if (isMountedRef.current) {
        preloadResources(resources)
      }
    })
  }, [])
  
  /**
   * Optimize an expensive calculation with automatic memoization
   */
  const optimizeCalculation = useCallback(<T extends (...args: any[]) => any>(
    calculationFn: T,
    dependencies: any[] = []
  ) => {
    // Create a ref to store the memoized function
    const memoizedFnRef = useRef<T | null>(null)
    
    // Create or update the memoized function when dependencies change
    useEffect(() => {
      memoizedFnRef.current = memoize(calculationFn)
    }, dependencies)
    
    // Return a function that uses the memoized version
    return function(...args: Parameters<T>): ReturnType<T> {
      if (!memoizedFnRef.current) {
        memoizedFnRef.current = memoize(calculationFn)
      }
      return memoizedFnRef.current(...args)
    } as T
  }, [])
  
  /**
   * Schedule a low-priority update for non-critical UI elements
   */
  const scheduleLowPriorityUpdate = useCallback((updateFn: () => void) => {
    runWhenIdle(updateFn)
  }, [])
  
  /**
   * Track rendering performance for development purposes
   */
  const trackRender = useCallback((componentName: string) => {
    if (process.env.NODE_ENV !== 'development') return
    
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms`)
      }
      return {
        componentName,
        renderTime: parseFloat(renderTime.toFixed(2))
      }
    }
  }, [])

  return {
    metrics,
    createDebouncedFunction,
    createThrottledFunction,
    createMemoizedFunction,
    preload,
    optimizeCalculation,
    scheduleLowPriorityUpdate,
    trackRender
  }
}