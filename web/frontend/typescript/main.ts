import Routing from './routing'
import { WebSocketClient } from './ws'

const currentPage = window['currentPage'];
const rules = Routing[currentPage];
const websocketClient = new WebSocketClient();
if (typeof rules !== "undefined") {
  rules.forEach(rule => rule.action.call(window));
}
