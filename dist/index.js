var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./lib/access", "./lib/config_change_event", "./lib/config_change", "./lib/config_manager", "./lib/config_service", "./lib/config", "./lib/configInterface", "./lib/constants", "./lib/json_config", "./lib/plain_config", "./lib/properties_config", "./lib/request", "./lib/types"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require("./lib/access"), exports);
    __exportStar(require("./lib/config_change_event"), exports);
    __exportStar(require("./lib/config_change"), exports);
    __exportStar(require("./lib/config_manager"), exports);
    __exportStar(require("./lib/config_service"), exports);
    __exportStar(require("./lib/config"), exports);
    __exportStar(require("./lib/configInterface"), exports);
    __exportStar(require("./lib/constants"), exports);
    __exportStar(require("./lib/json_config"), exports);
    __exportStar(require("./lib/plain_config"), exports);
    __exportStar(require("./lib/properties_config"), exports);
    __exportStar(require("./lib/request"), exports);
    __exportStar(require("./lib/types"), exports);
});
//# sourceMappingURL=index.js.map