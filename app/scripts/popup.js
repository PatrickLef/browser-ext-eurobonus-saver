const getMarketId = store => {
  return { dk: 1, se: 2, no: 3, fi: 4 }[store.market];
};

const bindLinks = () => {
  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    (function() {
      var ln = links[i];
      var location = ln.href;
      ln.onclick = function() {
        browser.tabs.create({ url: location });
      };
    })();
  }
};

const templatePopupStore = ({ store, euroBonusNumber }) => {
  document.getElementById("store-name").innerHTML = store.name;
  document.getElementById("store-description").innerHTML = store.description;
  document.getElementById("store-points").innerHTML = store.points;
  document.getElementById("store-per-currency-value").innerHTML =
    store.perCurrencyValue;
  const sasStoreId = store.url.match(
    /https\:\/\/onlineshopping\.flysas\.com\/[a-z]+\/(.*)\/([0-9]+)/
  )[2];
  document.getElementById(
    "store-url"
  ).href = `https://gcp.loyaltykey.com/shopredirect/${sasStoreId}/?MemberId=${euroBonusNumber}&Affiliate=1&CampaignId=0&CountryId=${getMarketId(
    store
  )}&ServiceId=1&CookiesEnabled=1&Target=0&LoggedIn=1`;
  if (store.singleUse) {
    document.getElementById("store-single-use").style.visibility = "visible";
  }

  bindLinks();

  if (!euroBonusNumber || euroBonusNumber === "") {
    document.getElementById("store-url").style.display = "none";
    document.getElementById("settings").style.display = "block";
    document.getElementById("wrapper").style.display = "block";
  } else {
    document.getElementById("wrapper").style.display = "block";
  }
};

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  const tab = tabs[0];

  browser.storage.local.get("stores").then(({ stores }) => {
    const store = stores.find(store => tab.url.startsWith(store.storeUrl));
    if (!store) {
      return;
    }

    browser.storage.sync.get(["euroBonusNumber"]).then(res => {
      templatePopupStore({
        store,
        euroBonusNumber: res.euroBonusNumber,
        storeNotification: res.storeNotification
      });
    });
  });
});
