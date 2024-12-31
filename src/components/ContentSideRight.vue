<template>
	<div class="content-side">
		<Tutorial v-if="show_tutorial" vertical />

		<hk-card v-if="$route.path.startsWith('/content/players')">
			<div class="card-header" slot="header">
				<span>
					<i class="fas fa-sync-alt" aria-hidden="true" />
					Character Sync
				</span>
			</div>
			<div class="card-body text-center">
				<p>
					Sync your player's character sheets from other resources in
					<span class="whitespace-nowrap">Shieldmaiden</span
					><span v-if="tier.price === 'Free'" class="neutral-3"> *</span>.
				</p>

				<button
					class="btn btn-block bg-green"
					@click="
						setDrawer({
							show: true,
							type: 'drawers/CharacterSync',
						})
					"
				>
					<i class="fas fa-sync-alt" aria-hidden="true" /> Start Syncing
				</button>
			</div>
			<small
				v-if="tier.price === 'Free'"
				slot="footer"
				class="card-footer justify-content-start neutral-3"
				>* <router-link to="/pricing" class="mx-1">Subscription</router-link> for Shieldmaiden
				required.</small
			>
		</hk-card>

		<!-- COMPENDIUM -->
		<hk-card v-if="$route.path.split('/')[1] !== 'content'">
			<div slot="header" class="card-header">
				<h2><i aria-hidden="true" class="fas fa-swords mr-1" /> D&D Combat tracker</h2>
			</div>
			<div class="card-body overflow-x-hidden">
				<img class="logo full-width" src="../assets/_img/logo/logo-cyan.svg" alt="Shieldmaiden" />
				<p class="neutral-2 mt-3 text-center">
					Try the most advanced initiative tracker on the internet.
				</p>
				<router-link class="btn btn-block btn-sm bg-green" to="/demo">Demo encounter</router-link>
			</div>
		</hk-card>

		<!-- CAMPAIGNS -->
		<hk-card v-if="$route.path === '/content/campaigns'">
			<div slot="header" class="card-header">
				<a :href="`https://shieldmaiden.app/user/${userId}`" target="_blank" class="neutral-1">
					Share initiative
					<i class="fas fa-external-link blue-light" aria-hidden="true" />
				</a>
				<a class="btn btn-sm bg-neutral-5" @click="setDrawer({ show: true, type: 'PlayerLink' })">
					<i aria-hidden="true" class="fas fa-qrcode" />
				</a>
			</div>
			<div class="card-body">
				<PlayerLink :qr="false" :title="false" :info="false" />
			</div>
		</hk-card>

		<!-- SUBSCRIPTION -->
		<hk-card v-if="user && tier && $route.path.split('/')[1] === 'content'" small>
			<div slot="header" class="card-header">
				Subscription
				<hk-popover
					v-if="pending_payment"
					header="Pending"
					content="Your Patreon payment is pending, this might take a few minutes."
				>
					Pending <i class="fas fa-sync ml-1 blue spin" aria-hidden="true" />
				</hk-popover>
				<strong v-else>{{ tier.name }}</strong>
			</div>
			<q-linear-progress
				v-if="tier.name !== 'Deity'"
				:value="slots_used.used_slots / slots_used.available_slots"
				color="neutral-4"
				track-color="neutral-11"
			/>
			<div>
				<Tier />
			</div>
			<PatreonLinkButton v-if="userInfo.patron && !userInfo.patreon_id" />
			<router-link
				v-else-if="tier.name !== 'Deity'"
				slot="footer"
				to="/pricing"
				class="btn btn-block btn-square bg-patreon-red"
			>
				{{ tier.price === "Free" ? "Subscribe" : "Upgrade" }}
			</router-link>
		</hk-card>

		<!-- HOMEBREW CREATION -->
		<hk-card>
			<div
				slot="image"
				class="card-image"
				:style="{ backgroundImage: `url(${require('src/assets/_img/homebrew-creation.webp')})` }"
			>
				<div class="image-title">Homebrew creation</div>
			</div>
			<div class="card-body">
				<p class="text-center">
					Need a free adventure template, homebrew content or DMing inspiration?
				</p>
				<a
					class="btn btn-block btn-sm"
					href="http://homebrewcreation.com"
					rel="noopener"
					target="_blank"
				>
					Checkout HBC <hk-icon icon="fas fa-external-link" class="ml-2" />
				</a>
			</div>
		</hk-card>

		<!-- SOCIAL -->
		<hk-card small header="Join our community">
			<div class="card-body">
				<a
					class="btn btn-block bg-neutral-8 mb-3"
					href="https://discord.gg/fhmKBM7"
					target="_blank"
					rel="noopener"
				>
					<i aria-hidden="true" class="fab fa-discord discord-purple mr-2" /> Discord
				</a>
				<p class="neutral-2 text-center">
					Join others on our Discord and be amongst the first to know about new updates.
				</p>
				<hr />
				<div class="social d-flex justify-content-between">
					<a
						v-for="{ name, icon, url } in social_media"
						class="btn bg-neutral-8"
						:class="{ 'btn-sm': width < 240 }"
						:key="name"
						:href="url"
						target="_blank"
						rel="noopener"
					>
						<i aria-hidden="true" :class="icon" />
					</a>
				</div>
			</div>
		</hk-card>
		<q-resize-observer @resize="setWidth" />
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { extensionInstalled } from "src/utils/generalFunctions";

