import * as mysql from 'mysql'

export class MySQLDatabase {

  private static instance: MySQLDatabase = null;

  private connection: any = null;

  private onConnected: any = [];

  private isConnected: boolean = false;

  private constructor() {
    this.connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "binarytrade_dev"
    });

    this.connection.connect(err => {
      if (err) throw err;

      console.log('connected to database');

      this.isConnected = true;
      this.onConnected.forEach(callbacks => callbacks.call(null));
    });
  }

  public static getInstance() {
    if (MySQLDatabase.instance === null) {
      MySQLDatabase.instance = new MySQLDatabase();
    }

    return MySQLDatabase.instance;
  }

  public registerListener(callback) {
    this.onConnected.push(callback);

    if (this.isConnected) {
      callback.call(null);
    }
  }

  public getConnection() {
    return this.connection;
  }

}