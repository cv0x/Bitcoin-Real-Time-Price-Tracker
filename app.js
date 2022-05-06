let btc = new WebSocket('wss://stream.binance.com:9443/ws/btcbusd@trade')
let btcPriceElement = document.getElementById('btc-price');
let lastPrice = null;


btc.onmessage = (event) => {
    let stockObject = JSON.parse(event.data);
    let price = parseFloat(stockObject.p).toFixed(2);

    btcPriceElement.innerText = price + ' $';

    lastPrice = price;
}