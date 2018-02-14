export class WebSocketClient {

  private ioClient: any = null;

  private host: string = '127.0.0.1';

  private port: number = 5001;

  private static instance: WebSocketClient = null;

  public constructor() {
    WebSocketClient.instance = this;
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
    console.log(event, data);
    this.ioClient.emit(event, data);
  }

}
