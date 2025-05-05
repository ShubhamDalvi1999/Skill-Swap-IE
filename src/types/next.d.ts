declare module 'next/link' {
  import type { ReactNode } from 'react';
  
  export interface LinkProps {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    className?: string;
    children: ReactNode;
    [key: string]: any;
  }
  
  export default function Link(props: LinkProps): JSX.Element;
}

declare module 'next/image' {
  import type { ReactElement, CSSProperties } from 'react';
  
  export interface ImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    layout?: 'fixed' | 'intrinsic' | 'responsive' | 'fill';
    loader?: (resolverProps: ImageLoaderProps) => string;
    sizes?: string;
    quality?: number;
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    unoptimized?: boolean;
    objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    objectPosition?: string;
    onLoadingComplete?: (result: { naturalWidth: number; naturalHeight: number }) => void;
    onError?: (error: Error) => void;
    className?: string;
    style?: CSSProperties;
    [key: string]: any;
  }
  
  interface ImageLoaderProps {
    src: string;
    width: number;
    quality?: number;
  }
  
  export default function Image(props: ImageProps): ReactElement;
}

declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string, options?: { scroll?: boolean }) => void;
    replace: (url: string, options?: { scroll?: boolean }) => void;
    refresh: () => void;
    back: () => void;
    forward: () => void;
    prefetch: (url: string) => void;
  };
  
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
}

declare module 'next/dynamic' {
  import type { ComponentType } from 'react';

  export interface DynamicOptions {
    loading?: ComponentType;
    ssr?: boolean;
    suspense?: boolean;
  }

  export default function dynamic<P = {}>(
    dynamicImport: () => Promise<ComponentType<P> | { default: ComponentType<P> }>,
    options?: DynamicOptions
  ): ComponentType<P>;
} 