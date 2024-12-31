<template>
	<div id="q-app" :class="{ home: $route.name === 'home' }" @click="setSideSmallScreen(false)">
		<div>
			<Header v-if="$route.name !== 'home' || ($route.name === 'home' && user)" />
			<div class="offline" v-if="connection === 'offline'">
				<i aria-hidden="true" class="fas fa-wifi-slash mr-1"></i> No internet connection
			</div>
			<div :class="{ hasSide: $route.meta.sidebar !== false || ($route.name === 'home' && user) }">
				<Sidebar
					v-if="
						(!small_screen && $route.name === 'home' && user) ||
						(!small_screen && $route.meta.sidebar !== false) ||
						$store.getters.side_small_screen
					"
					:small-screen="small_screen"
				/>
				<div
					:is="$route.name === 'home' ? 'div' : 'q-scroll-area'"
					class="scrollable-content"
					:dark="$store.getters.theme === 'dark'"
					:thumb-style="{ width: '5px' }"
				>
					<router-view />
				</div>
			</div>
		</div>
		<transition
			enter-active-class="animated animate__slideInRight"
			leave-active-class="animated animate__slideOutRight"
		>
			<div v-if="drawer.show == true" class="drawer-wrapper">
				<Drawer />
			</div>
		</transition>

		<q-no-ssr>
			<vue-snotify />
			<HkRolls />
		</q-no-ssr>
		<q-resize-observer @resize="setSize" />
	</div>
</template>

<script>
import { db } from "./firebase";
import Header from "./components/header";
import Sidebar from "./components/Sidebar.vue";
import Drawer from "./components/Drawer.vue";
import { mapActions, mapGetters } from "vuex";
import HkRolls from "./components/hk-components/hk-rolls";
import { general } from "./mixins/general";

import { Cookies } from "quasar";
import jwt_decode from "jwt-decode";

