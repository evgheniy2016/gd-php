import { WebSocketClient } from '../ws'

let data = [  ];
let x, y, x2, y2, focus, context, lastZoom, xAxis, xAxis2, yAxis, area, area2, brush;
let d3 = (window as any)['d3'];
const maxPoints = 400;
let currentAssetPrice: any = null;
let wsInstance: WebSocketClient;
let currentAsset: string = null;
let placeABetButton: any = null;
let amountInput: any = null;
let sellButton: any = null;
let buyButton: any = null;
let direction: string = null;
let timeHiddenInput: any = null;
let assetPriceInput: any = null;
let offerMultiplier: any = null;
const currentTimeIntervals = [];
const timeIntervalsElements = [];
let exchangeFilterTabShort = null;
let exchangeFilterTabLong = null;
let exchangeFilterTabShortContent = null;
let exchangeFilterTabLongContent = null;
let currentTimeIntervalAssetElements = null;
let graphContext = null;
let zoom = null;
let svgInstance = null;
let currentTimeInterval: string;
let currentAssetName: string = "";
let lastMouseCoordinates: number[] = [];
let bisectDate: any = null;
let circle, width, margin, verticalLine, tooltip, isMouseEntered = false;

let searchAssetInput = null;

const assetPrices = {};

function b64EncodeUnicode(str) {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode(('0x' + (p1 as any)) as any);
    }));
}

function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

function getDecimal(num) {
  return num - Math.floor(num);
}

function onMouseMove(isExternal: boolean = false) {
  if (!isMouseEntered) {
    return;
  }

  const mouseCoordinates = !isExternal ? d3.mouse(this)[0] : lastMouseCoordinates;

  if (!isExternal) {
    lastMouseCoordinates = mouseCoordinates;
  }

  let x0 = x.invert(mouseCoordinates);
  let i = bisectDate(data, x0, 1);
  let d0 = data[i - 1];
  let d1 = data[i];
  if (typeof d0 === "undefined" || typeof d1 === "undefined") {
    return;
  }

  let d = x0 - d0.date > d1.date - x0 ? d1 : d0;
  const date = d.date;
  const year = date.getFullYear();
  const month = appendZero(date.getMonth() + 1);
  const day = appendZero(date.getDate());
  const hour = appendZero(date.getHours());
  const minute = appendZero(date.getMinutes());
  const seconds = appendZero(date.getSeconds());
  const dateString = `${day}.${month}.${year} ${hour}:${minute}:${seconds}`;

  let tooltipX = x(d.date);
  let tooltipPresumptiveWidth = 140;

  console.log(width);

  if (tooltipX + tooltipPresumptiveWidth >= width) {
    tooltipX -= tooltipPresumptiveWidth;
  }

  circle
    .attr('display', null)
    .attr('transform', `translate(${x(d.date) + margin.left}, ${y(d.price) + margin.top})`);

  verticalLine
    .attr('display', null)
    .attr('transform', `translate(${x(d.date)}, 0)`);

  tooltip
    .attr('display', null)
    .text(dateString)
    .attr('transform', `translate(${tooltipX + margin.left * 1.25}, ${y(d.price) + margin.top * 1.2})`);

  tooltip.append('tspan')
    .text(d.price)
    .attr('dy', '14px')
    .attr('x', 0);
}

function getTimeIntervalForHuman(interval) {
  interval = interval.replace('s', ' сек');
  interval = interval.replace('m', ' мин');
  interval = interval.replace('d', ' дней');
  interval = interval.replace('M', ' мес');
  return interval;
}

