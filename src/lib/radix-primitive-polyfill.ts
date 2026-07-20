// Radix UI primitive polyfill to provide all required exports
export const IS_DEVELOPMENT = import.meta.env.DEV;

// Additional exports that Radix UI packages might need
export const DismissableLayer = null;
export const composeEventHandlers = (...args: any[]) => args[args.length - 1];
export const composeRefs = (...refs: any[]) => (node: any) => refs.forEach(ref => ref?.(node));
export const useComposedRefs = (...refs: any[]) => composeRefs(...refs);
export const useSize = () => ({ width: 0, height: 0 });

