// ================ GLOBAL VARIABLES ================
let btcPriceElement = document.getElementById("btc-price"); // Main price display element
let apiUrl = "https://api.coingecko.com/api/v3/coins/bitcoin"; // Data source endpoint
let btcPriceChangePercentage7dElement; // Stores 7-day price trend
const divBackground = document.querySelector(".btc-backgound"); // Background element reference
const divCard = document.querySelector(".card"); // Main card element reference

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

// ================ IMAGE MANAGEMENT ================
/**
 * Forces image refresh by adding timestamp to URL
 * Prevents browser cache issues
 */
function refreshImage() {
  const imageElement = document.getElementById("btc-image");
  imageElement.src = imageElement.src.split("?")[0] + "?t=" + Date.now();
}

// Refresh image every hour (3600000 ms)
setInterval(refreshImage, 3600000);

// ================ DATA DISPLAY & UI UPDATES ================
/**
 * Main update function handling:
 * - Price display
 * - Special element visibility
 * - Trend data storage
 * - Interactive color updates
 */
async function showData() {
  const data = await getData();
  if (data) {
    // Update current price display
    const currentPriceUSD = data.market_data.current_price.usd;
    btcPriceElement.innerText = `${currentPriceUSD.toLocaleString()} $`;

    // Get DOM references
    const toTheMoon = document.querySelector(".tothemoon img");
    const moon = document.querySelector(".moon img");
    const btcBackground = document.querySelector(".btc-backgound");
    const btcLogo = document.querySelector("#btc-logo");

    // Toggle special elements based on price range
    toTheMoon.style.display =
      currentPriceUSD >= 99000 && currentPriceUSD <= 110000 ? "block" : "none";
    moon.style.display =
      currentPriceUSD >= 100000 && currentPriceUSD <= 110000 ? "block" : "none";
    btcBackground.style.display =
      currentPriceUSD >= 99000 && currentPriceUSD <= 110000 ? "none" : "block";
    btcLogo.style.display =
      currentPriceUSD >= 99000 && currentPriceUSD <= 110000 ? "none" : "block";

    // Store and update 7-day trend data
    const priceChangePercentage7d = data.market_data.price_change_percentage_7d;
    btcPriceChangePercentage7dElement = priceChangePercentage7d;

    // Update trend color in storage
    const trendColor = priceChangePercentage7d > 0 ? "#00ff00" : "#ff0000";
    localStorage.setItem("interactiveTrendColor", trendColor);

    // Real-time updates for interactive settings
    const selectedPriceColor = localStorage.getItem("selectedPriceColor");
    const selectedFontShadow = localStorage.getItem("selectedFontShadow");
    const interactiveColor = getInteractiveColor();

    // Update price color if set to interactive
    if (selectedPriceColor === "interactive") {
      btcPriceElement.style.color = interactiveColor;
    }

    // Update shadows if set to interactive
    if (selectedFontShadow === "interactive") {
      const shadowValue = `0 0 20px ${interactiveColor}`;
      divBackground.style.boxShadow = shadowValue;
      divCard.style.boxShadow = shadowValue;
    }
  }
}

// Initial load and periodic updates (every 60 seconds)
showData();
setInterval(showData, 60000);

// ================ COLOR MANAGEMENT ================
/**
 * Gets current interactive color from storage
 * @returns {string} CSS color value
 */
const getInteractiveColor = () => {
  return localStorage.getItem("interactiveTrendColor") || "#00ff00";
};

// ================ SETTINGS MANAGEMENT ================
document.addEventListener("DOMContentLoaded", function () {
  // DOM element references
  const fontSelect = document.getElementById("font-family");
  const logoShadowSelect = document.getElementById("logo-shadow");
  const priceColorElement = document.querySelector("#btc-price");
  const priceColorSelect = document.getElementById("price-color");
  const saveButton = document.getElementById("save");

  // Clear previous interactive color on load
  localStorage.removeItem("interactiveTrendColor");

  // ----------------- SETTINGS SAVE HANDLER -----------------
  saveButton.addEventListener("click", function () {
    // Package current settings
    const settings = {
      font: fontSelect.value,
      shadow: logoShadowSelect.value,
      color: priceColorSelect.value,
    };

    // Persist to localStorage
    localStorage.setItem("selectedFont", settings.font);
    localStorage.setItem("selectedFontShadow", settings.shadow);
    localStorage.setItem("selectedPriceColor", settings.color);

    // Apply font immediately
    document.body.style.fontFamily = settings.font;

    // Handle color setting (static or interactive)
    priceColorElement.style.color =
      settings.color === "interactive" ? getInteractiveColor() : settings.color;

    // Handle shadow setting (static or interactive)
    const shadowValue =
      settings.shadow === "interactive"
        ? `0 0 20px ${getInteractiveColor()}`
        : `0 0 20px ${settings.shadow}`;

    divBackground.style.boxShadow = shadowValue;
    divCard.style.boxShadow = shadowValue;
  });

  // ----------------- SETTINGS LOAD HANDLER -----------------
  // Font loading
  const savedFont = localStorage.getItem("selectedFont");
  if (savedFont) {
    document.body.style.fontFamily = savedFont;
    fontSelect.value = savedFont;
  }

  // Shadow loading
  const savedShadow = localStorage.getItem("selectedFontShadow");
  if (savedShadow) {
    const shadowValue =
      savedShadow === "interactive"
        ? `0 0 20px ${getInteractiveColor()}`
        : `0 0 20px ${savedShadow}`;

    divBackground.style.boxShadow = shadowValue;
    divCard.style.boxShadow = shadowValue;
    logoShadowSelect.value = savedShadow;
  }

  // Price color loading
  const savedColor = localStorage.getItem("selectedPriceColor");
  if (savedColor) {
    priceColorElement.style.color =
      savedColor === "interactive" ? getInteractiveColor() : savedColor;
    priceColorSelect.value = savedColor;
  }

  // ----------------- REAL-TIME SETTING CHANGES -----------------
  // Shadow selector change handler
  logoShadowSelect.addEventListener("change", function () {
    const shadow =
      this.value === "interactive" ? getInteractiveColor() : this.value;

    divBackground.style.boxShadow = `0 0 20px ${shadow}`;
    divCard.style.boxShadow = `0 0 20px ${shadow}`;
  });

  // Price color selector change handler
  priceColorSelect.addEventListener("change", function () {
    priceColorElement.style.color =
      this.value === "interactive" ? getInteractiveColor() : this.value;
  });

  // Font selector change handler
  fontSelect.addEventListener("change", function () {
    document.body.style.fontFamily = this.value;
  });

  // ----------------- UI CONTROLS -----------------
  // Menu toggle
  const menuIcon = document.getElementById("menu-icon");
  const menu = document.querySelector(".menu");
  menuIcon.addEventListener("click", () => {
    menu.style.display = menu.style.display === "none" ? "block" : "none";
  });

  // ----------------- SPECIAL FEATURES -----------------
  // Annual Bitcoin Pizza Day celebration (May 22)
  const today = new Date();
  if (today.getDate() === 22 && today.getMonth() === 4) {
    document.querySelector(".pizzaday img").style.display = "block";
    document.querySelector("#btc-logo").style.display = "none";
  }
});
