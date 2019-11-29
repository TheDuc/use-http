import { ReactNode } from 'react';
export declare enum HTTPMethod {
    DELETE = "DELETE",
    GET = "GET",
    HEAD = "HEAD",
    OPTIONS = "OPTIONS",
    PATCH = "PATCH",
    POST = "POST",
    PUT = "PUT"
}
export interface RouteAndOptions {
    route: string;
    options: RequestInit;
}
export interface FetchContextTypes {
    url: string;
    options: Options;
    graphql?: boolean;
}
export interface FetchProviderProps {
    url?: string;
    options?: Options;
    graphql?: boolean;
    children: ReactNode;
}
export declare type BodyOnly = (body: BodyInit | object) => Promise<any>;
export declare type RouteOnly = (route: string) => Promise<any>;
export declare type RouteAndBodyOnly = (route: string, body: BodyInit | object) => Promise<any>;
export declare type NoArgs = () => Promise<any>;
export declare type FetchData = (routeOrBody?: string | BodyInit | object, body?: BodyInit | object) => Promise<any>;
export declare type RequestInitJSON = RequestInit & {
    headers: {
        'Content-Type': string;
    };
};
export interface ReqMethods {
    get: (route?: string) => Promise<any>;
    post: FetchData;
    patch: FetchData;
    put: FetchData;
    del: FetchData;
    delete: FetchData;
    query: (query: string, variables?: BodyInit | object) => Promise<any>;
    mutate: (mutation: string, variables?: BodyInit | object) => Promise<any>;
    abort: () => void;
}
export interface Data<TData> {
    data: TData | undefined;
}
export interface ReqBase<TData> {
    data: TData | undefined;
    loading: boolean;
    error: Error;
}
export interface Res<TData> extends Response {
    data?: TData | undefined;
}
export declare type Req<TData = any> = ReqMethods & ReqBase<TData>;
export declare type UseFetchArgs = [(string | OptionsMaybeURL | OverwriteGlobalOptions)?, (NoUrlOptions | OverwriteGlobalOptions | any[])?, any[]?];
export declare type UseFetchArrayReturn<TData> = [Req<TData>, Res<TData>, boolean, Error];
export declare type UseFetchObjectReturn<TData> = ReqBase<TData> & ReqMethods & {
    request: Req<TData>;
    response: Res<TData>;
};
export declare type UseFetch<TData> = UseFetchArrayReturn<TData> & UseFetchObjectReturn<TData>;
export declare type Interceptors = {
    request?: (options: Options, url: string, path: string, route: string) => Promise<Options> | Options;
    response?: (response: Res<any>) => Res<any>;
};
export interface CustomOptions {
    retries?: number;
    timeout?: number;
    path?: string;
    url?: string;
    loading?: boolean;
    data?: any;
    interceptors?: Interceptors;
    onAbort?: () => void;
    onTimeout?: () => void;
    onNewData?: (currData: any, newData: any) => any;
}
export declare type Options = CustomOptions & Omit<RequestInit, 'body'> & {
    body?: BodyInit | object | null;
};
export declare type NoUrlOptions = Omit<Options, 'url'>;
export declare type OptionsMaybeURL = NoUrlOptions & Partial<Pick<Options, 'url'>> & {
    url?: string;
};
export declare type OverwriteGlobalOptions = (options: Options) => Options;
/**
 * Helpers
 */
export declare type ValueOf<T> = T[keyof T];
export declare type NonObjectKeysOf<T> = {
    [K in keyof T]: T[K] extends Array<any> ? K : T[K] extends object ? never : K;
}[keyof T];
export declare type ObjectValuesOf<T extends Object> = Exclude<Exclude<Extract<ValueOf<T>, object>, never>, Array<any>>;
export declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
export declare type Flatten<T> = Pick<T, NonObjectKeysOf<T>> & UnionToIntersection<ObjectValuesOf<T>>;
