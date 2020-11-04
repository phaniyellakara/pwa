const pwaApp = (() => {
  "use strict";

  let isSubscribed = false;
  let swRegistration = null;

  const notifyBtn = document.querySelector('.notify-btn');
  const triggerBtn = document.querySelector('.trigger-push-btn');

  // Notification API
  // 1. Check for the support
  if (!("Notification" in window)) {
    console.log("Notifications not supported in this browser");
    return;
  }
  // 2. Request permission
  Notification.requestPermission((status) => {
    console.log("Notification permission status:", status);
  });
  // 3. Display Notification
  function displayNotification() {
    if (Notification.permission == "granted") {
      navigator.serviceWorker.getRegistration().then((reg) => {
        const options = {
          body: "First notification!",
          tag: "id1",
          icon: "images/notification-flat.png",
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
          },
          actions: [
            {
              action: "explore",
              title: "Go to the site",
              icon: "images/checkmark.png",
            },
            {
              action: "close",
              title: "Close the notification",
              icon: "images/xmark.png",
            },
          ],
        };
        reg.showNotification("Hello world!", options);
      });
    }
  }

  notifyBtn.addEventListener("click", () => {
    displayNotification();
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      console.log("Service Worker and Push is supported");

      navigator.serviceWorker
        .register("service-worker.js", { scope: "/pwa/" })
        .then((swReg) => {
          console.log("Service Worker is registered", swReg);

          swRegistration = swReg;

          initializeUI();
        })
        .catch((err) => {
          console.error("Service Worker Error", err);
        });
    });
  } else {
    console.warn("Push messaging is not supported");
    pushButton.textContent = "Push Not Supported";
  }

  triggerBtn.addEventListener('click', triggerPushNotification);
  function triggerPushNotification() {
    const payload = document.getElementById('push-notification-data').value;
    return fetch('https://py-nodeapi.herokuapp.com/api/trigger-push-msg/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: {}, payload: payload, delay: '2', ttl: '3',
      })
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('Bad status code from server.');
      }
      return response.json();
    }).then(function (responseData) {
      if (!(responseData.data && responseData.data.success)) {
        throw new Error('Bad response from server.');
      }
    });
  }
})();
