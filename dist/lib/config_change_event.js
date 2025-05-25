(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConfigChangeEvent = void 0;
    class ConfigChangeEvent {
        constructor(namespaceName, configChanges) {
            this.namespaceName = namespaceName;
            this.configChanges = configChanges;
            this.namespaceName = namespaceName;
            this.configChanges = configChanges;
        }
        getNamespace() {
            return this.namespaceName;
        }
        changedKeys() {
            return Array.from(this.configChanges.keys());
        }
        getChange(key) {
            return this.configChanges.get(key);
        }
    }
    exports.ConfigChangeEvent = ConfigChangeEvent;
});
//# sourceMappingURL=config_change_event.js.map