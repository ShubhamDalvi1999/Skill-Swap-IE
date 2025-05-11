'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

// Import SwaggerUI dynamically to avoid SSR issues
const SwaggerUI = dynamic(
  () => import('swagger-ui-react')
    .then((mod) => {
      if (!mod || !mod.default) {
        console.error('SwaggerUI module loaded but default export is undefined');
        // Return a minimal fallback component
        return () => <div className="p-4 border rounded bg-gray-50">API documentation unavailable</div>;
      }
      return mod.default;
    })
    .catch(err => {
      console.error('Error loading SwaggerUI module:', err);
      // Return a fallback component
      return () => <div className="p-4 border rounded bg-red-50">Failed to load API documentation</div>;
    }),
  { 
    ssr: false,
    loading: () => <div className="p-4">Loading Swagger UI documentation...</div>
  }
)

type SwaggerUIComponentProps = {
  spec: Record<string, unknown>
}

export default function SwaggerUIComponent({ spec }: SwaggerUIComponentProps) {
  // Using a key forces a remount when the spec changes
  const [key, setKey] = useState(0)

  // This effect runs when the component mounts or when the spec reference changes
  useEffect(() => {
    // Reset component when spec changes - this helps SwaggerUI render properly
    setKey(prevKey => prevKey + 1)
  }, [])

  return (
    <div key={key} className="bg-white rounded-lg w-full">
      {/* @ts-expect-error - SwaggerUI has known type issues with Next.js but works at runtime */}
      <SwaggerUI spec={spec} />
    </div>
  )
} 