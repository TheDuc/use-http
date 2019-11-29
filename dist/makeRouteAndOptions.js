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
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const utils_1 = require("./utils");
const { GET } = types_1.HTTPMethod;
function makeRouteAndOptions(initialOptions, url, path, method, controller, routeOrBody, bodyAs2ndParam, requestInterceptor) {
    return __awaiter(this, void 0, void 0, function* () {
        utils_1.invariant(!(utils_1.isObject(routeOrBody) && utils_1.isObject(bodyAs2ndParam)), `If first argument of ${method.toLowerCase()}() is an object, you cannot have a 2nd argument. 😜`);
        utils_1.invariant(!(method === GET && utils_1.isObject(routeOrBody)), `You can only have query params as 1st argument of request.get()`);
        utils_1.invariant(!(method === GET && bodyAs2ndParam !== undefined), `You can only have query params as 1st argument of request.get()`);
        const route = (() => {
            if (utils_1.isBrowser && routeOrBody instanceof URLSearchParams)
                return `?${routeOrBody}`;
            if (utils_1.isString(routeOrBody))
                return routeOrBody;
            return '';
        })();
        const body = (() => {
            if (utils_1.isObject(routeOrBody))
                return JSON.stringify(routeOrBody);
            if (utils_1.isObject(bodyAs2ndParam))
                return JSON.stringify(bodyAs2ndParam);
            if (utils_1.isBrowser &&
                (bodyAs2ndParam instanceof FormData ||
                    bodyAs2ndParam instanceof URLSearchParams))
                return bodyAs2ndParam;
            if (utils_1.isObject(initialOptions.body))
                return JSON.stringify(initialOptions.body);
            return null;
        })();
        const headers = (() => {
            const contentType = (initialOptions.headers || {})['Content-Type'];
            const shouldAddContentType = !!contentType || [types_1.HTTPMethod.POST, types_1.HTTPMethod.PUT].includes(method);
            const headers = Object.assign({}, initialOptions.headers);
            if (shouldAddContentType) {
                // default content types http://bit.ly/2N2ovOZ
                // Accept: 'application/json',
                // roughly, should only add for POST and PUT http://bit.ly/2NJNt3N
                // unless specified by the user
                headers['Content-Type'] = contentType || 'application/json';
            }
            else if (Object.keys(headers).length === 0) {
                return null;
            }
            return headers;
        })();
        const options = yield (() => __awaiter(this, void 0, void 0, function* () {
            const opts = Object.assign(Object.assign({}, initialOptions), { url,
                path,
                method, signal: controller.signal });
            if (headers !== null) {
                opts.headers = headers;
            }
            else {
                delete opts.headers;
            }
            if (body !== null)
                opts.body = body;
            if (requestInterceptor)
                return yield requestInterceptor(opts, url, path);
            return opts;
        }))();
        return {
            route,
            options,
        };
    });
}
exports.default = makeRouteAndOptions;
//# sourceMappingURL=makeRouteAndOptions.js.map