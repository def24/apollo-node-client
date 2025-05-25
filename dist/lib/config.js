(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "stream", "./access", "./constants", "./request"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Config = void 0;
    const stream_1 = require("stream");
    const access_1 = require("./access");
    const constants_1 = require("./constants");
    const request_1 = require("./request");
    class Config extends stream_1.EventEmitter {
        constructor(options, ip) {
            super();
            this.options = options;
            this.ip = ip;
            this.releaseKey = '';
            this.notificationId = constants_1.NOTIFICATION_ID_PLACEHOLDER;
            this.options = options;
        }
        getNamespaceName() {
            return this.options.namespaceName;
        }
        getNotificationId() {
            return this.notificationId;
        }
        setNotificationId(newNotificationId) {
            this.notificationId = newNotificationId;
        }
        getConfigOptions() {
            return this.options;
        }
        getAppId() {
            return this.options.appId;
        }
        getSecret() {
            return this.options.secret;
        }
        getReleaseKey() {
            return this.releaseKey;
        }
        setReleaseKey(releaseKey) {
            this.releaseKey = releaseKey;
        }
        getIp() {
            return this.ip;
        }
        async loadAndUpdateConfig() {
            const url = request_1.Request.formatConfigUrl({
                ...this.getConfigOptions(),
                releaseKey: this.getReleaseKey(),
                ip: this.getIp(),
            });
            let headers;
            const secret = this.getSecret();
            if (secret) {
                headers = access_1.Access.createAccessHeader(this.getAppId(), url, secret);
            }
            return this._loadAndUpdateConfig(url, headers);
        }
    }
    exports.Config = Config;
});
//# sourceMappingURL=config.js.map