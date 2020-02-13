import { HTTPMethod, Interceptors, ValueOf, DoFetchArgs } from './types';
export default function doFetchArgs(initialOptions: RequestInit, initialURL: string, path: string, method: HTTPMethod, controller: AbortController, routeOrBody?: string | BodyInit | object, bodyAs2ndParam?: BodyInit | object, requestInterceptor?: ValueOf<Pick<Interceptors, 'request'>>): Promise<DoFetchArgs>;
