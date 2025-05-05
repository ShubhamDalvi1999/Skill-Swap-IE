declare module 'react' {
  export type ReactNode = 
    | React.ReactElement
    | string
    | number
    | boolean
    | null
    | undefined
    | React.ReactNodeArray;
    
  export type ReactNodeArray = Array<ReactNode>;
  
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  
  export type Key = string | number;
  
  export type JSXElementConstructor<P> = 
    | ((props: P) => ReactElement<any, any> | null)
    | (new (props: P) => Component<any, any>);
    
  export class Component<P, S> {
    constructor(props: P, context?: any);
    setState(state: S | ((prevState: S, props: P) => S), callback?: () => void): void;
    forceUpdate(callback?: () => void): void;
    render(): ReactNode;
    props: Readonly<P>;
    state: Readonly<S>;
    context: any;
    refs: {
      [key: string]: any;
    };
  }
  
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  export function useContext<T>(context: React.Context<T>): T;
  export function createContext<T>(defaultValue: T): React.Context<T>;
  
  export interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
    displayName?: string;
  }
  
  export type Provider<T> = ComponentType<ProviderProps<T>>;
  export type Consumer<T> = ComponentType<ConsumerProps<T>>;
  export type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;
  export type ComponentClass<P = {}> = new (props: P) => Component<P, any>;
  export type FunctionComponent<P = {}> = (props: P) => ReactElement<any, any> | null;
  export type ProviderProps<T> = {
    value: T;
    children?: ReactNode;
  };
  export type ConsumerProps<T> = {
    children: (value: T) => ReactNode;
  };
}

// JSX related declarations
declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
  
  interface ElementAttributesProperty {
    props: {};
  }
  
  interface ElementChildrenAttribute {
    children: {};
  }
  
  interface IntrinsicElements {
    [elemName: string]: any;
  }
} 