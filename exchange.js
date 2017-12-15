const WebSocket = require('ws');
const redis = require("redis");
var request = require("request")
const redisClient = redis.createClient();

// let wsUrl = 'wss://stream9.forexpros.com/echo/54/gkj43ggp/websocket';
let number = 629;

function openWebSocketConnection() {
    let wsUrl = `wss://stream170.forexpros.com/echo/${number}/53ptm0sl/websocket`;
    number++;

    request({
        url: 'https://stream170.forexpros.com/echo/info',
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body); // Print the json response

            const ws = new WebSocket(wsUrl, {
                perMessageDeflate: true
            });
            const listLimit = 70;

            ws.onopen = function () {
                const _ws = ws;
                setInterval(function () {
                    if (ws.readyState === ws.OPEN) {
                        console.log('sending heartbeat');
                        ws.send('["{\\"_event\\":\\"heartbeat\\",\\"data\\":\\"h\\"}"]')
                    }
                }, 3000);
            };

            ws.onmessage = function (message) {
                console.log('New income data:', message.data);
                let data = message.data;
                if (data === 'o') {
                    console.log('test');
                    ws.send('["{\\"_event\\":\\"subscribe\\",\\"tzID\\":55,\\"message\\":\\"pid-1:\\"}"]');
                    ws.send('["{\\"_event\\":\\"subscribe\\",\\"tzID\\":55,\\"message\\":\\"pid-2:\\"}"]');
                    // ws.send('["{\"_event\":\"subscribe\",\"tzID\":55,\"message\":\"domain-1:\"}"]');
                    // ws.send('["{\"_event\":\"UID\",\"UID\":0}"]');
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

            ws.onclose = function (e) {
                console.log('disconnected');
                openWebSocketConnection();
            };
        }
    })
}

openWebSocketConnection();

redisClient.on('error', function (error) {
    console.error('Redis error: ', error);
});
