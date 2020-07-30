(function () {
  if (!("serviceWorker" in navigator)) {
    console.log("Service worker not supported");
    return;
  }
  navigator.serviceWorker
    .register("../service-worker.js")
    .then(function (registration) {
      console.log("SW successfully registered");
    })
    .catch(function (error) {
      console.log("registration failed", error);
    });
})();
