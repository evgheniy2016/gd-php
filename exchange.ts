import * as WebSocket from 'ws'
import * as redis from 'redis'
import * as request from 'request'
import { Parser } from './exchange_parser/parser'
import { RedisDatabase } from "./exchange_parser/redis-database";
import { WebSocketServer } from "./exchange_parser/websocket-server"
import { Database } from "./exchange_parser/database";

const isProd: boolean = false;
const database: Database = new RedisDatabase();
const parser: Parser = new Parser(database);
const websocketServer: WebSocketServer = new WebSocketServer();

parser.onPriceChanged.push({ listener: websocketServer.onPriceChangedListener, root: websocketServer });

setTimeout(() => websocketServer.start(), 1);
setTimeout(() => parser.start(), 1);
