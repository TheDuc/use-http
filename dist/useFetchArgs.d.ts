import { OptionsMaybeURL, NoUrlOptions, CachePolicies } from './types';
import { Interceptors, OverwriteGlobalOptions } from './types';
declare type UseFetchArgsReturn = {
    customOptions: {
        retries: number;
        timeout: number;
        path: string;
        url: string;
        interceptors: Interceptors;
        onAbort: () => void;
        onTimeout: () => void;
        onNewData: (currData: any, newData: any) => any;
        perPage: number;
        cachePolicy: CachePolicies;
        cacheLife: number;
    };
    requestInit: RequestInit;
    defaults: {
        loading: boolean;
        data?: any;
    };
    dependencies?: any[];
};
export declare const useFetchArgsDefaults: {
    customOptions: {
        retries: number;
        timeout: number;
        path: string;
        url: string;
        interceptors: {};
        onAbort: () => void;
        onTimeout: () => void;
        onNewData: (currData: any, newData: any) => any;
        perPage: number;
        cachePolicy: CachePolicies;
        cacheLife: number;
    };
    requestInit: {
        headers: {};
    };
    defaults: {
        data: undefined;
        loading: boolean;
    };
    dependencies: undefined;
};
export default function useFetchArgs(urlOrOptionsOrOverwriteGlobal?: string | OptionsMaybeURL | OverwriteGlobalOptions, optionsNoURLsOrOverwriteGlobalOrDeps?: NoUrlOptions | OverwriteGlobalOptions | any[], deps?: any[]): UseFetchArgsReturn;
export {};
