"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RedisDatabase = /** @class */ (function () {
    function RedisDatabase() {
        this.storage = {};
    }
    RedisDatabase.prototype.put = function (key, value) {
        this.storage[key] = value;
    };
    RedisDatabase.prototype.get = function (key) {
        return this.storage[key];
    };
    return RedisDatabase;
}());
exports.RedisDatabase = RedisDatabase;
