const app = (() => {
  "use strict";

  let isSubscribed = false;
  let swRegistration = null;

  Notification.requestPermission((status) => {
    console.log("Notification permission status:", status);
  });

  if (!("Notification" in window)) {
    console.log("Notifications not supported in this browser");
  }

  if (!("serviceWorker" in navigator)) {
    console.log("Service worker not supported");
  } else {
    // window.addEventListener("load", () => {});
    // , { scope: "/pwa/" }
    navigator.serviceWorker
      .register("service-worker.js", { scope: "/pwa/" })
      .then(function (swReg) {
        console.log("SW successfully registered");
        swRegistration = swReg;
      })
      .catch(function (error) {
        console.log("registration failed", error);
      });
  }
})();
