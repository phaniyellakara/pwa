const app = (() => {
  Notification.requestPermission((status) => {
    console.log("Notification permission status:", status);
  });
})();
