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

  const tradingAssets = document.querySelectorAll('.trading-asset');
  const timeIntervals = document.querySelectorAll('[data-time-interval]');
  const currentTimeIntervalElements = document.querySelectorAll('[data-current-interval]');
  for (let i = 0; i < currentTimeIntervalElements.length; i++) {
    currentTimeIntervals.push(currentTimeIntervalElements[i]);
  }

  for (let i = 0; i < timeIntervals.length; i++) {
    timeIntervalsElements.push(timeIntervals[i]);

    timeIntervals[i].addEventListener('click', () => {
      const selectedTimeInterval = timeIntervals[i].getAttribute('data-time-interval');
      timeHiddenInput.value = b64EncodeUnicode(JSON.stringify({
        time: b64EncodeUnicode(selectedTimeInterval)
      }));
      timeIntervalsElements.forEach(element => element.classList.remove('active'));
      timeIntervals[i].classList.add('active');

      for (let i = 0; i < tradingAssets.length; i++) {
        const tradingAssetTimeIntervals = tradingAssets[i].getAttribute('data-time-intervals');
        console.log(tradingAssetTimeIntervals, selectedTimeInterval);
        if (tradingAssetTimeIntervals.indexOf(';' + selectedTimeInterval + ';') === -1) {
          tradingAssets[i].classList.add('hidden');
        } else {
          tradingAssets[i].classList.remove('hidden');
        }
      }
    });
    console.log(timeIntervals[i].getAttribute('data-time-interval'));
  }

  currentAssetPrice = document.querySelector('.place-a-bet .current-price');
  for (let i = 0; i < tradingAssets.length; i++) {
    assetPrices[tradingAssets[i].getAttribute('data-asset')] = tradingAssets[i].querySelector('[data-asset-value]');
    tradingAssets[i].addEventListener('click', (e) => {
      const target = tradingAssets[i];
      const asset = target.getAttribute('data-asset');
      // wsInstance.emit('replace-subscription', asset);
      clearGraph();
      currentAsset = asset;
      currentAssetPrice.classList.remove('invisible');
    });
  }

  sellButton.addEventListener('click', () => {
    direction = 'up';
    sellButton.classList.add('active');
    buyButton.classList.remove('active');
  });
  buyButton.addEventListener('click', () => {
    direction = 'down';
    sellButton.classList.remove('active');
    buyButton.classList.add('active');
  });

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

  wsInstance.on('bet-placed', data => {
    placeABetButton.removeAttribute('disabled');
    amountInput.value = '';

    buyButton.classList.remove('active');
    sellButton.classList.remove('active');

    alert('Ставка успешно сделана!');
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

      wsInstance.emit('place-a-bet', {
        direction: direction,
        asset: currentAsset,
        amount: amount,
        time: timeHiddenInput.value,
        offer_multiplier: offerMultiplier.value
      });
    }
  });

  drawGraph();
}

function clearGraph() {
  data = [];

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.price; }) + 5]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  focus.select('.area').datum(data).attr('d', area);
  context.select('.area').datum(data).attr('d', area2);

  focus.select('.axis--y').call(yAxis);
  focus.select('.axis--x').call(xAxis);

  if (lastZoom !== null && typeof lastZoom !== "undefined") {
    x.domain(lastZoom.rescaleX(x2).domain());
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    context.select(".brush").call(brush.move, x.range().map(lastZoom.invertX, lastZoom));
  }
}

function drawGraph() {
  let svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 110, left: 40},
    margin2 = {top: 430, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom;

  x = d3.scaleTime().range([0, width]);
  x2 = d3.scaleTime().range([0, width]);
  y = d3.scaleLinear().range([height, 0]);
  y2 = d3.scaleLinear().range([height2, 0]);

  xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat('%X'));
  xAxis2 = d3.axisBottom(x2);
  yAxis = d3.axisLeft(y);

  brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);

  let zoom = d3.zoom()
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

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.min(data, function(d) { return d.price; })]);
  x2.domain(x.domain());
  y2.domain(y.domain());

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

  let lastZoom = null;

  const instance = WebSocketClient.getInstance();
  instance.emit('subscribe', 'pair:usd-btc');

  // const parseDate = d3.time.format("%d-%b-%y").parse;

  instance.on('asset-updated', (asset) => {
    if (asset.active !== currentAsset) {
      return;
    }

    const timestamp = asset.timestamp;
    const date = new Date(timestamp);
    data.push({ date: date, price: asset.price });
    currentAssetPrice.innerHTML = asset.price;
    assetPriceInput.value = asset.price;

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

    let max = dataInSelectedRange[0].price;
    let min = dataInSelectedRange[0].price;

    for (let i = 1; i < dataInSelectedRange.length; i++) {
      if (dataInSelectedRange[i].price > max) {
        max = dataInSelectedRange[i].price;
      }
      if (dataInSelectedRange[i].price < min) {
        min = dataInSelectedRange[i].price;
      }
    }


    let decimalPart = getDecimal(max) * 10000;
    let integerPart = Math.floor(max);

    let minDecimalPart = getDecimal(min) * 10000;
    let minIntegerPart = Math.floor(min);

    let domainFrom = minIntegerPart + (minDecimalPart - 10) / 10000;
    let domainTo = integerPart + (decimalPart + 10) / 10000;
    y.domain([domainFrom, domainTo]);
    x2.domain(x.domain());
    y2.domain(y.domain());

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
  });

  context.append("g")
    .attr("class", "axis axis--x axisWhite")
    .attr("transform", "translate(0," + height2 + ")")
    .call(xAxis2);

  context.append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.move, x.range());

  svg.append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);

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

    console.log('zoomed');

    let t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
    lastZoom = t;

    let dataInSelectedRange = data;
    if (lastZoom !== null) {
      const zoomDomain = lastZoom.rescaleX(x2).domain();
      dataInSelectedRange = dataInSelectedRange.filter(item => {
        return item.date >= zoomDomain[0] && item.date <= zoomDomain[1]
      });
    }

    let max = dataInSelectedRange[0].price;
    let min = dataInSelectedRange[0].price;

    for (let i = 1; i < dataInSelectedRange.length; i++) {
      if (dataInSelectedRange[i].price > max) {
        max = dataInSelectedRange[i].price;
      }
      if (dataInSelectedRange[i].price < max) {
        min = dataInSelectedRange[i].price;
      }
    }


    let decimalPart = getDecimal(max) * 10000;
    let integerPart = Math.floor(max);

    let domainFrom = integerPart + (decimalPart - 10) / 10000;
    let domainTo = integerPart + (decimalPart + 10) / 10000;
    // y.domain([domainFrom, domainTo]);
  }

  function type(d) {
    return d;
  }
}
