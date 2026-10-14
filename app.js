// ================ GLOBAL VARIABLES ================
const btcPriceElement = document.getElementById("btc-price"); // Main price display element
const apiUrl =
  "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true"; // Data source endpoint
const divBackground = document.querySelector(".btc-backgound"); // Background element reference
const divCard = document.querySelector(".card"); // Main card element reference
const root = document.documentElement;

// ================ SETTINGS ================
// Defaults used in a normal browser; Wallpaper Engine overrides them
// with the values from project.json (user properties).
const settings = {
  font: "Poetsen One",
  priceColorMode: "static", // static | interactive | preset hex color
  priceColor: "#000000",
  shadowMode: "interactive", // off | color | interactive | preset hex color
  shadowColor: "#808080",
  logoColor: "#000001",
  cardColor: "#666262",
  backgroundPreset: "#03071e,#370617", // "color1,color2" | custom
  backgroundColor1: "#03071e",
  backgroundColor2: "#370617",
  showChart: true,
  scale: 100,
  offsetX: 0,
  offsetY: 0,
};

let lastData = null; // Last API response, re-rendered when the font changes
// Trend colors shared by the chart line and interactive price color / shadow
const TREND_UP_COLOR = "#00ff00";
const TREND_DOWN_COLOR = "#ff0000";
let trendColor = TREND_UP_COLOR; // Interactive color by 7-day trend

/**
 * Converts Wallpaper Engine color ("0.5 0.2 1") to CSS rgb()
 * @param {string} weColor Space separated floats 0-1
 * @returns {string} CSS color value
 */
function weColorToCss(weColor) {
  const rgb = weColor.split(" ").map((c) => Math.round(parseFloat(c) * 255));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

// ================ APPLY SETTINGS ================
/**
 * Applies current settings to the page
 */
function applySettings() {
  document.body.style.fontFamily = settings.font;
  root.style.setProperty("--main-color", settings.cardColor);
  root.style.setProperty("--btc-color", settings.logoColor);
  // Background gradient from preset ("color1,color2") or custom colors
  const [bg1, bg2] =
    settings.backgroundPreset === "custom"
      ? [settings.backgroundColor1, settings.backgroundColor2]
      : settings.backgroundPreset.split(",");
  root.style.setProperty("--bg-color-1", bg1);
  root.style.setProperty("--bg-color-2", bg2);
  root.style.setProperty("--scale", settings.scale / 100);
  root.style.setProperty("--offset-x", `${settings.offsetX}vw`);
  root.style.setProperty("--offset-y", `${settings.offsetY}vh`);

  document.getElementById("btc-chart").style.display = settings.showChart
    ? "block"
    : "none";

  applyColors();
  renderPrice();
  // Re-fit price once the selected web font is loaded (different width)
  document.fonts.ready.then(() => lastData && fitPrice());
}

/**
 * Applies price color and shadows (custom, interactive or preset color)
 */
function applyColors() {
  let priceColor = settings.priceColorMode; // Preset value is the color itself
  if (settings.priceColorMode === "static") priceColor = settings.priceColor;
  else if (settings.priceColorMode === "interactive") priceColor = trendColor;
  btcPriceElement.style.color = priceColor;

  let shadowValue = "none";
  if (settings.shadowMode === "color") {
    shadowValue = `0 0 20px ${settings.shadowColor}`;
  } else if (settings.shadowMode === "interactive") {
    shadowValue = `0 0 20px ${trendColor}`;
  } else if (settings.shadowMode !== "off") {
    shadowValue = `0 0 20px ${settings.shadowMode}`; // Preset color
  }
  divBackground.style.boxShadow = shadowValue;
  divCard.style.boxShadow = shadowValue;
}

// ================ WALLPAPER ENGINE PROPERTIES ================
// Called by Wallpaper Engine on load (all properties) and on every change (only changed ones)
window.wallpaperPropertyListener = {
  applyUserProperties: function (properties) {
    if (properties.font) settings.font = properties.font.value;
    if (properties.pricecolormode)
      settings.priceColorMode = properties.pricecolormode.value;
    if (properties.pricecolor)
      settings.priceColor = weColorToCss(properties.pricecolor.value);
    if (properties.shadowmode) settings.shadowMode = properties.shadowmode.value;
    if (properties.shadowcolor)
      settings.shadowColor = weColorToCss(properties.shadowcolor.value);
    if (properties.logocolor)
      settings.logoColor = weColorToCss(properties.logocolor.value);
    if (properties.cardcolor)
      settings.cardColor = weColorToCss(properties.cardcolor.value);
    if (properties.backgroundpreset)
      settings.backgroundPreset = properties.backgroundpreset.value;
    if (properties.backgroundcolor1)
      settings.backgroundColor1 = weColorToCss(properties.backgroundcolor1.value);
    if (properties.backgroundcolor2)
      settings.backgroundColor2 = weColorToCss(properties.backgroundcolor2.value);
    if (properties.showchart) settings.showChart = properties.showchart.value;
    if (properties.scale) settings.scale = properties.scale.value;
    if (properties.offsetx) settings.offsetX = properties.offsetx.value;
    if (properties.offsety) settings.offsetY = properties.offsety.value;

    applySettings();
  },
};

// ================ DATA FETCHING ================
/**
 * Fetches Bitcoin data from CoinGecko API
 * @returns {Promise<Object>} Bitcoin market data
 * @throws {Error} On network failure
 */
async function getData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data:", error);
    throw error;
  }
}

