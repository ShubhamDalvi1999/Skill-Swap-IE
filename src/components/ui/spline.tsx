// @ts-nocheck
'use client'

// Import React for JSX and hooks
import { useRef, useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'

// Use Next.js dynamic import instead of React.lazy for better SSR compatibility
const Spline = dynamic(() => import('@splinetool/react-spline'), { 
  ssr: false,
  suspense: true 
})

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const splineRef = useRef<any>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  
  // Track cursor position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ 
        x: e.clientX, 
        y: e.clientY 
      });
    };
    
    const handleMouseDown = () => setIsInteracting(true);
    const handleMouseUp = () => setIsInteracting(false);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  // Function to handle Spline load
  const onLoad = (splineApp: any) => {
    if (splineRef.current) {
      splineRef.current = splineApp;
    }
  };

  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      <div className="relative w-full h-full" style={{ cursor: 'none' }}>
        <Spline
          scene={scene}
          className={className}
          onLoad={onLoad}
        />
        <div 
          className="cursor-dot bg-white/30 w-6 h-6"
          style={{ 
            position: 'fixed',
            left: cursorPosition.x, 
            top: cursorPosition.y,
            opacity: isInteracting ? 0.6 : 0.3,
            width: isInteracting ? '2rem' : '1.5rem',
            height: isInteracting ? '2rem' : '1.5rem',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            transition: 'width 0.2s, height 0.2s, opacity 0.2s',
            zIndex: 1000
          }} 
        />
      </div>
    </Suspense>
  )
} 