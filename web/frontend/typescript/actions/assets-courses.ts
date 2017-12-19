import { WebSocketClient } from '../ws'

export function assetsCourses () {
  const instance = WebSocketClient.getInstance();
  instance.emit('subscribe', 'pair:usdbtc');
  instance.on('asset-updated', (data) => {
    console.log(data);
  });
}