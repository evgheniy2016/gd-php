"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Parser = /** @class */ (function () {
    function Parser(database) {
        this.database = database;
        this.onPriceChanged = [];
    }
    Parser.prototype.start = function () {
        var _this = this;
        console.log('started parser');
        setInterval(function () {
            _this.onPriceChanged.forEach(function (callback) { return callback.listener.call(callback.root, 'pair:usd-btc', 0.157); });
            _this.onPriceChanged.forEach(function (callback) { return callback.listener.call(callback.root, 'pair:usd-eth', 0.157); });
        }, 1000);
    };
    return Parser;
}());
exports.Parser = Parser;
