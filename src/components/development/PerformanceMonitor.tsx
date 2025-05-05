'use client'

import { useState, useEffect } from 'react'
import { getPerformanceMetrics } from '@/lib/performance'

interface MetricDisplay {
  label: string
  key: string
  format: (value: number | null) => string
  description: string
}

const metrics: MetricDisplay[] = [
  {
    label: 'FCP',
    key: 'FCP',
    format: (value) => value ? `${Math.round(value)}ms` : 'N/A',
    description: 'First Contentful Paint - Time until the first text or image is painted'
  },
  {
    label: 'TTFB',
    key: 'TTFB',
    format: (value) => value ? `${Math.round(value)}ms` : 'N/A',
    description: 'Time To First Byte - Time until the first byte of the page is received'
  },
  {
    label: 'LCP',
    key: 'LCP',
    format: (value) => value ? `${Math.round(value)}ms` : 'N/A',
    description: 'Largest Contentful Paint - Time until the largest content element is painted'
  },
  {
    label: 'CLS',
    key: 'CLS',
    format: (value) => value ? value.toFixed(3) : 'N/A',
    description: 'Cumulative Layout Shift - Measures visual stability of the page'
  },
  {
    label: 'FID',
    key: 'FID',
    format: (value) => value ? `${Math.round(value)}ms` : 'N/A',
    description: 'First Input Delay - Time until the page responds to user interaction'
  }
]

/**
 * A component that monitors and displays performance metrics
 * Only displayed in development mode
 */
export default function PerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false)
  const [performanceData, setPerformanceData] = useState<Record<string, number | null>>(
    metrics.reduce((acc, metric) => ({ ...acc, [metric.key]: null }), {})
  )
  const [isExpanded, setIsExpanded] = useState(false)
  const [memoryUsage, setMemoryUsage] = useState<{
    jsHeapSizeLimit: number | null,
    totalJSHeapSize: number | null, 
    usedJSHeapSize: number | null
  }>({
    jsHeapSizeLimit: null,
    totalJSHeapSize: null,
    usedJSHeapSize: null
  })
  const [resourceCount, setResourceCount] = useState({
    scripts: 0,
    stylesheets: 0,
    images: 0,
    fonts: 0,
    other: 0
  })

  // Only show in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true)
      
      // Initialize metrics
      updateMetrics()
      
      // Update metrics every 2 seconds
      const intervalId = setInterval(updateMetrics, 2000)
      
      return () => clearInterval(intervalId)
    }
  }, [])
  
  function updateMetrics() {
    // Get performance metrics
    const metrics = getPerformanceMetrics()
    setPerformanceData(metrics)
    
    // Get memory usage if available
    if (
      typeof window !== 'undefined' && 
      window.performance && 
      (performance as any).memory
    ) {
      const memory = (performance as any).memory
      setMemoryUsage({
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        totalJSHeapSize: memory.totalJSHeapSize,
        usedJSHeapSize: memory.usedJSHeapSize
      })
    }
    
    // Count resources
    if (typeof window !== 'undefined' && window.performance && window.performance.getEntriesByType) {
      const resources = window.performance.getEntriesByType('resource')
      
      const counts = {
        scripts: 0,
        stylesheets: 0,
        images: 0,
        fonts: 0,
        other: 0
      }
      
      resources.forEach((resource) => {
        const url = (resource as PerformanceResourceTiming).name
        if (url.endsWith('.js')) {
          counts.scripts++
        } else if (url.endsWith('.css')) {
          counts.stylesheets++
        } else if (/\.(png|jpg|jpeg|gif|webp|svg)$/.test(url)) {
          counts.images++
        } else if (/\.(woff|woff2|ttf|otf)$/.test(url)) {
          counts.fonts++
        } else {
          counts.other++
        }
      })
      
      setResourceCount(counts)
    }
  }
  
  function formatBytes(bytes: number | null) {
    if (bytes === null) return 'N/A'
    
    const units = ['B', 'KB', 'MB', 'GB']
    let value = bytes
    let unitIndex = 0
    
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024
      unitIndex++
    }
    
    return `${value.toFixed(2)} ${units[unitIndex]}`
  }
  
  if (!isVisible) {
    return null
  }
  
  return (
    <div className="fixed bottom-0 right-0 bg-black text-white p-2 text-xs z-50 max-w-md opacity-80 hover:opacity-100 transition-opacity">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-bold">Performance Monitor</h4>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs px-2 py-1 bg-gray-700 rounded"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-x-4 gap-y-1">
        {metrics.map(metric => (
          <div key={metric.key} className="flex justify-between">
            <div className="tooltip" title={metric.description}>
              <span className="underline dotted">{metric.label}</span>:
            </div>
            <span className={performanceData[metric.key] ? '' : 'opacity-50'}>
              {metric.format(performanceData[metric.key])}
            </span>
          </div>
        ))}
      </div>
      
      {isExpanded && (
        <div className="mt-2 pt-2 border-t border-gray-700">
          <h5 className="font-bold mb-1">Memory Usage</h5>
          <div className="grid grid-cols-2 gap-1">
            <div>Used Heap:</div>
            <div>{formatBytes(memoryUsage.usedJSHeapSize)}</div>
            
            <div>Total Heap:</div>
            <div>{formatBytes(memoryUsage.totalJSHeapSize)}</div>
            
            <div>Heap Limit:</div>
            <div>{formatBytes(memoryUsage.jsHeapSizeLimit)}</div>
          </div>
          
          <h5 className="font-bold mt-2 mb-1">Resources</h5>
          <div className="grid grid-cols-2 gap-1">
            <div>Scripts:</div>
            <div>{resourceCount.scripts}</div>
            
            <div>Stylesheets:</div>
            <div>{resourceCount.stylesheets}</div>
            
            <div>Images:</div>
            <div>{resourceCount.images}</div>
            
            <div>Fonts:</div>
            <div>{resourceCount.fonts}</div>
            
            <div>Other:</div>
            <div>{resourceCount.other}</div>
            
            <div className="font-bold">Total:</div>
            <div className="font-bold">
              {resourceCount.scripts + resourceCount.stylesheets + 
               resourceCount.images + resourceCount.fonts + resourceCount.other}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 