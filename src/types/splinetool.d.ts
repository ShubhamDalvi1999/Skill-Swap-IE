declare module '@splinetool/react-spline' {
  import { FC } from 'react';
  
  interface SplineProps {
    scene: string;
    className?: string;
    onLoad?: (splineApp: any) => void;
    [key: string]: any;
  }
  
  const Spline: FC<SplineProps>;
  
  export default Spline;
} 