"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const use_ssr_1 = __importDefault(require("use-ssr"));
/**
 * Used for error checking. If the condition is false, throw an error
 */
function invariant(condition, format, a = '', b = '', c = '', d = '', e = '', f = '') {
    if (process.env.NODE_ENV !== 'production') {
        if (format === undefined) {
            throw new Error('invariant requires an error message argument');
        }
    }
    if (!condition) {
        let error;
        if (format === undefined) {
            error = new Error('Minified exception occurred; use the non-minified dev environment ' +
                'for the full error message and additional helpful warnings.');
        }
        else {
            const args = [a, b, c, d, e, f];
            let argIndex = 0;
            error = new Error(format.replace(/%s/g, () => args[argIndex++]));
            error.name = 'Invariant Violation';
        }
        throw error;
    }
}
exports.invariant = invariant;
exports.useExampleURL = () => {
    const { isBrowser } = use_ssr_1.default();
    return react_1.useMemo(() => isBrowser ? window.location.origin : 'https://example.com', [isBrowser]);
};
function useURLRequiredInvariant(condition, method, optionalMessage) {
    const exampleURL = exports.useExampleURL();
    react_1.useEffect(() => {
        invariant(condition, `${method} requires a URL to be set as the 1st argument,\n
      unless you wrap your app like:\n
      <Provider url="${exampleURL}"><App /></Provider>\n
      ${optionalMessage}`);
    }, [condition, exampleURL, method, optionalMessage]);
}
exports.useURLRequiredInvariant = useURLRequiredInvariant;
exports.isString = (x) => typeof x === 'string'; // eslint-disable-line
/**
 * Determines if the given param is an object. {}
 * @param obj
 */
exports.isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]'; // eslint-disable-line
exports.isFunction = (v) => typeof v === 'function';
// TODO: come back and fix the "anys" in this http://bit.ly/2Lm3OLi
/**
 * Makes an object that will match the standards of a normal fetch's options
 * aka: pulls out all useFetch's special options like "onMount"
 */
exports.pullOutRequestInit = (options) => {
    if (!options)
        return {};
    const requestInitFields = [
        'body',
        'cache',
        'credentials',
        'headers',
        'integrity',
        'keepalive',
        'method',
        'mode',
        'redirect',
        'referrer',
        'referrerPolicy',
        'signal',
        'window',
    ];
    return requestInitFields.reduce((acc, key) => {
        if (key in options)
            acc[key] = options[key];
        return acc;
    }, {});
};
exports.isEmpty = (x) => x === undefined || x === null;
exports.isBrowser = !!(typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement);
exports.isServer = !exports.isBrowser;
//# sourceMappingURL=utils.js.map