// ================ GLOBAL VARIABLES ================
let btcPriceElement = document.getElementById("btc-price"); // BTC price display element
let apiUrl = "https://api.coingecko.com/api/v3/coins/bitcoin"; // API endpoint
let btcPriceChangePercentage7dElement; // Stores 7-day price change percentage

// ================ DATA FETCHING ================
async function getData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

// ================ IMAGE MANAGEMENT ================
function refreshImage() {
  // Force image refresh by adding timestamp to URL
  var imageElement = document.getElementById("btc-image");
  imageElement.src = imageElement.src.split("?")[0] + "?t=" + Date.now();
}

// Hourly image refresh
setInterval(refreshImage, 3600000);

// ================ DATA DISPLAY & UI UPDATES ================
async function showData() {
  const data = await getData();
  if (data) {
    // Update price display
    const currentPriceUSD = data.market_data.current_price.usd;
    btcPriceElement.innerText = currentPriceUSD.toLocaleString() + " $";

    // Get DOM elements for special effects
    const toTheMoon = document.querySelector(".tothemoon img");
    const moon = document.querySelector(".moon img");
    const btcBackground = document.querySelector(".btc-backgound");
    const btcLogo = document.querySelector("#btc-logo");

    // Price-based visibility toggles
    toTheMoon.style.display =
      currentPriceUSD >= 99000 && currentPriceUSD <= 110000 ? "block" : "none";
    moon.style.display =
      currentPriceUSD >= 100000 && currentPriceUSD <= 110000 ? "block" : "none";
    btcBackground.style.display =
      currentPriceUSD >= 99000 && currentPriceUSD <= 110000 ? "none" : "block";
    btcLogo.style.display =
      currentPriceUSD >= 99000 && currentPriceUSD <= 110000 ? "none" : "block";

    // Store 7-day trend data
    const priceChangePercentage7d = data.market_data.price_change_percentage_7d;
    btcPriceChangePercentage7dElement = priceChangePercentage7d;

    // Save current trend color to localStorage
    const trendColor = priceChangePercentage7d > 0 ? "#00ff00" : "#ff0000";
    localStorage.setItem("interactiveTrendColor", trendColor);
  }
}

// Initial data load and periodic updates
showData();
setInterval(showData, 60000);

// ================ COLOR MANAGEMENT ================
const getInteractiveColor = () => {
  // Returns cached trend color or default green
  return localStorage.getItem("interactiveTrendColor") || "#00ff00";
};

// ================ SETTINGS MANAGEMENT ================
document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const fontSelect = document.getElementById("font-family");
  const logoShadowSelect = document.getElementById("logo-shadow");
  const priceColorElement = document.querySelector("#btc-price");
  const priceColorSelect = document.getElementById("price-color");
  const divBackground = document.querySelector(".btc-backgound");
  const divCard = document.querySelector(".card");
  const saveButton = document.getElementById("save");

  // Clear previous session's trend color
  localStorage.removeItem("interactiveTrendColor");

  // ----------------- SAVE SETTINGS HANDLER -----------------
  saveButton.addEventListener("click", function () {
    // Package settings
    const settings = {
      font: fontSelect.value,
      shadow: logoShadowSelect.value,
      color: priceColorSelect.value,
    };

    // Store in localStorage
    localStorage.setItem("selectedFont", settings.font);
    localStorage.setItem("selectedFontShadow", settings.shadow);
    localStorage.setItem("selectedPriceColor", settings.color);

    // Apply styles immediately
    document.body.style.fontFamily = settings.font;
    priceColorElement.style.color =
      settings.color === "interactive" ? getInteractiveColor() : settings.color;

    // Apply shadow styles
    const shadowValue =
      settings.shadow === "interactive"
        ? `0 0 20px ${getInteractiveColor()}`
        : `0 0 20px ${settings.shadow}`;

    divBackground.style.boxShadow = shadowValue;
    divCard.style.boxShadow = shadowValue;
  });

  // ----------------- LOAD SAVED SETTINGS -----------------
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

  // ----------------- REAL-TIME SETTINGS CHANGES -----------------
  // Shadow selector handler
  logoShadowSelect.addEventListener("change", function () {
    const shadow =
      this.value === "interactive" ? getInteractiveColor() : this.value;

    divBackground.style.boxShadow = `0 0 20px ${shadow}`;
    divCard.style.boxShadow = `0 0 20px ${shadow}`;
  });

  // Price color selector handler
  priceColorSelect.addEventListener("change", function () {
    priceColorElement.style.color =
      this.value === "interactive" ? getInteractiveColor() : this.value;
  });

  // Font selector handler
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
  // Pizza Day anniversary check (May 22)
  const today = new Date();
  if (today.getDate() === 22 && today.getMonth() === 4) {
    document.querySelector(".pizzaday img").style.display = "block";
    document.querySelector("#btc-logo").style.display = "none";
  }
});
