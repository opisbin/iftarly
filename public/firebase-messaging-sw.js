/*
  Placeholder Firebase Messaging service worker.
  This file prevents 404s when any client code/tooling probes
  /firebase-messaging-sw.js.
*/

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
