var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "node-fetch", "query-string"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Request = void 0;
    const node_fetch_1 = __importDefault(require("node-fetch"));
    const query_string_1 = require("query-string");
    class Request {
        static formatConfigUrl(urlOptions) {
            const { appId, clusterName, namespaceName, configServerUrl, releaseKey, ip } = urlOptions;
            const url = configServerUrl.endsWith('/') ? configServerUrl.substring(0, configServerUrl.length - 1) : configServerUrl;
            const params = Object.create(null);
            if (releaseKey) {
                params.releaseKey = releaseKey;
            }
            if (ip) {
                params.ip = ip;
            }
            return `${url}/configs/${appId}/${clusterName}/${namespaceName}?${(0, query_string_1.stringify)(params)}`;
        }
        static async fetchConfig(url, headers) {
            const response = await (0, node_fetch_1.default)(url, { headers });
            const status = response.status;
            const text = await response.text();
            if (status === 304)
                return null;
            if (status != 200)
                throw new Error(`Http request error: ${status}, ${response.statusText}`);
            if (!text)
                return null;
            return JSON.parse(text);
        }
        static formatNotificationsUrl(options, configsMap) {
            const { configServerUrl, appId, clusterName } = options;
            const url = configServerUrl.endsWith('/') ? configServerUrl.substring(0, configServerUrl.length - 1) : configServerUrl;
            const notifications = [];
            for (const config of configsMap.values()) {
                const temp = {
                    namespaceName: config.getNamespaceName(),
                    notificationId: config.getNotificationId(),
                };
                notifications.push(temp);
            }
            const strParams = (0, query_string_1.stringify)({
                appId: appId,
                cluster: clusterName,
                notifications: JSON.stringify(notifications),
            });
            return `${url}/notifications/v2?${strParams}`;
        }
        static async fetchNotifications(url, headers) {
            const response = await (0, node_fetch_1.default)(url, { headers, signal: AbortSignal.timeout(70000) });
            const status = response.status;
            const text = await response.text();
            if (status === 304)
                return null;
            if (status != 200)
                throw new Error(`Http request error: ${status}, ${response.statusText}`);
            if (!text)
                return null;
            return JSON.parse(text);
        }
    }
    exports.Request = Request;
});
//# sourceMappingURL=request.js.map