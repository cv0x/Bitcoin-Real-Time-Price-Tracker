let btcPriceElement = document.getElementById("btc-price");
let apiUrl = "https://api.coingecko.com/api/v3/coins/bitcoin";

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

// Status management
let currentTrendColor = null;

const DataManager = {
  async fetchData() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const trend = data.market_data.price_change_percentage_7d;

      // Update and save trend color
      currentTrendColor = trend > 0 ? "#00ff00" : "#ff0000";
      localStorage.setItem("currentTrendColor", currentTrendColor);

      return {
        price: data.market_data.current_price.usd,
        change7d: trend,
      };
    } catch (error) {
      console.error("Chyba při načítání dat:", error);
      return null;
    }
  },
};

const StyleManager = {
  applyInteractiveStyles() {
    const storedColor =
      localStorage.getItem("currentTrendColor") || currentTrendColor;

    if (elements.priceColorSelect.value === "interactive") {
      elements.priceElement.style.color = storedColor;
    }

    if (elements.logoShadowSelect.value === "interactive") {
      elements.divBackground.style.boxShadow = `0 0 20px ${storedColor}`;
      elements.divCard.style.boxShadow = `0 0 20px ${storedColor}`;
    }
  },

  updateUI(price) {
    elements.priceElement.textContent = `${price.toLocaleString()} $`;
    this.handleSpecialEffects(price);
  },

  handleSpecialEffects(price) {
    const showRocket = price >= 99000 && price <= 110000;
    elements.toTheMoon.style.display = showRocket ? "block" : "none";
    elements.moon.style.display = price >= 100000 ? "block" : "none";
    elements.divBackground.style.display = showRocket ? "none" : "block";
    elements.btcLogo.style.display = showRocket ? "none" : "block";
  },
};

const SettingsManager = {
  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.checkPizzaDay();
    StyleManager.applyInteractiveStyles();
  },

  async loadSettings() {
    // Wait for initial data load
    await DataManager.fetchData();

    // Load user preferences
    document.body.style.fontFamily =
      localStorage.getItem("selectedFont") || "Arial";
    elements.fontSelect.value = localStorage.getItem("selectedFont") || "Arial";

    elements.priceColorSelect.value =
      localStorage.getItem("selectedPriceColor") || "black";
    elements.logoShadowSelect.value =
      localStorage.getItem("selectedFontShadow") || "none";
  },

  setupEventListeners() {
    document.getElementById("save").addEventListener("click", () => {
      // Save user preferences
      localStorage.setItem("selectedFont", elements.fontSelect.value);
      localStorage.setItem(
        "selectedFontShadow",
        elements.logoShadowSelect.value
      );
      localStorage.setItem(
        "selectedPriceColor",
        elements.priceColorSelect.value
      );

      // Force style re-application
      StyleManager.applyInteractiveStyles();
    });

    elements.fontSelect.addEventListener("change", () => {
      document.body.style.fontFamily = elements.fontSelect.value;
    });

    elements.logoShadowSelect.addEventListener("change", () => {
      if (elements.logoShadowSelect.value === "interactive") {
        StyleManager.applyInteractiveStyles();
      } else {
        elements.divBackground.style.boxShadow =
          elements.logoShadowSelect.value;
        elements.divCard.style.boxShadow = elements.logoShadowSelect.value;
      }
    });

    elements.priceColorSelect.addEventListener("change", () => {
      if (elements.priceColorSelect.value === "interactive") {
        StyleManager.applyInteractiveStyles();
      } else {
        elements.priceElement.style.color = elements.priceColorSelect.value;
      }
    });

    elements.menuIcon.addEventListener("click", () => {
      elements.menu.style.display =
        elements.menu.style.display === "none" ? "block" : "none";
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

const App = {
  async initialize() {
    // 1. Initial data load
    const initialData = await DataManager.fetchData();
    if (!initialData) return;

    // 2. Update UI with fresh data
    StyleManager.updateUI(initialData.price);

    // 3. Initialize settings AFTER data is loaded
    await SettingsManager.init();

    // 4. Set up periodic updates
    setInterval(async () => {
      const newData = await DataManager.fetchData();
      if (newData) {
        StyleManager.updateUI(newData.price);
        StyleManager.applyInteractiveStyles();
      }
    }, 60000);
  },
};

// Start application
document.addEventListener("DOMContentLoaded", () => {
  App.initialize();
});
