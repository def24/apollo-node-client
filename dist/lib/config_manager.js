(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./properties_config", "./constants", "./json_config", "./access", "./request", "./plain_config"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConfigManager = void 0;
    const properties_config_1 = require("./properties_config");
    const constants_1 = require("./constants");
    const json_config_1 = require("./json_config");
    const access_1 = require("./access");
    const request_1 = require("./request");
    const plain_config_1 = require("./plain_config");
    class ConfigManager {
        constructor(options) {
            this.options = options;
            this.LONG_POLL_RETRY_TIME = 1000;
            this.MAX_LONG_POLL_RETRY_TIME = 16000;
            this.MIN_LONG_POLL_RETRY_TIME = 1000;
            this.configsMap = new Map();
            this.configsMapVersion = 0;
            this.options = options;
        }
        getTypeByNamespaceName(namespaceName) {
            for (const key in constants_1.ConfigTypes) {
                if (namespaceName.endsWith(`.${constants_1.ConfigTypes[key]}`)) {
                    return {
                        namespaceName: constants_1.ConfigTypes[key] === constants_1.ConfigTypes.PROPERTIES ?
                            namespaceName.substring(0, namespaceName.length - constants_1.ConfigTypes[key].length - 1) : namespaceName,
                        type: constants_1.ConfigTypes[key]
                    };
                }
            }
            return { namespaceName, type: constants_1.ConfigTypes.PROPERTIES };
        }
        async getConfig(namespaceName, ip) {
            const type = this.getTypeByNamespaceName(namespaceName);
            if (!type.namespaceName) {
                throw new Error('namespaceName can not be empty!');
            }
            const mpKey = this.formatConfigsMapKey(type.namespaceName);
            let config = this.configsMap.get(mpKey);
            if (!config) {
                if (type.type == constants_1.ConfigTypes.PROPERTIES) {
                    config = new properties_config_1.PropertiesConfig({
                        ...this.options,
                        namespaceName: type.namespaceName,
                    }, ip);
                }
                else if (type.type == constants_1.ConfigTypes.JSON) {
                    config = new json_config_1.JSONConfig({
                        ...this.options,
                        namespaceName: type.namespaceName,
                    }, ip);
                }
                else {
                    config = new plain_config_1.PlainConfig({
                        ...this.options,
                        namespaceName: type.namespaceName,
                    }, ip);
                }
                this.configsMapVersion = this.configsMapVersion % Number.MAX_SAFE_INTEGER + 1;
                const configsMapVersion = this.configsMapVersion;
                const key = this.formatConfigsMapKey(config.getNamespaceName());
                this.configsMap.set(key, config);
                const singleMap = new Map();
                singleMap.set(key, config);
                try {
                    await this.updateConfigs(singleMap);
                }
                catch (error) {
                    console.log('[apollo-node-client] %s - load notifications failed. - %s', new Date(), error);
                }
                setImmediate(async () => {
                    await this.startLongPoll(configsMapVersion);
                });
            }
            return config;
        }
        removeConfig(namespaceName) {
            const type = this.getTypeByNamespaceName(namespaceName);
            const mpKey = this.formatConfigsMapKey(type.namespaceName);
            this.configsMap.delete(mpKey);
        }
        async updateConfigs(configsMap) {
            const url = request_1.Request.formatNotificationsUrl({
                ...this.options,
            }, configsMap);
            let headers;
            if (this.options.secret) {
                headers = access_1.Access.createAccessHeader(this.options.appId, url, this.options.secret);
            }
            const notification = await request_1.Request.fetchNotifications(url, headers);
            if (notification) {
                for (const item of notification) {
                    const key = this.formatConfigsMapKey(item.namespaceName);
                    const config = this.configsMap.get(key);
                    if (config) {
                        await config.loadAndUpdateConfig();
                        config.setNotificationId(item.notificationId);
                    }
                }
            }
            // ignore no update
        }
        async startLongPoll(configsMapVersion) {
            if (configsMapVersion !== this.configsMapVersion) {
                return;
            }
            try {
                await this.updateConfigs(this.configsMap);
                this.LONG_POLL_RETRY_TIME = this.MIN_LONG_POLL_RETRY_TIME;
            }
            catch (error) {
                console.log('[apollo-node-client] %s - update configs failed, will retry in %s seconds. - %s', new Date(), this.LONG_POLL_RETRY_TIME / 1000, error);
                await this.sleep(this.LONG_POLL_RETRY_TIME);
                if (this.LONG_POLL_RETRY_TIME < this.MAX_LONG_POLL_RETRY_TIME) {
                    this.LONG_POLL_RETRY_TIME *= 2;
                }
            }
            if (this.configsMap.size > 0) {
                setImmediate(() => {
                    this.startLongPoll(configsMapVersion);
                });
            }
        }
        formatConfigsMapKey(namespaceName) {
            return this.options.clusterName + constants_1.CLUSTER_NAMESPACE_SEPARATOR + namespaceName;
        }
        sleep(time = 2000) {
            return new Promise(resolve => setTimeout(resolve, time));
        }
    }
    exports.ConfigManager = ConfigManager;
});
//# sourceMappingURL=config_manager.js.map