// ================ CHART ================
/**
 * Draws 7-day price chart from sparkline data
 * @param {number[]} prices Hourly prices for the last 7 days
 */
function drawChart(prices) {
  if (!prices || prices.length < 2) return;
  const width = 400;
  const top = 20; // Padding from the card top
  const bottom = 200; // Lowest point of the line
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const points = prices
    .map((price, i) => {
      const x = (i / (prices.length - 1)) * width;
      const y = bottom - ((price - min) / range) * (bottom - top);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const line = document.getElementById("btc-chart-line");
  line.setAttribute("points", points);
  line.setAttribute("stroke", trendColor);
}

// ================ DATA DISPLAY & UI UPDATES ================
/**
 * Shrinks price font size until the text fits the card
 */
function fitPrice() {
  let size = 50;
  btcPriceElement.style.fontSize = `${size}px`;
  while (btcPriceElement.scrollWidth > btcPriceElement.clientWidth && size > 20) {
    size -= 2;
    btcPriceElement.style.fontSize = `${size}px`;
  }
}

/**
 * Renders USD price from the last fetched data
 */
function renderPrice() {
  if (!lastData) return;
  const price = lastData.market_data.current_price.usd;
  btcPriceElement.innerText = `${price.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })} $`;
  fitPrice();
}

/**
 * Main update function handling:
 * - Price display
 * - Special element visibility
 * - Interactive color updates
 */
async function showData() {
  const data = await getData();
  if (data && data.market_data) {
    lastData = data;
    renderPrice();
    // Interactive color by 7-day trend (same direction as the chart line)
    const prices = data.market_data.sparkline_7d && data.market_data.sparkline_7d.price;
    const trendUp =
      prices && prices.length > 1
        ? prices[prices.length - 1] >= prices[0]
        : data.market_data.price_change_percentage_7d > 0;
    trendColor = trendUp ? TREND_UP_COLOR : TREND_DOWN_COLOR;
    drawChart(prices);

    updateEasterEggs(data.market_data.current_price.usd);
    applyColors();
  }
}

// ================ SPECIAL FEATURES ================
/**
 * Annual Bitcoin Pizza Day celebration (May 22)
 * @returns {boolean}
 */
function isPizzaDay() {
  const today = new Date();
  return today.getDate() === 22 && today.getMonth() === 4;
}

/**
 * Toggles easter eggs, called on every update so they also switch
 * while the wallpaper keeps running (e.g. over midnight):
 * - Pizza Day (May 22): pizza instead of the logo, has priority over the rocket
 * - To the moon: rocket at 99k-110k USD, golden moon at 100k-110k USD
 * @param {number} priceUSD Current BTC price in USD
 */
function updateEasterEggs(priceUSD) {
  const pizzaDay = isPizzaDay();
  const moonRange = priceUSD >= 99000 && priceUSD <= 110000;
  const showRocket = moonRange && !pizzaDay;

  document.querySelector(".pizzaday img").style.display = pizzaDay ? "block" : "none";
  document.querySelector(".tothemoon img").style.display = showRocket ? "block" : "none";
  document.querySelector(".moon img").style.display =
    priceUSD >= 100000 && priceUSD <= 110000 ? "block" : "none";
  divBackground.style.display = showRocket ? "none" : "block";
  document.querySelector("#btc-logo").style.display =
    showRocket || pizzaDay ? "none" : "block";
}

// Initial load and periodic updates (every 60 seconds)
applySettings();
showData();
setInterval(showData, 60000);
