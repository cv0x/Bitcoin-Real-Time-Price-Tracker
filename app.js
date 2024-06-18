//rev: why is vaalue set to "document.getElementById("btc-price")"? is it not always null? Create an empty variable like btcPriceChangePercentage7dElement and group it together
let btcPriceElement = document.getElementById("btc-price");
//rev: change type to constant and use name convention for constants- API_URL = "..."
let apiUrl = "https://api.coingecko.com/api/v3/coins/bitcoin";

let btcPriceChangePercentage7dElement;

//Function for data acquisition
async function getData() {
  try {
    const response = await fetch(apiUrl);
    //rev: thic part is pointless. just return data.json() and why is there await?
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}
// Function to refresh the image
function refreshImage() {
  var imageElement = document.getElementById("btc-image");
  //rev: useless code
  var imageUrl = imageElement.src;

  // Adding a random parameter to the image URL ensures that the image is always reloaded
  //rev: imageElement.src = `${imageElement.src}?timestamp=${new Date().getTime()}`;
  imageElement.src = imageUrl + "?timestamp=" + new Date().getTime();
}

//rev: why is here a random code between function declerations? group the code that is not a function together
// Update img every 1h
setInterval(refreshImage, 3600000);

// Functions for displaying data
async function showData() {
  const data = await getData();
  if (data) {
    //displaying the current price of btc
    const currentPriceUSD = data.market_data.current_price.usd;
    btcPriceElement.innerText = currentPriceUSD + " $";

    //displaying ship if price 99k - 110k
    if (currentPriceUSD >= 99000 && currentPriceUSD <= 110000) {
      document.querySelector(".tothemoon img").style.display = "block";
      document.querySelector(".btc-backgound").style.display = "none";
      document.querySelector("#btc-logo").style.display = "none";
    }
    //displaying moon if price 100k - 110k
    if (currentPriceUSD >= 100000 && currentPriceUSD <= 110000) {
      document.querySelector(".moon img").style.display = "block";
    }
    //stores data on whether btc is in the plus for the last 7 days
    const priceChangePercentage7d = data.market_data.price_change_percentage_7d;
    btcPriceChangePercentage7dElement = priceChangePercentage7d;
  }
}

//rev: why is here a random code between function declerations? group the code that is not a function together
showData();
// Update data every 1min
setInterval(showData, 60000);

//chang interactive color according price change percentage 7d
const getInteractiveColor = () => {
  return btcPriceChangePercentage7dElement > 0 ? "green" : "red";
};

//rev: you dont need to do everything inside this content loaded event, only fetch the references and save them somewhere
//rev: maybe you can have an object with all values which gets set here and then calls a function to set the events
//rev: example:
const dataFromDocument = {}

document.addEventListener("DOMContentLoaded", function () {
  dataFromDocument.fontSelect = document.getElementById("font-family");
  dataFromDocument.logoShadowSelect = document.getElementById("logo-shadow");
  dataFromDocument.priceColorElement = document.querySelector("#btc-price");
  dataFromDocument.priceColorSelect = document.getElementById("price-color");
  dataFromDocument.divBackground = document.querySelector(".btc-backgound");
  dataFromDocument.divCard = document.querySelector(".card");
  dataFromDocument.saveButton = document.getElementById("save");

  updateDocumentEvents()
})

const updateDocumentEvents = () => {
  dataFromDocument.saveButton.addEventListener("click", function () {
    const selectedFont = dataFromDocument.fontSelect.value;
    const selectedLogoShadow = dataFromDocument.logoShadowSelect.value;
    const selectedPriceColor = dataFromDocument.priceColorSelect.value;

    //Set style for the elements
    document.body.style.fontFamily = selectedFont;
    divBackground.style.boxShadow = selectedLogoShadow;
    divCard.style.boxShadow = selectedLogoShadow;
    priceColorElement.style.color = selectedPriceColor;

    //Store the selected font in memory
    localStorage.setItem("selectedFont", selectedFont);
    localStorage.setItem("selectedFontShadow", selectedLogoShadow);
    localStorage.setItem("selectedPriceColor", selectedPriceColor);
  });
  //...
  //...
}
//



document.addEventListener("DOMContentLoaded", function () {
  const fontSelect = document.getElementById("font-family");
  const logoShadowSelect = document.getElementById("logo-shadow");
  const priceColorElement = document.querySelector("#btc-price");
  const priceColorSelect = document.getElementById("price-color");
  const divBackground = document.querySelector(".btc-backgound");
  const divCard = document.querySelector(".card");
  const saveButton = document.getElementById("save");

  // Function to save the selected font,shadow,color
  saveButton.addEventListener("click", function () {
    const selectedFont = fontSelect.value;
    const selectedLogoShadow = logoShadowSelect.value;
    const selectedPriceColor = priceColorSelect.value;

    //Set style for the elements
    document.body.style.fontFamily = selectedFont;
    divBackground.style.boxShadow = selectedLogoShadow;
    divCard.style.boxShadow = selectedLogoShadow;
    priceColorElement.style.color = selectedPriceColor;

    //Store the selected font in memory
    localStorage.setItem("selectedFont", selectedFont);
    localStorage.setItem("selectedFontShadow", selectedLogoShadow);
    localStorage.setItem("selectedPriceColor", selectedPriceColor);
  });

  /* --- FONT FAMILY --- */
  //Load saved font on page load
  const savedFont = localStorage.getItem("selectedFont");
  if (savedFont) {
    document.body.style.fontFamily = savedFont;
    fontSelect.value = savedFont;

    fontSelect.addEventListener("change", function () {
      const selectedFont = fontSelect.value;
      document.body.style.fontFamily = selectedFont;
    });
  }

  /* --- LOGO AND CARD SHADOW --- */
  //Load saved card and logo shadow on page
  const savedLogoShadow = localStorage.getItem("selectedFontShadow");
  if (savedLogoShadow === "interactive") {
    divBackground.style.boxShadow = `0 0 20px ${getInteractiveColor()}`;
    divCard.style.boxShadow = `0 0 20px ${getInteractiveColor()}`;
  } else {
    divBackground.style.boxShadow = `0 0 20px ${savedLogoShadow}`;
    divCard.style.boxShadow = `0 0 20px ${savedLogoShadow}`;
  }
  logoShadowSelect.value = savedLogoShadow;

  //Displayed during selection
  logoShadowSelect.addEventListener("change", function () {
    const selectedLogoShadow =
      logoShadowSelect.value === "interactive"
        ? getInteractiveColor()
        : logoShadowSelect.value;
    if (selectedLogoShadow === "0") {
      divBackground.style.boxShadow = "none";
      divCard.style.boxShadow = "none";
    } else {
      divBackground.style.boxShadow = `0 0 20px ${selectedLogoShadow}`;
      divCard.style.boxShadow = `0 0 20px ${selectedLogoShadow}`;
    }
  });

  /* --- PRICE COLOR --- */
  //Load saved price color on page
  priceColorSelect.addEventListener("change", function () {
    const selectedPriceColor =
      priceColorSelect.value === "interactive"
        ? getInteractiveColor()
        : priceColorSelect.value;
    priceColorElement.style.color = selectedPriceColor;
  });
  // Retrieving the saved text color on page
  const savedPriceColor = localStorage.getItem("selectedPriceColor");
  if (savedPriceColor === "interactive") {
    priceColorElement.style.color = getInteractiveColor();
    priceColorSelect.value = savedPriceColor;
  } else {
    priceColorElement.style.color = savedPriceColor;
    priceColorSelect.value = savedPriceColor;
  }

  //Toggle icon menu
  const menuIcon = document.getElementById("menu-icon");
  const menu = document.querySelector(".menu");

  menuIcon.addEventListener("click", function () {
    menu.style.display =
      menu.style.display === "none" || menu.style.display === ""
        ? "block"
        : "none";
  });

  // Check if the date is 22.05 (btc pizza day)
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;

  if (day === 22 && month === 5) {
    document.querySelector(".pizzaday img").style.display = "block";
    document.querySelector("#btc-logo").style.display = "none";
  }
});
