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
    exports.ConfigChange = void 0;
    class ConfigChange {
        constructor(namespaceName, propertyName, oldValue, newValue, changeType) {
            this.namespaceName = namespaceName;
            this.propertyName = propertyName;
            this.oldValue = oldValue;
            this.newValue = newValue;
            this.changeType = changeType;
            this.namespaceName = namespaceName;
            this.propertyName = propertyName;
            this.oldValue = oldValue;
            this.newValue = newValue;
            this.changeType = changeType;
        }
        getNamespace() {
            return this.namespaceName;
        }
        getPropertyName() {
            return this.propertyName;
        }
        getOldValue() {
            return this.oldValue;
        }
        getNewValue() {
            return this.newValue;
        }
        getChangeType() {
            return this.changeType;
        }
    }
    exports.ConfigChange = ConfigChange;
});
//# sourceMappingURL=config_change.js.map