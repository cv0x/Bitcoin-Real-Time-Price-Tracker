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

document.addEventListener("DOMContentLoaded", function () {
  const fontSelect = document.getElementById("font-family");
  const fontShadow = document.getElementById("font-shadow");
  const saveButton = document.getElementById("save");

  // Function to save the selected font
  saveButton.addEventListener("click", function () {
    const selectedFont = fontSelect.value;
    document.body.style.fontFamily = selectedFont;

    //Store the selected font in memory
    localStorage.setItem("selectedFont", selectedFont);
  });

  //Load saved font on page load
  const savedFont = localStorage.getItem("selectedFont");
  if (savedFont) {
    document.body.style.fontFamily = savedFont;
    fontSelect.value = savedFont;
  }

  fontSelect.addEventListener("change", function () {
    const selectedFont = fontSelect.value;
    //Set the selected font
    document.body.style.fontFamily = selectedFont;
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
