(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./config", "./config_change", "./config_change_event", "./constants", "./request"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JSONConfig = void 0;
    const config_1 = require("./config");
    const config_change_1 = require("./config_change");
    const config_change_event_1 = require("./config_change_event");
    const constants_1 = require("./constants");
    const request_1 = require("./request");
    class JSONConfig extends config_1.Config {
        constructor(options, ip) {
            super(options, ip);
            this.configs = JSONConfig.EMPTY_CONFIG;
        }
        isInitialized() {
            return this.configs !== JSONConfig.EMPTY_CONFIG;
        }
        getProperty(key, defaultValue) {
            return this.getPropertyByJSONAndKey(this.configs, key, defaultValue);
        }
        getPropertyByJSONAndKey(configs, key, defaultValue) {
            const keySlice = key ? key.split('.') : [];
            const value = this.getPropertyByJSONAndKeySlice(configs, keySlice);
            if (value !== undefined) {
                return value;
            }
            return defaultValue;
        }
        getPropertyByJSONAndKeySlice(JSONValue, keySlice) {
            if (keySlice.length == 0) {
                return JSONValue;
            }
            if (typeof JSONValue === 'string'
                || typeof JSONValue === 'number'
                || typeof JSONValue === 'boolean'
                || JSONValue === null
                || JSONValue === undefined)
                return;
            if (Array.isArray(JSONValue))
                return;
            const key = keySlice.shift();
            if (!key)
                return;
            return this.getPropertyByJSONAndKeySlice(JSONValue[key], keySlice);
        }
        getAllConfig() {
            return this.configs;
        }
        addChangeListener(fn) {
            this.addListener(constants_1.CHANGE_EVENT_NAME, fn);
            return this;
        }
        async _loadAndUpdateConfig(url, headers) {
            const loadConfigResp = await request_1.Request.fetchConfig(url, headers);
            if (loadConfigResp) {
                const content = loadConfigResp.configurations.content;
                if (content) {
                    let newConfigs;
                    try {
                        newConfigs = JSON.parse(content);
                    }
                    catch (error) {
                        newConfigs = content;
                    }
                    const { added, deleted, changed } = this.diffJSON(this.configs, newConfigs);
                    const configChangeEvent = this.updateConfigAndCreateChangeEvent(added, deleted, changed, newConfigs);
                    if (configChangeEvent) {
                        this.emit(constants_1.CHANGE_EVENT_NAME, configChangeEvent);
                    }
                }
                this.setReleaseKey(loadConfigResp.releaseKey);
            }
        }
        diffJSON(oldJSONValue, newJSONValue, prefix = '') {
            const added = [];
            const deleted = [];
            const changed = [];
            if (typeof oldJSONValue === 'string' ||
                typeof newJSONValue === 'string' ||
                typeof oldJSONValue === 'number' ||
                typeof newJSONValue === 'number' ||
                typeof oldJSONValue === 'boolean' ||
                typeof newJSONValue === 'boolean' ||
                oldJSONValue === null ||
                newJSONValue === null) {
                if (oldJSONValue !== newJSONValue) {
                    changed.push(prefix);
                }
                return {
                    added,
                    deleted,
                    changed,
                };
            }
            if (Array.isArray(oldJSONValue) || Array.isArray(newJSONValue)) {
                if (JSON.stringify(oldJSONValue) !== JSON.stringify(newJSONValue)) {
                    changed.push(prefix);
                }
                return {
                    added,
                    deleted,
                    changed,
                };
            }
            for (const key of Object.keys(oldJSONValue)) {
                if (!Object.prototype.hasOwnProperty.call(newJSONValue, key)) {
                    const newKey = prefix ? prefix + '.' + key : key;
                    deleted.push(newKey);
                }
            }
            for (const key of Object.keys(newJSONValue)) {
                const newKey = prefix ? prefix + '.' + key : key;
                if (!Object.prototype.hasOwnProperty.call(oldJSONValue, key)) {
                    added.push(newKey);
                }
                else {
                    // merge returned value
                    const { added: _added, deleted: _deleted, changed: _changed } = this.diffJSON(oldJSONValue[key], newJSONValue[key], newKey);
                    added.push(..._added);
                    deleted.push(..._deleted);
                    changed.push(..._changed);
                }
            }
            return {
                added,
                deleted,
                changed,
            };
        }
        updateConfigAndCreateChangeEvent(added, deleted, changed, newConfigs) {
            let configChangeEvent;
            const configChanges = new Map();
            for (const key of added) {
                const configChange = new config_change_1.ConfigChange(this.getNamespaceName(), key, undefined, this.getPropertyByJSONAndKey(newConfigs, key), constants_1.PropertyChangeType.ADDED);
                configChanges.set(key, configChange);
            }
            for (const key of deleted) {
                const configChange = new config_change_1.ConfigChange(this.getNamespaceName(), key, this.getProperty(key), undefined, constants_1.PropertyChangeType.DELETED);
                configChanges.set(key, configChange);
            }
            for (const key of changed) {
                const configChange = new config_change_1.ConfigChange(this.getNamespaceName(), key, this.getProperty(key), this.getPropertyByJSONAndKey(newConfigs, key), constants_1.PropertyChangeType.MODIFIED);
                configChanges.set(key, configChange);
            }
            if (configChanges.size > 0) {
                configChangeEvent = new config_change_event_1.ConfigChangeEvent(this.getNamespaceName(), configChanges);
            }
            this.configs = newConfigs;
            return configChangeEvent;
        }
    }
    exports.JSONConfig = JSONConfig;
    JSONConfig.EMPTY_CONFIG = Object.create(null);
});
//# sourceMappingURL=json_config.js.map