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
exports.useMutation = (urlOrMutation, mutationArg) => {
    const context = react_1.useContext(_1.FetchContext);
    utils_1.useURLRequiredInvariant(!!context.url && Array.isArray(urlOrMutation), 'useMutation');
    utils_1.useURLRequiredInvariant(!!context.url || utils_1.isString(urlOrMutation) && !mutationArg, 'useMutation', 'OR you need to do useMutation("https://example.com", `your graphql mutation`)');
    // regular no context: useMutation('https://example.com', `graphql MUTATION`)
    let url = urlOrMutation;
    let MUTATION = mutationArg;
    // tagged template literal with context: useMutation`graphql MUTATION`
    if (Array.isArray(urlOrMutation) && context.url) {
        utils_1.invariant(!mutationArg, 'You cannot have a 2nd argument when using tagged template literal syntax with useMutation.');
        url = context.url;
        MUTATION = urlOrMutation[0];
        // regular with context: useMutation(`graphql MUTATION`)
    }
    else if (urlOrMutation && !mutationArg && context.url) {
        url = context.url;
        MUTATION = urlOrMutation;
    }
    const _a = _1.default(url), { loading, error } = _a, request = __rest(_a, ["loading", "error"]);
    const mutate = react_1.useCallback((inputs) => request.mutate(MUTATION, inputs), [MUTATION, request]);
    const data = (request.data || { data: undefined }).data;
    return Object.assign([data, loading, error, mutate], { data, loading, error, mutate });
};
//# sourceMappingURL=useMutation.js.map