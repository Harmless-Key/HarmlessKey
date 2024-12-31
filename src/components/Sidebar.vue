<template>
	<transition
		enter-active-class="animated animate__slideInLeft"
		leave-active-class="animated animate__slideOutLeft"
	>
		<div
			@click.stop=""
			id="sidebar"
			:class="{
				'side-collapsed':
					($store.getters.side_collapsed && !smallScreen && $route.meta.sidebar !== false) ||
					($store.getters.side_collapsed && !smallScreen && $route.name === 'home'),
				slideIn: $route.meta.sidebar === false && $route.name !== 'home',
			}"
		>
			<div>
				<template v-if="$store.getters.user">
					<h3>DM Content</h3>
					<q-list @click="setSideSmallScreen(false)">
						<q-item clickable v-ripple to="/content/campaigns">
							<q-item-section avatar>
								<i aria-hidden="true" class="fas fa-dungeon" />
							</q-item-section>
							<q-item-section class="title">Campaigns</q-item-section>
							<q-tooltip
								v-if="$store.getters.side_collapsed"
								anchor="center right"
								self="center left"
							>
								Campaigns
							</q-tooltip>
						</q-item>
						<q-item clickable v-ripple to="/content/players">
							<q-item-section avatar>
								<i aria-hidden="true" class="fas fa-users" />
							</q-item-section>
							<q-item-section class="title">Players</q-item-section>
							<q-tooltip
								v-if="$store.getters.side_collapsed"
								anchor="center right"
								self="center left"
							>
								Players
							</q-tooltip>
						</q-item>
						<q-item clickable v-ripple to="/content/npcs">
							<q-item-section avatar>
								<i aria-hidden="true" class="fas fa-dragon" />
							</q-item-section>
							<q-item-section class="title">NPCs</q-item-section>
							<q-tooltip
								v-if="$store.getters.side_collapsed"
								anchor="center right"
								self="center left"
							>
								NPCs
							</q-tooltip>
						</q-item>
						<q-item clickable v-ripple to="/content/spells">
							<q-item-section avatar>
								<i aria-hidden="true" class="fas fa-wand-magic" />
							</q-item-section>
							<q-item-section class="title">Spells</q-item-section>
							<q-tooltip
								v-if="$store.getters.side_collapsed"
								anchor="center right"
								self="center left"
							>
								Spells
							</q-tooltip>
						</q-item>
						<q-item clickable v-ripple to="/content/reminders">
							<q-item-section avatar>
								<i aria-hidden="true" class="fas fa-stopwatch" />
							</q-item-section>
							<q-item-section class="title">Reminders</q-item-section>
							<q-tooltip
								v-if="$store.getters.side_collapsed"
								anchor="center right"
								self="center left"
							>
								Reminders
							</q-tooltip>
						</q-item>
						<q-item clickable v-ripple to="/content/items">
							<q-item-section avatar>
								<i aria-hidden="true" class="fas fa-staff" />
							</q-item-section>
							<q-item-section class="title">Items</q-item-section>
							<q-tooltip
								v-if="$store.getters.side_collapsed"
								anchor="center right"
								self="center left"
							>
								Items
							</q-tooltip>
						</q-item>
						<q-item clickable v-ripple to="/content/import">
							<q-item-section avatar>
								<i aria-hidden="true" class="fas fa-file-upload" />
							</q-item-section>
							<q-item-section class="title">Import</q-item-section>
							<q-tooltip
								v-if="$store.getters.side_collapsed"
								anchor="center right"
								self="center left"
							>
								Import
							</q-tooltip>
						</q-item>
					</q-list>
					<hr />
					<h3>Player Content</h3>
					<q-list @click="setSideSmallScreen(false)">
						<q-item clickable v-ripple to="/content/characters">
							<q-item-section avatar>
								<i aria-hidden="true" class="fas fa-helmet-battle" />
							</q-item-section>
							<q-item-section class="title">Characters</q-item-section>
							<q-tooltip
								v-if="$store.getters.side_collapsed"
								anchor="center right"
								self="center left"
							>
								Characters
							</q-tooltip>
						</q-item>
						<q-item
							clickable
							v-ripple
							to="/content/character-builder"
							v-if="
								userInfo &&
								((userInfo.contribute && userInfo.contribute.includes('character-builder')) ||
									userInfo.admin)
							"
						>
							<q-item-section avatar>
								<i class="fad fa-helmet-battle" aria-hidden="true" />
							</q-item-section>
							<q-item-section class="title">Character builder</q-item-section>
							<q-item-section avatar><q-badge>Alpha</q-badge></q-item-section>
							<q-tooltip
								v-if="$store.getters.side_collapsed"
								anchor="center right"
								self="center left"
							>
								Character builder
							</q-tooltip>
						</q-item>
						<q-item clickable v-ripple to="/content/followed">
							<q-item-section avatar>
								<i aria-hidden="true" class="fas fa-user-check" />
							</q-item-section>
							<q-item-section class="title">Followed users</q-item-section>
							<q-tooltip
								v-if="$store.getters.side_collapsed"
								anchor="center right"
								self="center left"
							>
								Followed users
							</q-tooltip>
						</q-item>
					</q-list>
					<hr />
				</template>
				<template v-else>
					<q-list @click="setSideSmallScreen(false)">
						<q-item clickable v-ripple to="/sign-in" color="primary">
							<q-item-section avatar>
								<i aria-hidden="true" class="fas fa-sign-in" />
							</q-item-section>
							<q-item-section class="title">Sign in</q-item-section>
							<q-tooltip
								v-if="$store.getters.side_collapsed"
								anchor="center right"
								self="center left"
							>
								Sign in
							</q-tooltip>
						</q-item>
						<q-item clickable v-ripple to="/sign-up" color="primary">
							<q-item-section avatar>
								<i aria-hidden="true" class="fas fa-user-plus" />
							</q-item-section>
							<q-item-section class="title">Create account</q-item-section>
							<q-tooltip
								v-if="$store.getters.side_collapsed"
								anchor="center right"
								self="center left"
							>
								Create account
							</q-tooltip>
						</q-item>
					</q-list>
					<hr />
				</template>
				<q-list @click="setSideSmallScreen(false)">
					<q-item clickable v-ripple to="/pricing">
						<q-item-section avatar>
							<i aria-hidden="true" class="fas fa-coins" />
						</q-item-section>
						<q-item-section>
							{{ $store.getters.user ? "Get subscription" : "Pricing" }}
						</q-item-section>
						<q-tooltip
							v-if="$store.getters.side_collapsed"
							anchor="center right"
							self="center left"
						>
							Subscribe
						</q-tooltip>
					</q-item>
				</q-list>
				<hr />
				<q-list @click="setSideSmallScreen(false)">
					<q-item clickable v-ripple to="/tools">
						<q-item-section avatar>
							<i aria-hidden="true" class="fas fa-tools" />
						</q-item-section>
						<q-item-section class="title">Tools</q-item-section>
						<q-tooltip
							v-if="$store.getters.side_collapsed"
							anchor="center right"
							self="center left"
						>
							Tools
						</q-tooltip>
					</q-item>
					<q-item clickable v-ripple to="/compendium">
						<q-item-section avatar>
							<i aria-hidden="true" class="fas fa-book-spells" />
						</q-item-section>
						<q-item-section class="title">Compendium</q-item-section>
						<q-tooltip
							v-if="$store.getters.side_collapsed"
							anchor="center right"
							self="center left"
						>
							Compendium
						</q-tooltip>
					</q-item>
					<q-item clickable v-ripple to="/support">
						<q-item-section avatar>
							<i aria-hidden="true" class="fas fa-user-headset" />
						</q-item-section>
						<q-item-section class="title">Support</q-item-section>
						<q-tooltip
							v-if="$store.getters.side_collapsed"
							anchor="center right"
							self="center left"
						>
							Support
						</q-tooltip>
					</q-item>
					<q-item clickable v-ripple to="/feedback">
						<q-item-section avatar>
							<i aria-hidden="true" class="fas fa-comment-alt" />
						</q-item-section>
						<q-item-section class="title">Feedback</q-item-section>
						<q-tooltip
							v-if="$store.getters.side_collapsed"
							anchor="center right"
							self="center left"
						>
							Feedback
						</q-tooltip>
					</q-item>
					<q-item clickable v-ripple to="/changelog">
						<q-item-section avatar>
							<i aria-hidden="true" class="far fa-code-merge" />
						</q-item-section>
						<q-item-section class="title">Changelog</q-item-section>
						<q-tooltip
							v-if="$store.getters.side_collapsed"
							anchor="center right"
							self="center left"
						>
							Changelog
						</q-tooltip>
					</q-item>
					<q-item clickable v-ripple to="/documentation">
						<q-item-section avatar>
							<i aria-hidden="true" class="fas fa-file" />
						</q-item-section>
						<q-item-section class="title">Documentation</q-item-section>
						<q-tooltip
							v-if="$store.getters.side_collapsed"
							anchor="center right"
							self="center left"
						>
							Documentation
						</q-tooltip>
					</q-item>
					<q-item clickable v-ripple to="/about-us">
						<q-item-section avatar>
							<i aria-hidden="true" class="fas fa-user-friends" />
						</q-item-section>
						<q-item-section class="title">About us</q-item-section>
						<q-tooltip
							v-if="$store.getters.side_collapsed"
							anchor="center right"
							self="center left"
						>
							About us
						</q-tooltip>
					</q-item>
				</q-list>
				<hr />
				<h3>Follow us</h3>
				<q-list @click="setSideSmallScreen(false)">
					<q-item
						v-for="{ name, icon, url } in social_media"
						clickable
						v-ripple
						link
						tag="a"
						:href="url"
						target="_blank"
						rel="noopener"
						:key="name"
					>
						<q-item-section avatar>
							<i aria-hidden="true" :class="icon" />
						</q-item-section>
						<q-item-section class="title">{{ name }} </q-item-section>
						<q-tooltip
							v-if="$store.getters.side_collapsed"
							anchor="center right"
							self="center left"
						>
							{{ name }}
						</q-tooltip>
					</q-item>
				</q-list>
			</div>
			<div id="toggle-width" @click="toggleSideCollapsed()">
				<i aria-hidden="true" class="far fa-angle-left" />
			</div>
		</div>
	</transition>