export function tradingGraph () {
  wsInstance = WebSocketClient.getInstance();
  wsInstance.emit('subscribe', 'any');
  placeABetButton = document.querySelector('.place-a-bet-form .submit-button');
  amountInput = document.querySelector('.place-a-bet-form .input-field');
  sellButton = document.querySelector('.place-a-bet .sell');
  buyButton = document.querySelector('.place-a-bet .buy');
  timeHiddenInput = document.querySelector('.place-a-bet-form .time-input');
  assetPriceInput = document.querySelector('.place-a-bet-form .asset-price');
  offerMultiplier = document.querySelector('.place-a-bet-form .offer-multiplier');
  exchangeFilterTabShort = document.querySelector('.exchange-filter-tab[data-type="short"]');
  exchangeFilterTabLong = document.querySelector('.exchange-filter-tab[data-type="long"]');
  exchangeFilterTabShortContent = document.querySelector('.exchange-filter-short');
  exchangeFilterTabLongContent = document.querySelector('.exchange-filter-long');
  currentTimeIntervalAssetElements = document.querySelectorAll('[data-current-date-interval]');
  searchAssetInput = document.querySelector('#assets-search-field');

  const tradingAssets = document.querySelectorAll('.trading-asset');
  const timeIntervals = document.querySelectorAll('[data-time-interval]');
  const currentTimeIntervalElements = document.querySelectorAll('[data-current-interval]');
  for (let i = 0; i < currentTimeIntervalElements.length; i++) {
    currentTimeIntervals.push(currentTimeIntervalElements[i]);
  }

  const tradingAssetsArray = [];
  for (let i = 0; i < tradingAssets.length; i++) {
    tradingAssetsArray.push(tradingAssets[i]);
  }

  searchAssetInput.addEventListener('input', () => {
    const searchText = searchAssetInput.value.toLowerCase();

    tradingAssetsArray
      .forEach(element => element.classList.remove('not-found'));
    tradingAssetsArray
      .filter(element => element.getAttribute('data-asset-name').toLowerCase().indexOf(searchText) < 0)
      .forEach(element => element.classList.add('not-found'));
  });

  for (let i = 0; i < timeIntervals.length; i++) {
    timeIntervalsElements.push(timeIntervals[i]);

    timeIntervals[i].addEventListener('click', () => {
      const selectedTimeInterval = timeIntervals[i].getAttribute('data-time-interval');
      if (timeHiddenInput !== null) {
        timeHiddenInput.value = b64EncodeUnicode(JSON.stringify({
          time: b64EncodeUnicode(selectedTimeInterval)
        }));
      }
      timeIntervalsElements.forEach(element => element.classList.remove('active'));
      timeIntervals[i].classList.add('active');

      for (let j = 0; j < currentTimeIntervalAssetElements.length; j++) {
        currentTimeIntervalAssetElements[j].innerHTML = getTimeIntervalForHuman(selectedTimeInterval);
      }

      currentTimeInterval = selectedTimeInterval;

      for (let i = 0; i < tradingAssets.length; i++) {
        const hasTime = tradingAssets[i].hasAttribute('data-' + selectedTimeInterval) && tradingAssets[i].getAttribute('data-'+selectedTimeInterval) === selectedTimeInterval;
        if (!hasTime) {
          tradingAssets[i].classList.add('hidden');
        } else {
          tradingAssets[i].classList.remove('hidden');
        }
      }
    });
  }

  if (timeIntervals.length > 0) {
    (timeIntervals[0] as any).click();
  }

  exchangeFilterTabShort.addEventListener('click', () => {
    exchangeFilterTabLong.classList.remove('active');
    exchangeFilterTabShort.classList.add('active');

    exchangeFilterTabShortContent.classList.remove('hidden');
    exchangeFilterTabLongContent.classList.add('hidden');
  });

  exchangeFilterTabLong.addEventListener('click', () => {
    exchangeFilterTabShort.classList.remove('active');
    exchangeFilterTabLong.classList.add('active');

    exchangeFilterTabLongContent.classList.remove('hidden');
    exchangeFilterTabShortContent.classList.add('hidden');
  });

  currentAssetPrice = document.querySelector('.place-a-bet .current-price');
  for (let i = 0; i < tradingAssets.length; i++) {
    assetPrices[tradingAssets[i].getAttribute('data-asset')] = tradingAssets[i].querySelector('[data-asset-value]');
    tradingAssets[i].addEventListener('click', (e) => {
      const target = tradingAssets[i];
      const asset = target.getAttribute('data-asset');
      const assetName = target.getAttribute('data-asset-name');
      // wsInstance.emit('replace-subscription', asset);
      currentAsset = asset;
      if (currentAssetPrice !== null) {
        currentAssetPrice.classList.remove('invisible');
      }
      currentAssetName = assetName;

      for (let j = 0; j < tradingAssets.length; j++) {
        tradingAssets[j].classList.remove('highlight');
      }

      target.classList.add('highlight');

      clearGraph();
    });
  }

  if (sellButton !== null) {
    sellButton.addEventListener('click', () => {
      direction = 'up';
      sellButton.classList.add('active');
      buyButton.classList.remove('active');
    });
  }
  if (buyButton !== null) {
    buyButton.addEventListener('click', () => {
      direction = 'down';
      sellButton.classList.remove('active');
      buyButton.classList.add('active');
    });
  }

  wsInstance.on('asset-updated', (asset) => {
    const assetPrice = assetPrices[asset.active];
    if (typeof assetPrice === "undefined") {
      return;
    }
    const currentPrice = Number(assetPrice.innerHTML);
    const newPrice = Number(asset.price.toFixed(5));
    assetPrice.innerHTML = newPrice.toFixed(5);

    if (currentPrice == newPrice) {
      assetPrice.classList.remove('price-down');
      assetPrice.classList.remove('price-up');
    } else if (currentPrice > newPrice) {
      assetPrice.classList.add('price-down');
      assetPrice.classList.remove('price-up');
    } else {
      assetPrice.classList.add('price-up');
      assetPrice.classList.remove('price-down');
    }
  });

  if (placeABetButton !== null) {
    wsInstance.on('bet-placed', data => {
      placeABetButton.removeAttribute('disabled');
      amountInput.value = '';

      buyButton.classList.remove('active');
      sellButton.classList.remove('active');
      direction = null;

      if (data.response === 'error') {
        alert(data.message);
      } else {
        alert('Ставка успешно сделана!');
      }
    });

    placeABetButton.addEventListener('click', (e) => {
      e.preventDefault();

      if (currentAsset !== null) {

        const timestamp = (+new Date());
        const amount = Number(amountInput.value);

        if (isNaN(amount) || amount < 0.000000001) {
          alert('Введите корректные данные');
          return;
        }

        placeABetButton.setAttribute('disabled', 'disabled');

        const placeABetData = {
          direction: direction,
          asset: currentAsset,
          amount: amount,
          time: timeHiddenInput.value
        };

        wsInstance.emit('place-a-bet', placeABetData);
      }
    });
  }

  drawGraph();

  // Initial graph subscription
  const firstTimeInterval = '30s';
  const firstAsset = document.querySelectorAll(`[data-${firstTimeInterval}="${firstTimeInterval}"]`);
  if (firstAsset.length > 0) {
    (firstAsset[0] as any).click();
  }

}

