var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "debug", "./properties_config", "./constants", "./json_config", "./access", "./request", "./plain_config"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConfigManager = void 0;
    const debug_1 = __importDefault(require("debug"));
    const properties_config_1 = require("./properties_config");
    const constants_1 = require("./constants");
    const json_config_1 = require("./json_config");
    const access_1 = require("./access");
    const request_1 = require("./request");
    const plain_config_1 = require("./plain_config");
    const logger = (0, debug_1.default)('apollo-node-client:config_manager');
    class ConfigManager {
        constructor(options) {
            this.options = options;
            this.LONG_POLL_RETRY_TIME = 1000;
            this.MAX_LONG_POLL_RETRY_TIME = 32000; // 2 factor
            this.MIN_LONG_POLL_RETRY_TIME = 1000;
            this.configsMap = new Map();
            this.configsMapVersion = 0;
            this.options = options;
        }
        getTypeByNamespaceName(namespaceName) {
            logger('getTypeByNamespaceName namespaceName:', namespaceName);
            for (const key in constants_1.ConfigTypes) {
                if (namespaceName.endsWith(`.${constants_1.ConfigTypes[key]}`)) {
                    return {
                        namespaceName: constants_1.ConfigTypes[key] === constants_1.ConfigTypes.PROPERTIES ?
                            namespaceName.substring(0, namespaceName.length - constants_1.ConfigTypes[key].length - 1) : namespaceName,
                        type: constants_1.ConfigTypes[key]
                    };
                }
            }
            // default type is properties
            return { namespaceName, type: constants_1.ConfigTypes.PROPERTIES };
        }
        async getConfig(namespaceName, ip) {
            const type = this.getTypeByNamespaceName(namespaceName);
            if (!type.namespaceName)
                throw new Error('namespaceName can not be empty!');
            const mpKey = this.formatConfigsMapKey(type.namespaceName);
            logger('getConfig: mpKey', mpKey);
            let config = this.configsMap.get(mpKey);
            if (!config) {
                logger('getConfig: create config', type);
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
                    logger(`getConfig:this.updateConfigs`, singleMap);
                    await this.updateConfigs(singleMap);
                    logger('getConfig: load notifications success');
                }
                catch (error) {
                    console.log('[apollo-node-client] %s - getConfig: load notifications failed. - %s', new Date(), error.message);
                    // throw error;
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
            logger('startLongPoll');
            if (configsMapVersion !== this.configsMapVersion) {
                return;
            }
            try {
                logger('startLongPoll: update configs', this.configsMap);
                await this.updateConfigs(this.configsMap);
                this.LONG_POLL_RETRY_TIME = this.MIN_LONG_POLL_RETRY_TIME;
                logger('startLongPoll: update configs success');
            }
            catch (error) {
                console.log('[apollo-node-client] %s - update configs failed, will retry in %s seconds. - %s', new Date(), this.LONG_POLL_RETRY_TIME / 1000, error.message);
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