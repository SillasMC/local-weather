let cacheName			= "localWeatherPWA-v3";
let weatherCacheName	= "weatherData-v3";
let pathName			= "weather-data";
let appShellCache		= [
	"/",
	"/index.html",
	"/404.html",
	"/js/script.js",
	"/js/register.js",
	"/js/permissions.js",
	"/css/styles.css"
];

self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Installing SW...');
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('[ServiceWorker] Caching app shell...');
			return cache.addAll(appShellCache);
		})
	);
});

self.addEventListener('activate', function(e) {
	console.log('[ServiceWorker] Activating SW...');
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (key !== cacheName && key !== weatherCacheName) {
					console.log('[ServiceWorker] Removing old cache', key);
					return caches.delete(key);
				}
			}));
		})
	);
	return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Fetch: ', e.request.url);
	var dataUrl = 'https://fcc-weather-api.glitch.me/api/current?lat=';

	if (e.request.url.startsWith(dataUrl)) { // Cache then network
		e.respondWith(
			caches.open(weatherCacheName).then(function(cache) {
				return fetch(e.request).then(function(response){
					cache.put(pathName, response.clone());
					return response;
				});
			})
		);
	}
	else { // Cache, falling back to the network
		e.respondWith(
			caches.match(e.request).then(function(response) {
				return response || fetch(e.request);
			})
		);
	}
});