let i = 0;

function clearGraph() {
  data = [];

  if (svgInstance !== null) {
    const container = document.querySelector('.graph-container');
    const prototype = container.getAttribute('data-prototype');
    container.innerHTML = prototype;
  }

  drawGraph();

}

function appendZero(number: any) {
  return ('0' + (number)).substr(-2);
}

function drawGraph() {
  margin = {top: 25, right: 20, bottom: 110, left: 40};

  let svg = d3.select("svg"),
    margin2 = {top: 430, right: 20, bottom: 30, left: 40},
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom;


  width = +svg.attr("width") - margin.left - margin.right;
  bisectDate = d3.bisector(function(d) { return d.date; }).left;

  svgInstance = svg;

  x = d3.scaleTime().range([0, width]);
  x2 = d3.scaleTime().range([0, width]);
  y = d3.scaleLinear().range([height, 0]);
  y2 = d3.scaleLinear().range([height2, 0]);

  xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat('%H:%M:%S'));
  xAxis2 = d3.axisBottom(x2);
  yAxis = d3.axisLeft(y);

  brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);

  zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

  area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.price); });

  area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2(d.date); })
    .y0(height2)
    .y1(function(d) { return y2(d.price); });

  svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  svg.append('text')
    .text(getTimeIntervalForHuman(currentTimeInterval) + ' - ' + currentAssetName)
    .attr("font-size", "20px")
    .attr("fill", "#3594e6")
    .attr('x', function(d, i) {
      const labelWidth = this.getComputedTextLength();

      return width / 2 - labelWidth / 2 + margin.left;
    })
    .attr('y', 16)
    .attr('width', 150);

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.min(data, function(d) { return d.price; })]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  circle = svg.append('circle')
    .attr('r', 6)
    .attr('class', 'circle')
    .attr('display', 'none');

  verticalLine = svg.append('line')
    .attr('x1', margin.left)
    .attr('y1', margin.top)
    .attr('x2', margin.left)
    .attr('y2', height + margin.top)
    .attr('class', 'line')
    .attr('display', 'none');

  tooltip = svg.append('text')
    .attr('class', 'tooltip')
    .attr('display', 'none');

  focus.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area);

  focus.append("g")
    .attr("class", "axis axis--x  axisWhite")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  focus.append("g")
    .attr("class", "axis axis--y  axisWhite")
    .call(yAxis);

  context.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area2);


  lastZoom = null;

  const instance = WebSocketClient.getInstance();
  instance.emit('subscribe', 'pair:usd-btc');

  instance.on('asset-updated', (asset) => {
    if (asset.active !== currentAsset) {
      return;
    }

    const timestamp = asset.timestamp;
    const date = new Date(timestamp);
    data.push({ date: date, price: asset.price });
    if (currentAssetPrice !== null) {
      currentAssetPrice.innerHTML = asset.price;
      assetPriceInput.value = asset.price;
    }

    if (data.length > maxPoints) {
      data = data.slice(-maxPoints);
    }

    x.domain(d3.extent(data, function(d) { return d.date; }));

    let dataInSelectedRange = data;
    if (lastZoom !== null) {
      const zoomDomain = lastZoom.rescaleX(x2).domain();
      dataInSelectedRange = dataInSelectedRange.filter(item => {
        return item.date >= zoomDomain[0] && item.date <= zoomDomain[1]
      });
    }

    const uniquePrices = dataInSelectedRange
      .map(item => item.price)
      .filter((item, index, self) => self.indexOf(item) == index);
    const uniquePricesAll = data.map(item => item.price)
      .filter((item, index, self) => self.indexOf(item) === index);

    let max = Math.max(...uniquePrices);
    let min = Math.min(...uniquePrices);
    let absoluteMin = Math.min(...uniquePricesAll);
    let absoluteMax = Math.max(...uniquePricesAll);

    if (max !== -Infinity && min !== Infinity) {
      let decimalPart = getDecimal(max) * 10000;
      let integerPart = Math.floor(max);

      let minDecimalPart = getDecimal(min) * 10000;
      let minIntegerPart = Math.floor(min);

      let minAbsoluteDecimalPart = getDecimal(absoluteMin) * 10000;
      let minAbsoluteIntegerPart = Math.floor(absoluteMin);

      let maxAbsoluteDecimalPart = getDecimal(absoluteMax) * 10000;
      let maxAbsoluteIntegerPart = Math.floor(absoluteMax);

      let domainFrom = minIntegerPart + (minDecimalPart - 10) / 10000;
      let domainTo = integerPart + (decimalPart + 10) / 10000;

      let domainFromAbsolute = minAbsoluteIntegerPart + (minAbsoluteDecimalPart - 10) / 10000;
      let domainToAbsolute = maxAbsoluteIntegerPart + (maxAbsoluteDecimalPart + 10) / 10000;

      y.domain([domainFrom, domainTo]);
      x2.domain(x.domain());
      y2.domain([domainFromAbsolute, domainToAbsolute]);

      focus.select('.area').datum(data).attr('d', area);
      context.select('.area').datum(data).attr('d', area2);

      focus.select('.axis--y').call(yAxis);
      focus.select('.axis--x').call(xAxis);

      if (lastZoom !== null) {
        x.domain(lastZoom.rescaleX(x2).domain());
        focus.select(".area").attr("d", area);
        focus.select(".axis--x").call(xAxis);
        context.select(".brush").call(brush.move, x.range().map(lastZoom.invertX, lastZoom));
      }
    }

    if (isMouseEntered) {
      onMouseMove(true);
    }

  });

  context.append("g")
    .attr("class", "axis axis--x axisWhite")
    .attr("transform", "translate(0," + height2 + ")")
    .call(xAxis2);

  graphContext = context.append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.move, x.range());

  let a = svg.append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", height)
    .on('mousemove', onMouseMove)
    .on('mouseenter', () => isMouseEntered = true)
    .on('mouseleave', () => {
      circle.attr('display', 'none');
      tooltip.attr('display', 'none');
      verticalLine.attr('display', 'none');
      isMouseEntered = false;
    })
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);

  (window as any)['rect'] = a;


  function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    let s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
  }

  function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush

    let t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
    lastZoom = t;
  }

  function type(d) {
    return d;
  }
}
