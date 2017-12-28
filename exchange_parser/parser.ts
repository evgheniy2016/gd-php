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

    private getAssetsUrl: string = 'http://localhost:8000/api/assets/list';

    private assets: number[] = [];

    private wsConnection: any = null;

    public constructor(private database: Database) {
        this.redisClient = redis.createClient();
    }

    public start() {
        console.log('started parser');

        request.get(this.getAssetsUrl, (error, response, body) => this.processAssetsList(body));

        setInterval(() => this.updateAssets(), 5000);
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
                this.wsConnection = ws;

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
                        for (let asset of this.assets) {
                            ws.send(`["{\\"_event\\":\\"subscribe\\",\\"tzID\\":55,\\"message\\":\\"pid-${asset}:\\"}"]`);
                        }
                    } else {
                        // removing first symbol(in messages with data - 'a')
                        let messageWrapper = data.substr(1);
                        // removing first and last bracket([ and ])
                        messageWrapper = messageWrapper.substr(1).substr(0, messageWrapper.length - 2);
                        try {
                            messageWrapper = JSON.parse(messageWrapper);
                        } catch (e) {
                            console.error(`Can't parse message: ${messageWrapper}`);
                            console.error(e);
                            this.wsConnection.close();

                            return;
                        }

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
                                const pid = messageBodyParsed.pid;
                                const price = messageBodyParsed.last_numeric;
                                const timestamp = typeof messageBody.timestamp !== "undefined" ?  messageBody.timestamp : (+new Date);

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

    public currentAssetPrice(asset: string) {
        return this.lastValues[asset];
    }

    private processAssetsList(body: any) {
        const assetsResponse = JSON.parse(body);
        if (typeof assetsResponse.response === "undefined") {
            throw "Response is undefined";
        }

        const assets = assetsResponse.assets;
        assets.forEach(asset => this.assets.push(asset));

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

    private updateAssets() {
        request.get(this.getAssetsUrl, (error, response, body) => {
            let assetsResponse = null;
            try {
                assetsResponse = JSON.parse(body);
            } catch (e) {
                console.log("Can't parse page content: " + body);
                return;
            }

            if (typeof assetsResponse.response === "undefined") {
                throw "Response is undefined";
            }

            const assets = assetsResponse.assets;
            assets.forEach(asset => {
                if (this.assets.indexOf(asset) === -1) {
                    this.assets.push(asset);

                    if (this.wsConnection !== null) {
                        this.wsConnection.send(`["{\\"_event\\":\\"subscribe\\",\\"tzID\\":55,\\"message\\":\\"pid-${asset}:\\"}"]`);
                    }
                }
            });
        });
    }

}
