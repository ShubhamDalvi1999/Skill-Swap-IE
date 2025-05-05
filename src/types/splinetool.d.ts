declare module '@splinetool/react-spline' {
  import type * as React from 'react';
  
  interface SplineProps {
    scene: string;
    className?: string;
    onLoad?: (splineApp: unknown) => void;
    [key: string]: unknown;
  }
  
  const Spline: React.ComponentType<SplineProps>;
  
  export default Spline;
} 