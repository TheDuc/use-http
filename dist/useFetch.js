"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const use_ssr_1 = __importDefault(require("use-ssr"));
const types_1 = require("./types");
const useFetchArgs_1 = __importDefault(require("./useFetchArgs"));
const doFetchArgs_1 = __importDefault(require("./doFetchArgs"));
const utils_1 = require("./utils");
const { CACHE_FIRST } = types_1.CachePolicies;
const responseMethods = ['clone', 'error', 'redirect', 'arrayBuffer', 'blob', 'formData', 'json', 'text'];
const makeResponseProxy = (res = {}) => new Proxy(res, {
    get: (httpResponse, key) => {
        if (responseMethods.includes(key))
            return () => httpResponse.current[key]();
        return (httpResponse.current || {})[key];
    }
});
const cache = new Map();
function useFetch(...args) {
    const { customOptions, requestInit, defaults, dependencies } = useFetchArgs_1.default(...args);
    const { url: initialURL, path, interceptors, timeout, retries, onTimeout, onAbort, onNewData, perPage, cachePolicy, // 'cache-first' by default
    cacheLife, } = customOptions;
    const { isServer } = use_ssr_1.default();
    const controller = react_1.useRef();
    const res = react_1.useRef({});
    const data = react_1.useRef(defaults.data);
    const timedout = react_1.useRef(false);
    const attempts = react_1.useRef(retries);
    const error = react_1.useRef();
    const hasMore = react_1.useRef(true);
    const [loading, setLoading] = react_1.useState(defaults.loading);
    const makeFetch = react_1.useCallback((method) => {
        const doFetch = (routeOrBody, body) => __awaiter(this, void 0, void 0, function* () {
            if (isServer)
                return; // for now, we don't do anything on the server
            controller.current = new AbortController();
            controller.current.signal.onabort = onAbort;
            const theController = controller.current;
            let { url, options, requestID } = yield doFetchArgs_1.default(requestInit, initialURL, path, method, theController, routeOrBody, body, interceptors.request);
            const isCached = cache.has(requestID);
            const cachedData = cache.get(requestID);
            if (isCached && cachePolicy === CACHE_FIRST) {
                const whenCached = cache.get(requestID + ':ts');
                let age = Date.now() - whenCached;
                if (cacheLife > 0 && age > cacheLife) {
                    cache.delete(requestID);
                    cache.delete(requestID + ':ts');
                }
                else {
                    return cachedData;
                }
            }
            // don't perform the request if there is no more data to fetch (pagination)
            if (perPage > 0 && !hasMore.current && !error.current)
                return data.current;
            setLoading(true);
            error.current = undefined;
            const timer = timeout > 0 && setTimeout(() => {
                timedout.current = true;
                theController.abort();
                if (onTimeout)
                    onTimeout();
            }, timeout);
            let newData;
            let newRes;
            try {
                newRes = ((yield fetch(url, options)) || {});
                res.current = newRes.clone();
                try {
                    newData = yield newRes.json();
                }
                catch (er) {
                    try {
                        newData = (yield newRes.text()); // FIXME: should not be `any` type
                    }
                    catch (er) { }
                }
                newData = (defaults.data && utils_1.isEmpty(newData)) ? defaults.data : newData;
                res.current.data = onNewData(data.current, newData);
                res.current = interceptors.response ? interceptors.response(res.current) : res.current;
                utils_1.invariant('data' in res.current, 'You must have `data` field on the Response returned from your `interceptors.response`');
                data.current = res.current.data;
                if (Array.isArray(data.current) && !!(data.current.length % perPage))
                    hasMore.current = false;
                if (cachePolicy === CACHE_FIRST) {
                    cache.set(requestID, data.current);
                    if (cacheLife > 0)
                        cache.set(requestID + ':ts', Date.now());
                }
            }
            catch (err) {
                if (attempts.current > 0)
                    return doFetch(routeOrBody, body);
                if (attempts.current < 1 && timedout.current)
                    error.current = { name: 'AbortError', message: 'Timeout Error' };
                if (err.name !== 'AbortError')
                    error.current = err;
            }
            finally {
                if (newRes && !newRes.ok && !error.current)
                    error.current = { name: newRes.status, message: newRes.statusText };
                if (attempts.current > 0)
                    attempts.current -= 1;
                timedout.current = false;
                if (timer)
                    clearTimeout(timer);
                controller.current = undefined;
                setLoading(false);
            }
            return data.current;
        });
        return doFetch;
    }, [initialURL, requestInit, isServer]);
    const post = react_1.useCallback(makeFetch(types_1.HTTPMethod.POST), [makeFetch]);
    const del = react_1.useCallback(makeFetch(types_1.HTTPMethod.DELETE), [makeFetch]);
    const request = {
        get: react_1.useCallback(makeFetch(types_1.HTTPMethod.GET), [makeFetch]),
        post,
        patch: react_1.useCallback(makeFetch(types_1.HTTPMethod.PATCH), [makeFetch]),
        put: react_1.useCallback(makeFetch(types_1.HTTPMethod.PUT), [makeFetch]),
        del,
        delete: del,
        abort: () => controller.current && controller.current.abort(),
        query: (query, variables) => post({ query, variables }),
        mutate: (mutation, variables) => post({ mutation, variables }),
        loading: loading,
        error: error.current,
        data: data.current,
    };
    // onMount/onUpdate
    react_1.useEffect(() => {
        if (dependencies && Array.isArray(dependencies)) {
            const methodName = requestInit.method || types_1.HTTPMethod.GET;
            const methodLower = methodName.toLowerCase();
            const req = request[methodLower];
            req();
        }
    }, dependencies);
    // Cancel any running request when unmounting to avoid updating state after component has unmounted
    // This can happen if a request's promise resolves after component unmounts
    react_1.useEffect(() => request.abort, []);
    return Object.assign([request, makeResponseProxy(res), loading, error.current], Object.assign({ request, response: makeResponseProxy(res) }, request));
}
exports.useFetch = useFetch;
exports.default = useFetch;
//# sourceMappingURL=useFetch.js.map