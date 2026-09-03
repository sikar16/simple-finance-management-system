// Service worker for Firebase Cloud Messaging
// This file will be updated by the Firebase SDK during build time

self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.notification?.body || '',
    icon: '/icon.png',
    badge: '/badge.png',
    data: {
      url: data.fcmOptions?.link || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.notification?.title || 'Notification', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});