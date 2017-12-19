import * as io from 'socket.io'

export class WebSocketServer {

    private websocketClients: any = {};

    public constructor() {

    }

    public start() {
        const ioServer = io(5001);
        console.log('starting ws server');
        ioServer.on('connection', (socket) => {
            console.log('User just connected');
            this.websocketClients[socket.id] = {
                socket: socket,
                assets: []
            };

            socket.on('disconnect', () => {
                console.log('Got disconnect!');
                delete this.websocketClients[socket.id];
            });

            socket.emit('message', 123);
            socket.emit('foo', 444);

            socket.on('subscribe', (asset) => {
                if (this.websocketClients[socket.id].assets.indexOf(asset) === -1) {
                    this.websocketClients[socket.id].assets.push(asset);
                }
            });

            socket.on('replace-subscription', (asset) => {
                this.websocketClients[socket.id].assets = [asset];
            });
        });
    }

    public onPriceChangedListener(active: string, price: number, timestamp) {
        // console.log(this.websocketClients);
        for (let clientId in this.websocketClients) {
            const client = this.websocketClients[clientId];

            if (client.assets.indexOf('any') !== -1) {
                client.socket.emit('asset-updated', { active, price, timestamp });
            } else {
                if (client.assets.indexOf(active) !== -1) {
                    client.socket.emit('asset-updated', { active, price, timestamp });
                }
            }
        }
    }

}