"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importStar(require("."));
const react_1 = require("react");
const utils_1 = require("./utils");
exports.useQuery = (urlOrQuery, queryArg) => {
    const context = react_1.useContext(_1.FetchContext);
    utils_1.useURLRequiredInvariant(!!context.url && Array.isArray(urlOrQuery), 'useQuery');
    utils_1.useURLRequiredInvariant(!!context.url || utils_1.isString(urlOrQuery) && !queryArg, 'useQuery', 'OR you need to do useQuery("https://example.com", `your graphql query`)');
    // regular no context: useQuery('https://example.com', `graphql QUERY`)
    let url = urlOrQuery;
    let QUERY = queryArg;
    // tagged template literal with context: useQuery`graphql QUERY`
    if (Array.isArray(urlOrQuery) && context.url) {
        utils_1.invariant(!queryArg, 'You cannot have a 2nd argument when using tagged template literal syntax with useQuery.');
        url = context.url;
        QUERY = urlOrQuery[0];
        // regular with context: useQuery(`graphql QUERY`)
    }
    else if (urlOrQuery && !queryArg && context.url) {
        url = context.url;
        QUERY = urlOrQuery;
    }
    const _a = _1.default(url), { loading, error } = _a, request = __rest(_a, ["loading", "error"]);
    const query = react_1.useCallback((variables) => request.query(QUERY, variables), [QUERY, request]);
    const data = (request.data || { data: undefined }).data;
    return Object.assign([data, loading, error, query], { data, loading, error, query });
};
//# sourceMappingURL=useQuery.js.map