</template>

<script>
import { mapActions } from "vuex";

export default {
	name: "Sidebar",
	props: ["smallScreen"],
	data() {
		return {
			userInfo: this.$store.getters.userInfo,
			man_col: false,
			social_media: [
				{
					name: "Patreon",
					icon: "fab fa-patreon patreon-red",
					url: "https://www.patreon.com/shieldmaidenapp",
				},
				{
					name: "Discord",
					icon: "fab fa-discord",
					url: "https://discord.gg/fhmKBM7",
				},
				{
					name: "Instagram",
					icon: "fab fa-instagram",
					url: "https://www.instagram.com/shieldmaidenapp",
				},
				{
					name: "Twitter",
					icon: "fab fa-twitter-square",
					url: "https://twitter.com/shieldmaidenapp",
				},
				{
					name: "Facebook",
					icon: "fab fa-facebook",
					url: "https://www.facebook.com/shieldmaidenapp",
				},
			],
		};
	},
	methods: {
		...mapActions(["toggleSideCollapsed", "setSideCollapsed", "setSideSmallScreen"]),
	},
};
</script>

<style lang="scss">
#sidebar {
	width: 250px;
	height: calc(100vh - 50px);
	position: relative;
	padding-top: 10px;
	background: $neutral-8;
	transition: width 0.5s linear;
	z-index: 98;
	border-right: 1px solid $neutral-5;
	overflow-y: auto;
	overflow-x: hidden;
	padding-bottom: 40px;
	scrollbar-width: none;

	h3 {
		padding-left: 10px;
		text-transform: uppercase;
		font-size: 13px;
		font-weight: bold;
		margin: 10px 0;
		width: 250px;
		color: $neutral-3;
	}
	hr {
		background-color: $neutral-6;
	}

	.q-list {
		.q-item {
			color: $neutral-3 !important;
			overflow: hidden;
			width: 250px;
			transition: padding-left 0.5s linear;
			min-height: 40px;

			.q-item__section--avatar {
				min-width: 35px;
				color: $neutral-4;
			}

			&.q-router-link--active {
				color: $neutral-1 !important;

				.q-item__section--avatar {
					color: $neutral-1 !important;
				}
			}
		}
	}
	#toggle-width {
		background: $neutral-8;
		height: 40px;
		position: fixed;
		right: left;
		bottom: 0;
		padding: 0 20px;
		border-top: 1px solid $neutral-6;
		border-right: 1px solid $neutral-5;
		cursor: pointer;
		color: $neutral-3;
		line-height: 40px;
		font-size: 20px;
		text-align: right;
		width: 250px;
		transition: width 0.5s linear;

		i {
			transition: transform 0.5s linear;
		}
	}
	&.side-collapsed {
		width: 45px;

		h3 {
			display: none;
		}

		.q-item {
			width: 44px;
			padding-left: 12px;
			margin: 0;
			transition: width 0.5s linear;

			.title {
				display: none;
			}
		}

		span {
			display: none;
		}
		#toggle-width {
			width: 45px;
			i {
				transform: rotate(180deg);
			}
		}
	}
	&::-webkit-scrollbar {
		display: none;
	}

	&.slideIn {
		position: absolute;

		#toggle-width {
			display: none;
		}
	}
}
.slideInLeft {
	animation-duration: 0.5s !important;
}
.slideOutLeft {
	animation-duration: 0.5s !important;
}
@media only screen and (max-width: 576px) {
	#sidebar {
		position: absolute;

		#toggle-width {
			display: none;
		}
	}
}
</style>
