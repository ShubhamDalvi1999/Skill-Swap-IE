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
  let importPromise: Promise<void> | null = null;
  
  return new Proxy({} as unknown as T, {
    get: (target, prop) => {
      if (!module) {
        if (!importPromise) {
          // Start the import if it hasn't started yet
          importPromise = importFn()
            .then(mod => {
              module = mod.default;
              if (!module) {
                console.error('lazyImport: Imported module is undefined or null!', mod);
              } else {
                console.log('lazyImport: Module loaded successfully:', mod);
              }
            })
            .catch(err => {
              console.error('Error lazily importing module:', err);
              throw err;
            });
        }
        
        // If the import is still in progress, throw an error
        // This prevents accessing the module before it's ready
        throw new Error('Module not loaded yet. Please await the import first.');
      }
      
      return module[prop as keyof T];
    }
  });
}

/**
 * Pre-loads a module to ensure it's available when needed
 * 
 * @param importFn Function that returns a dynamic import
 * @returns A promise that resolves when the module is loaded
 */
export function preloadModule<T>(importFn: () => Promise<{ default: T }>): Promise<T> {
  return importFn().then(mod => mod.default);
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
    console.error('createSafeClass: BaseClass is undefined or not a function!', BaseClass);
    throw new Error('Cannot extend a null or undefined class. Ensure the base class is loaded.');
  }
  
  try {
    // Create a wrapper around the base class to ensure it's properly initialized
    const SafeBaseClass = class extends (BaseClass as unknown as new (...args: unknown[]) => Base) {};
    
    // Now create the actual class using our safe base
    return constructorFn(SafeBaseClass as unknown as new (...args: unknown[]) => Base);
  } catch (error) {
    console.error('Error creating class:', error);
    
    // Fallback implementation if the class extension fails
    const FallbackClass = class {
      constructor(...args: unknown[]) {
        console.warn('Using fallback class implementation due to errors in class creation');
      }
    };
    
    return FallbackClass as unknown as new (...args: unknown[]) => T;
  }
} 