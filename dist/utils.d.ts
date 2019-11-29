import { OptionsMaybeURL } from './types';
/**
 * Used for error checking. If the condition is false, throw an error
 */
export declare function invariant(condition: boolean, format: string, a?: string, b?: string, c?: string, d?: string, e?: string, f?: string): void;
export declare const useExampleURL: () => string;
export declare function useURLRequiredInvariant(condition: boolean, method: string, optionalMessage?: string): void;
export declare const isString: (x: any) => x is string;
/**
 * Determines if the given param is an object. {}
 * @param obj
 */
export declare const isObject: (obj: any) => obj is object;
export declare const isFunction: (v: any) => boolean;
/**
 * Makes an object that will match the standards of a normal fetch's options
 * aka: pulls out all useFetch's special options like "onMount"
 */
export declare const pullOutRequestInit: (options?: OptionsMaybeURL | undefined) => RequestInit;
export declare const isEmpty: (x: any) => boolean;
export declare const isBrowser: boolean;
export declare const isServer: boolean;
