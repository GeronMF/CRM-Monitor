const CACHE_NAME = 'crm-monitor-v2';
const BASE_PATH = '/crm-monitor';
const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/src/main.tsx`,
  `${BASE_PATH}/src/App.tsx`,
  `${BASE_PATH}/src/index.css`
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  // Не кэшируем API запросы - всегда делаем свежий запрос
  if (event.request.url.includes('/api/parse-crm-data')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Для остальных запросов используем кэш
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
