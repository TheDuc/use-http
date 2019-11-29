"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const use_ssr_1 = __importDefault(require("use-ssr"));
const FetchContext_1 = __importDefault(require("./FetchContext"));
exports.Provider = ({ url, options, graphql = false, children, }) => {
    const { isBrowser } = use_ssr_1.default();
    const defaults = react_1.useMemo(() => ({
        url: url || (isBrowser ? window.location.origin : ''),
        options: options || {},
        graphql,
    }), [options, graphql, isBrowser, url]);
    return (react_1.default.createElement(FetchContext_1.default.Provider, { value: defaults }, children));
};
//# sourceMappingURL=Provider.js.map