import Routing from './routing'
import { WebSocketClient } from './ws'

const currentPage = window['currentPage'];
const rules = Routing[currentPage];
const websocketClient = new WebSocketClient();
if (typeof rules !== "undefined") {
  rules.forEach(rule => rule.action.call(window));
}

const balanceLabel = document.querySelector('#wallet-amount');
if (balanceLabel !== null) {
  balanceLabel.innerHTML = Number(balanceLabel.innerHTML.split(' ')[0]).toFixed(2) + ' $';

  websocketClient.on('balance-updated', balance => {
    balanceLabel.innerHTML = Number(balance).toFixed(2) + ' $';
  });

  websocketClient.on('bet-win', data => {
    balanceLabel.innerHTML = Number(data.balance).toFixed(2) + ' $';
  });

}
