const WebSocket = require('ws');
const redis = require("redis");
const redisClient = redis.createClient();

let wsUrl = 'wss://stream9.forexpros.com/echo/54/gkj43ggp/websocket';
const ws = new WebSocket(wsUrl);
const listLimit = 70;

ws.onopen = function () {
    console.log('connected');

    setInterval(function () {
        if (ws.connected) {
            ws.send('["{\\"_event\\":\\"heartbeat\\",\\"data\\":\\"h\\"}"]')
        }
    }, 1000);

    setTimeout(function () {
        ws.close();
    }, 3000);
};

ws.onmessage = function (message) {
    let data = message.data;
    if (data === 'o') {
        ws.send('["{\\"_event\\":\\"subscribe\\",\\"tzID\\":55,\\"message\\":\\"pid-2:\\"}"]');
        ws.send('["{\\"_event\\":\\"subscribe\\",\\"tzID\\":55,\\"message\\":\\"pid-1:\\"}"]');
    } else {
        // removing first symbol(in messages with data - 'a')
        let messageWrapper = data.substr(1);
        // removing first and last bracket([ and ])
        messageWrapper = messageWrapper.substr(1).substr(0, messageWrapper.length - 2);
        messageWrapper = JSON.parse(messageWrapper);

        if (typeof messageWrapper === "string") {
            messageWrapper = JSON.parse(messageWrapper);
            if (typeof messageWrapper.message !== "undefined") {
                messageWrapper = messageWrapper.message;
                try {
                    messageWrapper = messageWrapper.split('::');
                } catch (e) {
                    console.error(e);
                }

                const messageType = messageWrapper[0];
                let   messageBody = messageWrapper[1];

                const messageBodyParsed = JSON.parse(messageBody);

                redisClient.lpush('pid-' + messageBodyParsed.pid, messageBody);
                // отнимаем единицу т.к. отсчёт идёт с нуля
                redisClient.ltrim('pid-' + messageBodyParsed.pid, 0, listLimit - 1);
            } else {
                /// todo: empty
            }
        }
    }
};

ws.onerror = function (error) {
    console.error(error);
};

ws.onclose = function () {
    console.log('disconnected');
};

redisClient.on('error', function (error) {
    console.error('Redis error: ', error);
});
