import {Database} from "./database";
import * as redis from 'redis'
import * as request from 'request'
import * as WebSocket from 'ws'

export class Parser {
    public onPriceChanged: any[] = [];

    private number: number = 600;

    private wsUrl = `wss://stream170.forexpros.com/echo/${this.number}/53ptm0sl/websocket`;

    private redisClient: any = null;

    private lastValues: any = {};

    public constructor(private database: Database) {
        this.redisClient = redis.createClient();
    }

    public start() {
        console.log('started parser');

        this.createParserConnection();

        setInterval(() => {
            const timestamp = (+ new Date());

            for (let pid in this.lastValues) {
                let value = this.lastValues[pid];
                this.onPriceChanged
                  .forEach(callback => callback.listener.call(callback.root, pid, value, timestamp));
            }
        }, 1000);
    }

    private createParserConnection() {
        request({
            url: 'https://stream170.forexpros.com/echo/info',
            json: true
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const ws = new WebSocket(this.wsUrl, {
                    perMessageDeflate: true
                });
                const listLimit = 70;

                ws.onopen = () => {
                    console.log('Connected');
                    setInterval(function () {
                        if (ws.readyState === ws.OPEN) {
                            ws.send('["{\\"_event\\":\\"heartbeat\\",\\"data\\":\\"h\\"}"]')
                        }
                    }, 3000);
                };

                ws.onmessage = (message) => {
                    let data = message.data;
                    if (data === 'o') {
                        for (let i = 1; i < 11; i++) {
                            ws.send('["{\\"_event\\":\\"subscribe\\",\\"tzID\\":55,\\"message\\":\\"pid-' + i + ':\\"}"]');
                        }
                        ws.send('["{\\"_event\\":\\"subscribe\\",\\"tzID\\":55,\\"message\\":\\"pid-41:\\"}"]');
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

                                let messageBody = messageWrapper[1];

                                const messageBodyParsed = JSON.parse(messageBody);
                                const timestamp = (+ new Date());
                                const pid = messageBodyParsed.pid;
                                const price = messageBodyParsed.last_numeric;

                                this.lastValues['pid-' + pid] = price;

                                this.redisClient.set('pid-' + pid, price);
                                this.onPriceChanged
                                  .forEach(callback => callback.listener.call(callback.root, 'pid-' + pid, price, timestamp));
                            } else {
                                /// todo: empty
                            }
                        }
                    }
                };

                ws.onerror = function (error) {
                    console.error(error);
                };

                ws.onclose = (e) => {
                    console.log('Disconnected. Reconnecting...');
                    this.createParserConnection();
                };

            }
        });
    }

}
