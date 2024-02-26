let btcPriceElement = document.getElementById("btc-price");
let apiUrl =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";

function fetchBtcPrice() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      let price = data.bitcoin.usd.toFixed(0);
      btcPriceElement.innerText = price + " $";
    })
    .catch((error) => {
      console.error("Error fetching BTC price:", error);
    });
}

// Fetch BTC price initially
fetchBtcPrice();

// Update BTC price every 10 seconds
setInterval(fetchBtcPrice, 10000);
