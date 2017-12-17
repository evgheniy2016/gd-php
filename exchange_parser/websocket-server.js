"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var io = require("socket.io");
var WebSocketServer = /** @class */ (function () {
    function WebSocketServer() {
        this.websocketClients = {};
    }
    WebSocketServer.prototype.start = function () {
        var _this = this;
        var ioServer = io(5001);
        console.log('starting ws server');
        ioServer.on('connection', function (socket) {
            console.log('User just connected');
            _this.websocketClients[socket.id] = {
                socket: socket,
                assets: []
            };
            socket.on('disconnect', function () {
                console.log('Got disconnect!');
                delete _this.websocketClients[socket.id];
            });
            socket.emit('message', 123);
            socket.emit('foo', 444);
            socket.on('subscribe', function (asset) {
                if (_this.websocketClients[socket.id].assets.indexOf(asset) === -1) {
                    _this.websocketClients[socket.id].assets.push(asset);
                }
            });
        });
    };
    WebSocketServer.prototype.onPriceChangedListener = function (active, price) {
        // console.log(this.websocketClients);
        for (var clientId in this.websocketClients) {
            var client = this.websocketClients[clientId];
            if (client.assets.indexOf(active) !== -1) {
                client.socket.emit('asset-updated', { active: active, price: price });
            }
        }
    };
    return WebSocketServer;
}());
exports.WebSocketServer = WebSocketServer;
