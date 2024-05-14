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

// Update BTC price every 1min
setInterval(fetchBtcPrice, 60000);

document.addEventListener("DOMContentLoaded", function () {
  const fontSelect = document.getElementById("font-family");
  const fontShadowSelect = document.getElementById("logo-shadow");
  const targetDiv = document.querySelector(".btc-backgound");
  const saveButton = document.getElementById("save");

  // Function to save the selected font
  saveButton.addEventListener("click", function () {
    const selectedFont = fontSelect.value;
    const selectedFontShadow = fontShadowSelect.value;

    document.body.style.fontFamily = selectedFont;
    targetDiv.style.boxShadow = selectedFontShadow;

    //Store the selected font in memory
    localStorage.setItem("selectedFont", selectedFont);
    localStorage.setItem("selectedFontShadow", selectedFontShadow);
  });

  //Load saved font on page load
  const savedFont = localStorage.getItem("selectedFont");
  if (savedFont) {
    document.body.style.fontFamily = savedFont;
    fontSelect.value = savedFont;
  }

  const savedFontShadow = localStorage.getItem("selectedFontShadow");
  if (savedFontShadow) {
    targetDiv.style.boxShadow = `0 0 50px ${savedFontShadow}`;
    fontShadowSelect.value = savedFontShadow;
  }

  fontSelect.addEventListener("change", function () {
    const selectedFont = fontSelect.value;
    document.body.style.fontFamily = selectedFont;
  });

  fontShadowSelect.addEventListener("change", function () {
    const selectedFontShadow = fontShadowSelect.value;
    if (selectedFontShadow === "0") {
      targetDiv.style.boxShadow = "none";
    } else {
      targetDiv.style.boxShadow = `0 0 50px ${selectedFontShadow}`;
    }
  });

  //Toggle icon menu
  const menuIcon = document.getElementById("menu-icon");
  const menu = document.querySelector(".menu");

  menuIcon.addEventListener("click", function () {
    menu.style.display =
      menu.style.display === "none" || menu.style.display === ""
        ? "block"
        : "none";
  });
});