export default {
	name: "ContentSideRight",
	props: {
		page: String,
	},
	components: {
		PlayerLink: () => import("src/components/PlayerLink"),
		Tier: () => import("src/components/userContent/Tier"),
		Tutorial: () => import("src/components/userContent/Tutorial.vue"),
		PatreonLinkButton: () => import("src/components/PatreonLinkButton.vue"),
	},
	data() {
		return {
			width: 0,
			userId: this.$store.getters.user ? this.$store.getters.user.uid : undefined,
			hasExtension: false,
			social_media: [
				{
					name: "Patreon",
					icon: "fab fa-patreon patreon-red",
					url: "https://www.patreon.com/shieldmaidenapp",
				},
				{
					name: "Instagram",
					icon: "fab fa-instagram",
					url: "https://www.instagram.com/shieldmaidenapp",
				},
				{
					name: "Twitter",
					icon: "fab fa-twitter",
					url: "https://twitter.com/shieldmaidenapp",
				},
				{
					name: "Facebook",
					icon: "fab fa-facebook-f",
					url: "https://www.facebook.com/shieldmaidenapp",
				},
			],
		};
	},
	computed: {
		...mapGetters(["user", "tier", "slots_used", "userInfo", "content_count"]),
		filtered_content() {
			return this.content.filter((item) => item.value !== this.page);
		},
		pending_payment() {
			return (
				this.userInfo &&
				this.userInfo.patron &&
				this.userInfo.patron.last_charge_status === "Pending"
			);
		},
		show_tutorial() {
			return (
				this.$route.path.split("/")[1] === "content" &&
				this.$route.path !== "/content/campaigns" &&
				this.content_count.campaigns &&
				(!this.content_count.players || !this.content_count.encounters)
			);
		},
	},
	methods: {
		...mapActions(["setDrawer"]),
		setWidth(size) {
			this.width = size.width;
		},
	},
	async mounted() {
		if (this.$route.path.startsWith("/content/players")) {
			this.hasExtension = await extensionInstalled();
		}
	},
};
</script>

<style lang="scss" scoped>
.hk-card {
	.card-image {
		min-height: 100px;
		display: flex;
		align-items: center;

		.image-title {
			font-size: 30px;
			line-height: 35px;
			opacity: 1;
			font-weight: bold;
			text-shadow: 2px 2px 5px $black;
		}
	}
}
</style>
