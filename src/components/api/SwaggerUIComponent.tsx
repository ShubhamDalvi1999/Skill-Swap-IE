'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

// Import SwaggerUI dynamically to avoid SSR issues
const SwaggerUI = dynamic(
  () => import('swagger-ui-react').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => <div>Loading Swagger UI...</div>
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