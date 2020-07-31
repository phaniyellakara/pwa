self.addEventListener("notificationclose", (event) => {
  const notification = event.notification;
  const primaryKey = notification.data.primaryKey;

  console.log("Closed notification: " + primaryKey);
});

self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  const primaryKey = notification.data.primaryKey;
  const action = event.action;

  if (action === "close") {
    notification.close();
  } else {
    event.waitUntil(
      clients.matchAll().then((clis) => {
        const client = clis.find((c) => {
          return c.visibilityState === "visible";
        });
        if (client !== undefined) {
          client.navigate("pages/page" + primaryKey + ".html");
          client.focus();
        } else {
          // there are no visible windows. Open one.
          clients.openWindow("pages/page" + primaryKey + ".html");
          notification.close();
        }
      })
    );
  }

  self.registration.getNotifications().then((notifications) => {
    notifications.forEach((notification) => {
      notification.close();
    });
  });
});

self.addEventListener("push", (event) => {
  let body;

  if (event.data) {
    body = event.data.text();
  } else {
    body = "Default body";
  }

  const options = {
    body: body,
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
  event.waitUntil(
    clients.matchAll().then((c) => {
      console.log(c);
      if (c.length === 0) {
        // Show notification
        self.registration.showNotification("Push Notification", options);
      } else {
        // Send a message to the page to update the UI
        console.log("Application is already open!");
      }
    })
  );
});
