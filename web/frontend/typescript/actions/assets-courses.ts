import { WebSocketClient } from '../ws'

export function assetsCourses () {
  const instance = WebSocketClient.getInstance();

  instance.on('current-prices', prices => {
    for (let pid in prices) {
      const value = prices[pid];
      const elements = document.querySelectorAll('[data-pid="' + pid + '"]');
      for (let j = 0; j < elements.length; j++) {
        /// todo: стрелка вверх/вниз: только с предыдущем значением
        elements[j].innerHTML = value;
      }
    }

    const exchangeRates: HTMLDivElement = document.querySelector('.exchange-rates');
    const width = exchangeRates.offsetWidth;
    const scrollWidth = exchangeRates.scrollWidth;
    const dOffset = 10;
    const padding = 16;
    let offset = 0;
    let isLeft = true;

    let maxOffset = width - scrollWidth - padding;
    while (maxOffset % dOffset !== 0) {
      maxOffset++;
    }

    setInterval(() => {
      exchangeRates.style.left = offset + 'px';
      if (isLeft) {
        offset -= dOffset;
        if (maxOffset === offset) {
          isLeft = false;
        }
      } else {
        offset += dOffset;
        if (offset === 0) {
          isLeft = true;
        }
      }
    }, 100);
  });

  instance.emit('get-current-prices', null);
}