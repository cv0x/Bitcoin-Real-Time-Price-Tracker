let btcPriceElement = document.getElementById("btc-price");
let apiUrl = "https://api.coingecko.com/api/v3/coins/bitcoin";
let btcPriceChangePercentage7dElement = null;
let isInitialLoad = true;

// Cache DOM elements
const elements = {
  priceColorSelect: document.getElementById("price-color"),
  logoShadowSelect: document.getElementById("logo-shadow"),
  divBackground: document.querySelector(".btc-backgound"),
  divCard: document.querySelector(".card"),
  priceElement: document.querySelector("#btc-price"),
  fontSelect: document.getElementById("font-family"),
  menuIcon: document.getElementById("menu-icon"),
  menu: document.querySelector(".menu"),
  toTheMoon: document.querySelector(".tothemoon img"),
  moon: document.querySelector(".moon img"),
  btcLogo: document.querySelector("#btc-logo"),
  pizzaDay: document.querySelector(".pizzaday img"),
};

// Core functionality
const DataManager = {
  async fetchData() {
    try {
      const response = await fetch(apiUrl);
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  },

  async getPriceData() {
    const data = await this.fetchData();
    if (!data) return null;

    btcPriceChangePercentage7dElement =
      data.market_data.price_change_percentage_7d;

    return {
      price: data.market_data.current_price.usd,
      change7d: btcPriceChangePercentage7dElement,
    };
  },
};

const StyleManager = {
  applyInteractiveStyles() {
    const color = this.getInteractiveColor();

    if (elements.priceColorSelect.value === "interactive") {
      elements.priceElement.style.color = color;
    }

    if (elements.logoShadowSelect.value === "interactive") {
      elements.divBackground.style.boxShadow = `0 0 20px ${color}`;
      elements.divCard.style.boxShadow = `0 0 20px ${color}`;
    }
  },

  getInteractiveColor() {
    return btcPriceChangePercentage7dElement > 0 ? "#00ff00" : "#ff0000";
  },

  updatePriceDisplay(price) {
    elements.priceElement.textContent = `${price.toLocaleString()} $`;
  },

  handleSpecialEffects(price) {
    const showRocket = price >= 99000 && price <= 110000;
    const showMoon = price >= 100000 && price <= 110000;

    elements.toTheMoon.style.display = showRocket ? "block" : "none";
    elements.moon.style.display = showMoon ? "block" : "none";
    elements.divBackground.style.display = showRocket ? "none" : "block";
    elements.btcLogo.style.display = showRocket ? "none" : "block";
  },
};

const SettingsManager = {
  init() {
    this.loadFont();
    this.loadShadow();
    this.loadPriceColor();
    this.setupEventListeners();
    this.checkPizzaDay();
  },

  loadFont() {
    const font = localStorage.getItem("selectedFont");
    if (font) {
      document.body.style.fontFamily = font;
      elements.fontSelect.value = font;
    }
  },

  loadShadow() {
    const shadow = localStorage.getItem("selectedFontShadow");
    if (shadow) {
      elements.logoShadowSelect.value = shadow;
      this.applyShadow(shadow);
    }
  },

  loadPriceColor() {
    const color = localStorage.getItem("selectedPriceColor");
    if (color) {
      elements.priceColorSelect.value = color;
      this.applyPriceColor(color);
    }
  },

  applyShadow(value) {
    if (value === "interactive") {
      StyleManager.applyInteractiveStyles();
    } else {
      elements.divBackground.style.boxShadow = value;
      elements.divCard.style.boxShadow = value;
    }
  },

  applyPriceColor(value) {
    elements.priceElement.style.color =
      value === "interactive" ? StyleManager.getInteractiveColor() : value;
  },

  setupEventListeners() {
    elements.fontSelect.addEventListener("change", () => {
      document.body.style.fontFamily = elements.fontSelect.value;
    });

    elements.logoShadowSelect.addEventListener("change", (e) => {
      this.applyShadow(e.target.value);
    });

    elements.priceColorSelect.addEventListener("change", (e) => {
      this.applyPriceColor(e.target.value);
    });

    elements.menuIcon.addEventListener("click", () => {
      elements.menu.style.display =
        elements.menu.style.display === "none" ? "block" : "none";
    });

    document.getElementById("save").addEventListener("click", () => {
      localStorage.setItem("selectedFont", elements.fontSelect.value);
      localStorage.setItem(
        "selectedFontShadow",
        elements.logoShadowSelect.value
      );
      localStorage.setItem(
        "selectedPriceColor",
        elements.priceColorSelect.value
      );
    });
  },

  checkPizzaDay() {
    const today = new Date();
    if (today.getDate() === 22 && today.getMonth() === 4) {
      elements.pizzaDay.style.display = "block";
      elements.btcLogo.style.display = "none";
    }
  },
};

const ImageManager = {
  refresh() {
    const imageElement = document.getElementById("btc-image");
    imageElement.src = `${imageElement.src.split("?")[0]}?t=${Date.now()}`;
  },
};

// Main initialization
async function initialize() {
  // Initial data load
  const priceData = await DataManager.getPriceData();
  if (!priceData) return;

  StyleManager.updatePriceDisplay(priceData.price);
  StyleManager.handleSpecialEffects(priceData.price);

  // Apply saved settings after initial data load
  SettingsManager.init();
  StyleManager.applyInteractiveStyles();

  // Set up periodic updates
  setInterval(async () => {
    const newData = await DataManager.getPriceData();
    if (!newData) return;

    StyleManager.updatePriceDisplay(newData.price);
    StyleManager.handleSpecialEffects(newData.price);
    StyleManager.applyInteractiveStyles();
  }, 60000);

  setInterval(ImageManager.refresh, 3600000);
}

// Start the application
document.addEventListener("DOMContentLoaded", initialize);
