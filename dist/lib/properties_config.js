var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "debug", "./config", "./config_change", "./config_change_event", "./constants", "./request"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PropertiesConfig = void 0;
    const debug_1 = __importDefault(require("debug"));
    const config_1 = require("./config");
    const config_change_1 = require("./config_change");
    const config_change_event_1 = require("./config_change_event");
    const constants_1 = require("./constants");
    const request_1 = require("./request");
    const logger = (0, debug_1.default)('apollo-node-client:properties_config');
    class PropertiesConfig extends config_1.Config {
        constructor(options, ip) {
            logger('constructor');
            super(options, ip);
            this.configs = new Map();
        }
        getProperty(key, defaultValue) {
            const value = this.configs.get(key);
            if (value !== undefined) {
                return value;
            }
            return defaultValue;
        }
        getAllConfig() {
            return this.configs;
        }
        setProperty(key, value) {
            this.configs.set(key, value);
        }
        deleteProperty(key) {
            return this.configs.delete(key);
        }
        addChangeListener(fn) {
            logger('addChangeListener');
            this.addListener(constants_1.CHANGE_EVENT_NAME, fn);
            return this;
        }
        addConnectListener(fn) {
            logger('addConnectListener');
            this.addListener(constants_1.CONNECT_EVENT_NAME, fn);
            return this;
        }
        async _loadAndUpdateConfig(url, headers) {
            logger('_loadAndUpdateConfig');
            const loadConfigResp = await request_1.Request.fetchConfig(url, headers);
            if (loadConfigResp) {
                logger('loadConfigResp', loadConfigResp);
                // diff change
                const { added, deleted, changed } = this.diffMap(this.configs, loadConfigResp.configurations);
                // update change and emit changeEvent
                const configChangeEvent = this.updateConfigAndCreateChangeEvent(added, deleted, changed, loadConfigResp.configurations);
                if (configChangeEvent) {
                    logger('configChangeEvent', configChangeEvent);
                    this.emit(constants_1.CHANGE_EVENT_NAME, configChangeEvent);
                }
                // update releaseKey
                this.setReleaseKey(loadConfigResp.releaseKey);
            }
        }
        diffMap(oldConfigs, newConfigs) {
            const added = [];
            const deleted = [];
            const changed = [];
            for (const key in newConfigs) {
                if (oldConfigs.has(key)) {
                    if (oldConfigs.get(key) !== newConfigs[key]) {
                        changed.push(key);
                    }
                }
                else {
                    added.push(key);
                }
            }
            for (const key of oldConfigs.keys()) {
                if (!Object.prototype.hasOwnProperty.call(newConfigs, key)) {
                    deleted.push(key);
                }
            }
            return {
                added,
                deleted,
                changed,
            };
        }
        updateConfigAndCreateChangeEvent(added, deleted, changed, newConfigs) {
            const configChanges = new Map();
            for (const addedKey of added) {
                const newConfigValue = newConfigs[addedKey];
                configChanges.set(addedKey, new config_change_1.ConfigChange(this.getNamespaceName(), addedKey, undefined, newConfigValue, constants_1.PropertyChangeType.ADDED));
                this.setProperty(addedKey, newConfigValue);
            }
            for (const deletedKey of deleted) {
                configChanges.set(deletedKey, new config_change_1.ConfigChange(this.getNamespaceName(), deletedKey, this.configs.get(deletedKey), undefined, constants_1.PropertyChangeType.DELETED));
                this.deleteProperty(deletedKey);
            }
            for (const changedKey of changed) {
                const newConfigsValue = newConfigs[changedKey];
                configChanges.set(changedKey, new config_change_1.ConfigChange(this.getNamespaceName(), changedKey, this.configs.get(changedKey), newConfigs[changedKey], constants_1.PropertyChangeType.MODIFIED));
                this.setProperty(changedKey, newConfigsValue);
            }
            let configChangeEvent;
            if (configChanges.size > 0) {
                configChangeEvent = new config_change_event_1.ConfigChangeEvent(this.getNamespaceName(), configChanges);
            }
            return configChangeEvent;
        }
    }
    exports.PropertiesConfig = PropertiesConfig;
});
//# sourceMappingURL=properties_config.js.map