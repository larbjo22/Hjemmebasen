/* Service worker for push-varsler (Firebase Cloud Messaging).
   Må ligge i rota så scope blir «/». Bruker compat-SDK-et, som er det
   FCM sin bakgrunnslytter forventer i en service worker.
   Config er offentlig by design (samme som felles/firebase-init.js). */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBvC7SSwjBtqWDB-OQEdKFMOV54fQtQQOw',
  authDomain: 'hjemmebasen-12fc3.firebaseapp.com',
  projectId: 'hjemmebasen-12fc3',
  messagingSenderId: '375213042887',
  appId: '1:375213042887:web:7ce764c20c3739e0bf62e2',
});

const messaging = firebase.messaging();

// Varsel når appen er lukket / i bakgrunnen
messaging.onBackgroundMessage(payload => {
  const n = payload.notification || {};
  self.registration.showNotification(n.title || 'Hjemmebasen', {
    body: n.body || '',
    icon: 'ikoner/ikon-192.png',
    badge: 'ikoner/ikon-192.png',
    data: { url: (payload.data && payload.data.url) || 'index.html' },
  });
});

// Åpne appen når brukeren trykker på varselet
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || 'index.html';
  event.waitUntil(clients.openWindow(url));
});
