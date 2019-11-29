import { HTTPMethod, Interceptors, ValueOf, RouteAndOptions } from './types';
export default function makeRouteAndOptions(initialOptions: RequestInit, url: string, path: string, method: HTTPMethod, controller: AbortController, routeOrBody?: string | BodyInit | object, bodyAs2ndParam?: BodyInit | object, requestInterceptor?: ValueOf<Pick<Interceptors, 'request'>>): Promise<RouteAndOptions>;
