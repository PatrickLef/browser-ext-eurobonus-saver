browser.runtime.onInstalled.addListener(details => {
  fetch("https://eurobonusexpert.com/onlineshopping.json")
    .then(res => res.json())
    .then(json => {
      browser.storage.local.set({ stores: json.stores });
    });
});

browser.tabs.onUpdated.addListener(async (tabId, _, tab) => {
  browser.pageAction.hide(tabId);

  const onGot = ({ stores }) => {
    const store = stores.find(store => tab.url.startsWith(store.storeUrl));
    if (store) {
      browser.pageAction.show(tabId);

      browser.storage.sync
        .get(["storeNotification"])
        .then(({ storeNotification }) => {
          if (storeNotification) {
            browser.notifications.create(
              `3eurobonus-notification-${store._id}`,
              {
                type: "basic",
                iconUrl: browser.extension.getURL("images/icon-128.png"),
                title: "Save EuroBonus points on this page!",
                message: `${
                  store.name
                } is part of the EuroBonus savings program. 🍾💰`
              }
            );
          }
        });
    }
  };

  browser.storage.local.get("stores").then(onGot);
});
