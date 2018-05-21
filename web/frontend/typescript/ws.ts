export class WebSocketClient {

  private ioClient: any = null;

  private host: string = null;

  private port: number = 5001;

  private static instance: WebSocketClient = null;

  public constructor() {
    if (typeof window['websocketServer'] === "undefined") {
      throw "WebSocket configuration are not found";
    }

    this.host = window['websocketServer']['host'];
    this.port = window['websocketServer']['port'];

    WebSocketClient.instance = this;
    (window as any)['ws'] = this;
    this.socketIoLoaded();
  }

  private socketIoLoaded() {
    this.ioClient = (window as any).io(`http://${this.host}:${this.port}`);
    this.ioClient.emit('register', (window as any).apiKey);
  }

  public static getInstance(): WebSocketClient {
    return WebSocketClient.instance;
  }

  public on(event: string, callback: any) {
    this.ioClient.on(event, callback);
  }

  public emit(event: string, data: any) {
    this.ioClient.emit(event, data);
  }

  public removeAllListeners(eventName: string) {
    this.ioClient.removeAllListeners(eventName);
  }

  public removeListener(eventName: string) {
    this.ioClient.removeListener(eventName);
  }

}
