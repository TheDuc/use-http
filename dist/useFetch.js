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
const types_1 = require("./types");
const useFetchArgs_1 = __importDefault(require("./useFetchArgs"));
const use_ssr_1 = __importDefault(require("use-ssr"));
const makeRouteAndOptions_1 = __importDefault(require("./makeRouteAndOptions"));
const utils_1 = require("./utils");
const responseMethods = ['clone', 'error', 'redirect', 'arrayBuffer', 'blob', 'formData', 'json', 'text'];
const makeResponseProxy = (res = {}) => new Proxy(res, {
    get: (httpResponse, key) => {
        if (responseMethods.includes(key))
            return () => httpResponse.current[key]();
        return (httpResponse.current || {})[key];
    }
});
function useFetch(...args) {
    const { customOptions, requestInit, defaults, dependencies } = useFetchArgs_1.default(...args);
    const { url, path, interceptors, timeout, retries, onTimeout, onAbort, onNewData, } = customOptions;
    const { isServer } = use_ssr_1.default();
    const controller = react_1.useRef();
    const res = react_1.useRef({});
    const data = react_1.useRef(defaults.data);
    const timedout = react_1.useRef(false);
    const attempts = react_1.useRef(retries);
    const [loading, setLoading] = react_1.useState(defaults.loading);
    const [error, setError] = react_1.useState();
    const makeFetch = react_1.useCallback((method) => {
        const doFetch = (routeOrBody, body) => __awaiter(this, void 0, void 0, function* () {
            if (isServer)
                return; // for now, we don't do anything on the server
            controller.current = new AbortController();
            controller.current.signal.onabort = onAbort;
            const theController = controller.current;
            setLoading(true);
            setError(undefined);
            let { route, options } = yield makeRouteAndOptions_1.default(requestInit, url, path, method, theController, routeOrBody, body, interceptors.request);
            const timer = timeout > 0 && setTimeout(() => {
                timedout.current = true;
                theController.abort();
                if (onTimeout)
                    onTimeout();
            }, timeout);
            let newData;
            let theRes;
            try {
                theRes = ((yield fetch(`${url}${path}${route}`, options)) || {});
                res.current = theRes.clone();
                try {
                    newData = yield theRes.json();
                }
                catch (err) {
                    newData = (yield theRes.text()); // FIXME: should not be `any` type
                }
                newData = (defaults.data && utils_1.isEmpty(newData)) ? defaults.data : newData;
                res.current.data = onNewData(data.current, newData);
                res.current = interceptors.response ? interceptors.response(res.current) : res.current;
                utils_1.invariant('data' in res.current, 'You must have `data` field on the Response returned from your `interceptors.response`');
                data.current = res.current.data;
            }
            catch (err) {
                if (attempts.current > 0)
                    return doFetch(routeOrBody, body);
                if (attempts.current < 1 && timedout.current)
                    setError({ name: 'AbortError', message: 'Timeout Error' });
                if (err.name !== 'AbortError')
                    setError(err);
            }
            finally {
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
    }, [url, requestInit, isServer]);
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
        error,
        data: data.current,
    };
    // onMount/onUpdate
    react_1.useEffect(() => {
        if (dependencies && Array.isArray(dependencies)) {
            const methodName = requestInit.method || types_1.HTTPMethod.GET;
            const methodLower = methodName.toLowerCase();
            if (methodName !== types_1.HTTPMethod.GET) {
                const req = request[methodLower];
                req(requestInit.body);
            }
            else {
                const req = request[methodLower];
                req();
            }
        }
    }, dependencies);
    // Cancel any running request when unmounting to avoid updating state after component has unmounted
    // This can happen if a request's promise resolves after component unmounts
    react_1.useEffect(() => request.abort, []);
    return Object.assign([request, makeResponseProxy(res), loading, error], Object.assign({ request, response: makeResponseProxy(res) }, request));
}
exports.useFetch = useFetch;
exports.default = useFetch;
//# sourceMappingURL=useFetch.js.map