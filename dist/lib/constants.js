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
    exports.PropertyChangeType = exports.ConfigTypes = exports.CHANGE_EVENT_NAME = exports.NOTIFICATION_ID_PLACEHOLDER = exports.NO_APPID_PLACEHOLDER = exports.CONFIG_FILE_CONTENT_KEY = exports.APOLLO_META_KEY = exports.APOLLO_CLUSTER_KEY = exports.CLUSTER_NAMESPACE_SEPARATOR = exports.CLUSTER_NAME_DEFAULT = exports.NAMESPACE_APPLICATION = void 0;
    exports.NAMESPACE_APPLICATION = 'application';
    exports.CLUSTER_NAME_DEFAULT = 'default';
    exports.CLUSTER_NAMESPACE_SEPARATOR = '+';
    exports.APOLLO_CLUSTER_KEY = 'apollo.cluster';
    exports.APOLLO_META_KEY = 'apollo.meta';
    exports.CONFIG_FILE_CONTENT_KEY = 'content';
    exports.NO_APPID_PLACEHOLDER = 'ApolloNoAppIdPlaceHolder';
    exports.NOTIFICATION_ID_PLACEHOLDER = -1;
    exports.CHANGE_EVENT_NAME = 'change';
    var ConfigTypes;
    (function (ConfigTypes) {
        ConfigTypes["PROPERTIES"] = "properties";
        ConfigTypes["XML"] = "xml";
        ConfigTypes["JSON"] = "json";
        ConfigTypes["YML"] = "yml";
        ConfigTypes["YAML"] = "yaml";
        ConfigTypes["TXT"] = "txt";
    })(ConfigTypes || (exports.ConfigTypes = ConfigTypes = {}));
    var PropertyChangeType;
    (function (PropertyChangeType) {
        PropertyChangeType["ADDED"] = "ADDED";
        PropertyChangeType["MODIFIED"] = "MODIFIED";
        PropertyChangeType["DELETED"] = "DELETED";
    })(PropertyChangeType || (exports.PropertyChangeType = PropertyChangeType = {}));
});
//# sourceMappingURL=constants.js.map