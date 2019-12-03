"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const react_1 = require("react");
const FetchContext_1 = __importDefault(require("./FetchContext"));
const utils_2 = require("./utils");
exports.useFetchArgsDefaults = {
    customOptions: {
        retries: 0,
        timeout: 30000,
        path: '',
        url: '',
        interceptors: {},
        onAbort: () => { },
        onTimeout: () => { },
        onNewData: (currData, newData) => newData,
    },
    requestInit: { headers: {} },
    defaults: {
        data: undefined,
        loading: false,
    },
    dependencies: undefined,
};
const defaults = Object.entries(exports.useFetchArgsDefaults).reduce((acc, [key, value]) => {
    if (utils_1.isObject(value))
        return Object.assign(Object.assign({}, acc), value);
    return Object.assign(Object.assign({}, acc), { [key]: value });
}, {});
function useFetchArgs(urlOrOptionsOrOverwriteGlobal, optionsNoURLsOrOverwriteGlobalOrDeps, deps) {
    const context = react_1.useContext(FetchContext_1.default);
    context.options = react_1.useMemo(() => {
        const overwriteGlobalOptions = (utils_2.isFunction(urlOrOptionsOrOverwriteGlobal) ? urlOrOptionsOrOverwriteGlobal : utils_2.isFunction(optionsNoURLsOrOverwriteGlobalOrDeps) && optionsNoURLsOrOverwriteGlobalOrDeps);
        if (!overwriteGlobalOptions)
            return context.options;
        // make a copy so we make sure not to modify the original context
        return overwriteGlobalOptions(Object.assign({}, context.options));
    }, [context.options]);
    const urlOrOptions = urlOrOptionsOrOverwriteGlobal;
    const optionsNoURLs = optionsNoURLsOrOverwriteGlobalOrDeps;
    utils_1.invariant(!(utils_1.isObject(urlOrOptions) && utils_1.isObject(optionsNoURLs)), 'You cannot have a 2nd parameter of useFetch when your first argument is an object config.');
    const url = react_1.useMemo(() => {
        if (utils_1.isString(urlOrOptions) && urlOrOptions)
            return urlOrOptions;
        if (utils_1.isObject(urlOrOptions) && !!urlOrOptions.url)
            return urlOrOptions.url;
        if (context.url)
            return context.url;
        return defaults.url;
    }, [context.url, urlOrOptions]);
    utils_1.invariant(!!url, 'The first argument of useFetch is required unless you have a global url setup like: <Provider url="https://example.com"></Provider>');
    const dependencies = react_1.useMemo(() => {
        if (Array.isArray(optionsNoURLsOrOverwriteGlobalOrDeps))
            return optionsNoURLsOrOverwriteGlobalOrDeps;
        if (Array.isArray(deps))
            return deps;
        return defaults.dependencies;
    }, []);
    const data = useField('data', urlOrOptions, optionsNoURLs);
    const path = useField('path', urlOrOptions, optionsNoURLs);
    const timeout = useField('timeout', urlOrOptions, optionsNoURLs);
    const retries = useField('retries', urlOrOptions, optionsNoURLs);
    const onAbort = useField('onAbort', urlOrOptions, optionsNoURLs);
    const onTimeout = useField('onTimeout', urlOrOptions, optionsNoURLs);
    const onNewData = useField('onNewData', urlOrOptions, optionsNoURLs);
    const loading = react_1.useMemo(() => {
        if (utils_1.isObject(urlOrOptions))
            return !!urlOrOptions.loading || Array.isArray(dependencies);
        if (utils_1.isObject(optionsNoURLs))
            return !!optionsNoURLs.loading || Array.isArray(dependencies);
        return defaults.loading || Array.isArray(dependencies);
    }, [urlOrOptions, optionsNoURLs]);
    const interceptors = react_1.useMemo(() => {
        const contextInterceptors = context.options && context.options.interceptors || {};
        const final = Object.assign({}, contextInterceptors);
        if (utils_1.isObject(urlOrOptions) && utils_1.isObject(urlOrOptions.interceptors)) {
            if (urlOrOptions.interceptors.request)
                final.request = urlOrOptions.interceptors.request;
            if (urlOrOptions.interceptors.response)
                final.response = urlOrOptions.interceptors.response;
        }
        if (utils_1.isObject(optionsNoURLs) && utils_1.isObject(optionsNoURLs.interceptors)) {
            if (optionsNoURLs.interceptors.request)
                final.request = optionsNoURLs.interceptors.request;
            if (optionsNoURLs.interceptors.response)
                final.response = optionsNoURLs.interceptors.response;
        }
        return final;
    }, [urlOrOptions, optionsNoURLs]);
    const requestInit = react_1.useMemo(() => {
        const contextRequestInit = utils_1.pullOutRequestInit(context.options);
        const requestInitOptions = utils_1.isObject(urlOrOptions)
            ? urlOrOptions
            : utils_1.isObject(optionsNoURLs)
                ? optionsNoURLs
                : {};
        const requestInit = utils_1.pullOutRequestInit(requestInitOptions);
        return Object.assign(Object.assign(Object.assign({}, contextRequestInit), requestInit), { headers: Object.assign(Object.assign({}, contextRequestInit.headers), requestInit.headers) });
    }, [urlOrOptions, optionsNoURLs]);
    return {
        customOptions: {
            url,
            path,
            interceptors,
            timeout,
            retries,
            onAbort,
            onTimeout,
            onNewData,
        },
        requestInit,
        defaults: {
            data,
            loading
        },
        dependencies
    };
}
exports.default = useFetchArgs;
const useField = (field, urlOrOptions, optionsNoURLs) => {
    const context = react_1.useContext(FetchContext_1.default);
    const contextOptions = context.options || {};
    return react_1.useMemo(() => {
        if (utils_1.isObject(urlOrOptions) && urlOrOptions[field])
            return urlOrOptions[field];
        if (utils_1.isObject(optionsNoURLs) && optionsNoURLs[field]) {
            return optionsNoURLs[field];
        }
        if (contextOptions[field])
            return contextOptions[field];
        return defaults[field];
    }, [urlOrOptions, optionsNoURLs]);
};
//# sourceMappingURL=useFetchArgs.js.map