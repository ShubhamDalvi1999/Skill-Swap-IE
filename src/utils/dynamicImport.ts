/**
 * Utility for handling dynamic imports and breaking circular dependencies
 * This helps prevent "Super constructor null" errors that can happen when
 * classes try to extend each other in a circular way
 */

/**
 * Dynamically import a module only when needed, rather than at module load time
 * This can break circular dependencies that cause "Super constructor null" errors
 * 
 * @param importFn Function that returns a dynamic import
 * @returns A proxy that will load the module on first access
 */
export function lazyImport<T extends object>(importFn: () => Promise<{ default: T }>): T {
  let module: T | null = null;
  
  return new Proxy({} as unknown as T, {
    get: (target, prop) => {
      if (!module) {
        // This will be a promise on first access
        const promise = importFn().then(mod => {
          module = mod.default;
        });
        
        // If they try to access before the import completes
        if (!module) {
          throw new Error('Module not loaded yet. Please await the import first.');
        }
      }
      
      return module[prop as keyof T];
    }
  });
}

/**
 * Safely create a class that extends another class that might be loaded dynamically
 * This helps prevent "Super constructor null" errors
 * 
 * @param BaseClass The class to extend
 * @param constructorFn Function that creates the class
 * @returns The created class
 */
export function createSafeClass<Base, T extends Base>(
  BaseClass: new (...args: unknown[]) => Base,
  constructorFn: (base: new (...args: unknown[]) => Base) => new (...args: unknown[]) => T
): new (...args: unknown[]) => T {
  // Make sure BaseClass exists before extending it
  if (!BaseClass || typeof BaseClass !== 'function') {
    throw new Error('Cannot extend a null or undefined class. Ensure the base class is loaded.');
  }
  
  try {
    return constructorFn(BaseClass);
  } catch (error) {
    console.error('Error creating class:', error);
    
    // Fallback implementation if the class extension fails
    // Need to use 'any' here as TypeScript cannot safely type this dynamic class extension
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return class FallbackClass extends (BaseClass as any) {
      constructor(...args: unknown[]) {
        super(...args);
        console.warn('Using fallback class implementation due to errors in class creation');
      }
    } as unknown as new (...args: unknown[]) => T;
  }
} 