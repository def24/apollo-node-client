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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "crypto", "url"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Access = void 0;
    const crypto = __importStar(require("crypto"));
    const url_1 = require("url");
    class Access {
        static createAccessHeader(appId, url, secret) {
            return this.createAccessHeaderByTimestamp(new Date().getTime(), appId, url, secret);
        }
        static createAccessHeaderByTimestamp(timestamp, appId, url, secret) {
            const accessHeader = {
                Authorization: '',
                Timestamp: timestamp.toString(),
            };
            const sign = this.signature(accessHeader.Timestamp, this.url2PathWithQuery(url), secret);
            accessHeader.Authorization = `Apollo ${appId}:${sign}`;
            return accessHeader;
        }
        static signature(timestamp, pathWithQuery, secret) {
            const hash = crypto.createHmac('sha1', secret);
            hash.update(timestamp + this.DELIMITER + pathWithQuery);
            return hash.digest('base64');
        }
        static url2PathWithQuery(urlString) {
            const url = new url_1.URL(urlString);
            return url.pathname + url.search;
        }
    }
    exports.Access = Access;
    Access.DELIMITER = '\n';
});
//# sourceMappingURL=access.js.map