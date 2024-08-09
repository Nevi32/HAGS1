// public/service-worker.js

const CACHE_NAME = 'hags-app-cache-v1';
const OFFLINE_URL = '/offline.html';
const urlsToCache = [
  '/',
  '/index.html',
  OFFLINE_URL,
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/js/bundle.js',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  // Add other static assets, CSS files, and JavaScript files
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request.url).catch(error => {
        return caches.match(OFFLINE_URL);
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request)
            .then((response) => {
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
              return response;
            })
            .catch((error) => {
              // Handle API call errors when offline
              console.error('Fetch failed; returning offline page instead.', error);
              return caches.match(OFFLINE_URL);
            });
        })
    );
  }
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
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

// Handle data synchronization
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  const syncableItems = await getSyncableItems();
  
  for (const item of syncableItems) {
    try {
      await sendItemToServer(item);
      await markItemSynced(item.id);
    } catch (error) {
      console.error('Failed to sync item:', error);
    }
  }

  // Notify the app that sync is complete
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage({ type: 'SYNC_COMPLETE' }));
  });
}

async function getSyncableItems() {
  // Retrieve items from IndexedDB that need to be synced
  // This is a placeholder and should be implemented based on your data structure
  return [];
}

async function sendItemToServer(item) {
  // Send item to server
  // This is a placeholder and should be implemented based on your API
  return fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
}

async function markItemSynced(itemId) {
  // Mark item as synced in IndexedDB
  // This is a placeholder and should be implemented based on your data structure
}