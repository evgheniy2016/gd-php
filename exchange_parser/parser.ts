import {Database} from "./database";

export class Parser {
    onPriceChanged: any[] = [];

    public constructor(private database: Database) { /* empty */ }

    public start() {
        console.log('started parser');
        setInterval(() => {
            this.onPriceChanged.forEach(callback => callback.listener.call(callback.root, 'pair:usd-btc', 0.157));
            this.onPriceChanged.forEach(callback => callback.listener.call(callback.root, 'pair:usd-eth', 0.157));
        }, 1000);
    }

}