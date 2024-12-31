/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */
self.addEventListener("message", (event) => {
	if (
		event.origin !== "https://shieldmaiden.app" &&
		event.origin !== "https://staging.shieldmaiden.app"
	)
		return;

	if (event.data && event.data.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});

workbox.core.setCacheNameDetails({ prefix: "shieldmaiden" });

// Precache array of routes (precacheManifest = this array)
// https://developers.google.com/web/tools/workbox/modules/workbox-precaching
self.__precacheManifest = [{ url: "/200.html", revision: Date.now() }].concat(
	self.__precacheManifest || []
);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// This assumes /200.html has been precached.
// https://developers.google.com/web/tools/workbox/modules/workbox-routing#how_to_register_a_navigation_route
workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("200.html"), {
	blacklist: [
		/^\/compendium/,
		/^\/admin/,
		/^\/pricing/,
		/^\/user/,
		/^\/about-us/,
		/^\/documentation/,
		/^\/privacy-policy/,
		/^\/demo/,
	],
});