export default {
	name: "App",
	mixins: [general],
	components: {
		Header,
		Sidebar,
		Drawer,
		HkRolls,
	},
	async preFetch({ store, ssrContext }) {
		const cookies = Cookies.parseSSR(ssrContext);
		const access_token = cookies.get("access_token");
		if (!access_token) return;

		const user = jwt_decode(access_token);
		if (!user && !user.user_id) return;

		const transform = {
			uid: "user_id",
			displayName: "name",
			photoURL: "picture",
			email: "email",
			emailVerified: "email_verified",
		};

		const transformed_user = {};
		for (const [k, v] of Object.entries(transform)) {
			transformed_user[k] = user[v];
		}

		await store.dispatch("setUser", transformed_user);
		await store.dispatch("setUserInfo");
		await store.dispatch("initialize");
	},
	meta() {
		const meta = {
			title: {
				name: "title",
				content:
					this.$route.meta.title || "D&D Combat Tracker - Advanced initiative tracker for D&D 5e",
			},
			description: {
				name: "description",
				content:
					this.$route.meta.description ||
					"The ultimate D&D 5e DM companion app. Manage encounters, track combat & health bars, import D&D Beyond characters, and much more. Use Shieldmaiden for free now!",
			},

			// TWITTER
			twitterCard: {
				property: "twitter:card",
				content: "summary",
			},
			twitterTitle: {
				name: "twitter:title",
				content:
					this.$route.meta.title || "D&D Combat Tracker - Advanced initiative tracker for D&D 5e",
			},
			twitterDescription: {
				name: "twitter:description",
				content:
					this.$route.meta.description ||
					"The ultimate D&D 5e DM companion app. Manage encounters, track combat & health bars, import D&D Beyond characters, and much more. Use Shieldmaiden for free now!",
			},
			twitterImage: {
				name: "twitter:image",
				content: "https://shieldmaiden.app/shieldmaiden-combat-tracker.png",
			},
			twitterSite: {
				name: "twitter:site",
				content: "@ShieldmaidenApp",
			},

			// OG
			ogTitle: {
				property: "og:title",
				content:
					this.$route.meta.title || "D&D Combat Tracker - Advanced initiative tracker for D&D 5e",
			},
			ogDescription: {
				property: "og:description",
				content:
					this.$route.meta.description ||
					"The ultimate D&D 5e DM companion app. Manage encounters, track combat & health bars, import D&D Beyond characters, and much more. Use Shieldmaiden for free now!",
			},
			ogSiteName: {
				property: "og:site_name",
				content: "Shieldmaiden",
			},
			ogType: {
				property: "og:type",
				content: "website",
			},
			ogUrl: {
				property: "og:url",
				content: `https://shieldmaiden.app${this.$route.path}`,
			},
			ogImage: {
				property: "og:image",
				content: "https://shieldmaiden.app/shieldmaiden-combat-tracker.png",
			},
			ogImageType: {
				property: "og:image:type",
				content: "image/png",
			},
			ogImageAlt: {
				property: "og:image:alt",
				content: "Shieldmaiden Logo",
			},
		};

		// NoIndex on non-production environments
		if (process.env.VUE_APP_ENV_NAME !== "live") {
			meta.noindex = {
				name: "robots",
				content: "noindex, nofollow",
			};
		}

		return {
			title:
				this.$route.meta.title || "D&D Combat Tracker - Advanced initiative tracker for D&D 5e",
			titleTemplate: (title) => `${title} | Shieldmaiden`,
			link: {
				canonical: {
					rel: "canonical",
					href: `https://shieldmaiden.app${this.$route.path}`,
				},
			},
			meta: meta,
		};
	},
	data() {
		return {
			width: 0,
			small_screen: true,
			broadcast: undefined,
			connection: process.browser && !navigator.onLine ? "offline" : "online",
		};
	},
	watch: {
		broadcast: {
			handler(newVal, oldVal) {
				// If there was a broadcast but it's disconnected
				// But there still is a broadcast in the store
				// Notify the user and let them restart the broadcast
				if (
					oldVal &&
					oldVal.live &&
					!newVal &&
					this.storeBroadcast &&
					Object.keys(this.storeBroadcast).length > 0
				) {
					this.$q.notify({
						message: "Broadcast interrupted",
						caption: "Would you like to continue your broadcast?",
						color: "red",
						position: "top",
						timeout: 0,
						icon: "far fa-dot-circle",
						actions: [
							{
								label: "Yes",
								color: "white",
								handler: () => {
									db.ref(`broadcast/${this.user.uid}`).set(oldVal);
								},
							},
							{
								label: "No",
								color: "white",
								handler: () => {
									this.setLive({ campaign_id: oldVal.live });
								},
							},
						],
					});
				}
			},
			deep: true,
		},
	},
	computed: {
		...mapGetters({
			drawer: "getDrawer",
			storeBroadcast: "broadcast",
		}),
		...mapGetters(["initialized", "theme", "user", "action_rolls"]),
	},
	async mounted() {
		this.setTips();
		if (this.user) {
			const broadcastRef = db.ref(`broadcast/${this.user.uid}`);
			broadcastRef.on("value", (snapshot) => {
				this.broadcast = snapshot.val();
				this.$forceUpdate();
			});
		}

		window.addEventListener("offline", () => {
			this.connection = "offline";
		});
		window.addEventListener("online", () => {
			this.connection = "online";
		});
	},
	destroyed() {
		window.removeEventListener("offline", () => {
			this.connection = "offline";
		});
		window.removeEventListener("online", () => {
			this.connection = "online";
		});
	},
	methods: {
		...mapActions([
			"setSideSmallScreen",
			"setLive",
			"initialize",
			"reinitialize",
			"setUser",
			"setTips",
		]),
		setSize(size) {
			this.small_screen = size.width < 576;
			this.width = size.width;
		},
	},
};
</script>

<style lang="scss" scoped>
#q-app {
	padding-top: $header-height;

	&.home {
		padding-top: 0;

		.scrollable-content {
			height: 100vh;
		}

		#sidebar {
			top: $header-height;
		}
	}
}
</style>
