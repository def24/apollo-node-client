(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./config", "./config_change_event", "./request", "./constants", "./config_change"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlainConfig = void 0;
    const config_1 = require("./config");
    const config_change_event_1 = require("./config_change_event");
    const request_1 = require("./request");
    const constants_1 = require("./constants");
    const config_change_1 = require("./config_change");
    class PlainConfig extends config_1.Config {
        constructor(options, ip) {
            super(options, ip);
        }
        getAllConfig() {
            return this.configs;
        }
        getProperty(_, defaultValue) {
            if (this.configs !== undefined) {
                return this.configs;
            }
            return defaultValue;
        }
        async _loadAndUpdateConfig(url, headers) {
            const loadConfigResp = await request_1.Request.fetchConfig(url, headers);
            if (loadConfigResp) {
                const configChangeEvent = this.updateConfigAndCreateChangeEvent(this.configs, loadConfigResp.configurations.content);
                if (configChangeEvent) {
                    this.emit(constants_1.CHANGE_EVENT_NAME, configChangeEvent);
                }
                this.setReleaseKey(loadConfigResp.releaseKey);
            }
        }
        addChangeListener(fn) {
            this.addListener(constants_1.CHANGE_EVENT_NAME, fn);
            return this;
        }
        updateConfigAndCreateChangeEvent(oldText, newText) {
            let changeType;
            if (oldText === undefined) {
                changeType = constants_1.PropertyChangeType.ADDED;
            }
            else if (newText === undefined) {
                changeType = constants_1.PropertyChangeType.DELETED;
            }
            else {
                changeType = constants_1.PropertyChangeType.MODIFIED;
            }
            const configChanges = new Map();
            const configChange = new config_change_1.ConfigChange(this.getNamespaceName(), '', oldText, newText, changeType);
            configChanges.set('', configChange);
            this.configs = newText;
            return new config_change_event_1.ConfigChangeEvent(this.getNamespaceName(), configChanges);
        }
    }
    exports.PlainConfig = PlainConfig;
});
//# sourceMappingURL=plain_config.js.map