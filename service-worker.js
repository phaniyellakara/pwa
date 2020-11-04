console.log("Service worker waking up! 😴 ");

const filesToCache = [
  "/",
  "manifest.json",
  "images/checkmark.png",
  "images/notification-flat.png",
  "images/xmark.png",
  "js/main.js",
  "index.html",
  "pages/offline.html",
  "pages/404.html",
];

const staticCacheName = "pages-cache-v2";

// For installability
self.addEventListener("install", (event) => {
  console.log("Service worker installed! 👍");
  // skipWaiting();
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

// for activating the latest service worker
self.addEventListener("activate", (event) => {
  console.log("Service worker activated! 😁");
  const cacheWhitelist = [staticCacheName];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log("Fetch event for ", event.request.url);
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          console.log("Found ", event.request.url, " in cache");
          return response;
        }
        console.log("Network request for ", event.request.url);
        return fetch(event.request).then((response) => {
          if (response.status === 404) {
            return caches.match("pages/404.html");
          }
          return caches.open(staticCacheName).then((cache) => {
            cache.put(event.request.url, response.clone());
            return response;
          });
        });
      })
      .catch((error) => {
        console.log("Error, ", error);
        return caches.match("pages/offline.html");
      })
  );
});

// Notification api events - notificationclose
self.addEventListener("notificationclose", (event) => {
  const notification = event.notification;
  const primaryKey = notification.data.primaryKey;

  console.log("Closed notification: " + primaryKey);
});

// Notification api events - notificationcilck
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
