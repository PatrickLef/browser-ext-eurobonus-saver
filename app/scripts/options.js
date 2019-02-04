const saveEuroBonusNumber = e => {
  browser.storage.sync.set({
    euroBonusNumber: event.target.value
  });
};

const saveStoreNotification = e => {
  browser.storage.sync.set({
    storeNotification: event.target.checked
  });
};

const restoreOptions = () => {
  browser.storage.sync.get("euroBonusNumber").then(res => {
    if (res.euroBonusNumber) {
      document.querySelector('input[name="euroBonusNumber"]').value =
        res.euroBonusNumber;
    }
  });

  browser.storage.sync.get("storeNotification").then(res => {
    console.dir(res);
    document.querySelector('input[name="storeNotification"]').checked =
      res.storeNotification === false ? false : true;
  });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document
  .querySelector('input[name="euroBonusNumber"]')
  .addEventListener("change", saveEuroBonusNumber);

document
  .querySelector('input[name="storeNotification"]')
  .addEventListener("change", saveStoreNotification);
