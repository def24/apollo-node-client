(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./constants", "./config_manager"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConfigService = void 0;
    const constants_1 = require("./constants");
    const config_manager_1 = require("./config_manager");
    class ConfigService {
        constructor(options) {
            this.options = options;
            this.options = options;
            this.options.clusterName = this.options.clusterName ? this.options.clusterName : constants_1.CLUSTER_NAME_DEFAULT;
            this.configManager = new config_manager_1.ConfigManager({
                ...this.options,
                clusterName: this.options.clusterName,
            });
        }
        /**
         * getAppConfig, default namespace name: `application`
         */
        async getAppConfig(ip) {
            const config = await this.getConfig(constants_1.NAMESPACE_APPLICATION, ip);
            return config;
        }
        /**
         * get Config by namespaceName
         */
        getConfig(namespaceName, ip) {
            return this.configManager.getConfig(namespaceName, ip);
        }
    }
    exports.ConfigService = ConfigService;
});
//# sourceMappingURL=config_service.js.map