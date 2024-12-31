<template>
	<div>
		<div class="grid">
			<div class="content">
				<h1 class="text-center">Get a Shieldmaiden subscription</h1>
				<p class="text-center">
					We use Patreon for our subscriptions. Once you make a choice, you will be redirected to
					<a
						class="patreon-red"
						href="https://www.patreon.com/shieldmaidenapp"
						target="_blank"
						rel="noopener"
						>Patreon</a
					>
					to finish payment.
					<template v-if="!userInfo?.patreon_id">
						<br />To receive the benefits of your subscription you have to create a Patreon account
						and link it to your Shieldmaiden account.
					</template>
				</p>

				<div v-if="!user" class="d-flex justify-content-center mb-4">
					<router-link class="btn" to="/sign-up"> Create a Shieldmaiden account </router-link>
				</div>
				<div v-else-if="!userInfo.patreon_id" class="d-flex justify-content-center mb-5">
					<q-no-ssr>
						<PatreonLinkButton />
					</q-no-ssr>
				</div>

				<Tiers class="mb-4" />

				<hk-card header="Why do you have to pay?">
					<div class="card-body row q-col-gutter-xl">
						<div class="col-12 col-md-6">
							<p>
								We wish we could offer the app for free. This is why we do have a free tier that
								should be sufficient for most users. All the essential features will always be
								accessible for all users, without cost. You only pay for more storage and quality of
								life features.<br />
								Unfortunately creating an app brings some costs with it. We need to invest a lot of
								time in maintaining and expanding the app. And there are the costs of hosting
								Shieldmaiden, as our user base expands, the costs increase.
							</p>

							<h2>Building together</h2>
							<p>
								Our goal is not to earn money, our goal is to create a D&D initiative tracker that
								is useful for the entire community. <br />
								To reach this goal, we will need support. This is why we have set up a Patreon. This
								way you can help us in achieving this goal and benefit from the extra's that come
								with it.
							</p>
						</div>
						<div class="col-12 col-md-6">
							<iframe
								src="https://www.youtube.com/embed/-Z9i4WR5vtA?si=xYYrDRykRgjMUy8T"
								title="Shieldmaiden Subscriptions"
								frameborder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								referrerpolicy="strict-origin-when-cross-origin"
								allowfullscreen
								class="interview"
							></iframe>
						</div>
					</div>
				</hk-card>

				<hk-card header="About the benefits">
					<div class="card-body">
						<h2>Character Sync</h2>
						<p>
							You will be able to sync your players characters with external online character sheets
							from D&D Beyond and Dice Cloud using the
							<a
								:href="`https://chrome.google.com/webstore/detail/dd-character-sync/${extension_id}`"
								target="_blank"
								rel="noopener"
								>Character Sync Chrome Extension</a
							>. This way you won't have manually update your players, but you can simply click a
							button.<br />
							<router-link to="/tools/character-sync">More about Character Sync</router-link>
						</p>
						<h2>Avatar crop & upload</h2>
						<p>
							For both players and NPCs you can upload an image and crop it to your liking. Without
							a subscription you have to reference an online image to use as an avatar.
						</p>
						<h2>Background effects</h2>
						<p>
							With our background effect you can create more atmosphere on the public initiative
							list that you share with your players. With effects like rain and fog your players
							will be immersed in your games even more than before.<br />
							<router-link to="/weather-demo">Check out all background effects</router-link>
						</p>
						<h2>Import content</h2>
						<p>
							You can import any Shieldmaiden content directly into your account. If a friend or a
							content creator you follow has offered an export of an export of a Campaign from
							Shieldmaiden, you can import it including all the monsters, spells and encounters and
							you will be able to directly run it yourself.
						</p>
					</div>
				</hk-card>
			</div>
			<Footer />
		</div>
	</div>
</template>

<script>
import Tiers from "src/components/Tiers.vue";
import Footer from "src/components/Footer.vue";
import PatreonLinkButton from "src/components/PatreonLinkButton.vue";
import { character_sync_id } from "src/utils/generalConstants";
import { mapGetters } from "vuex";

export default {
	name: "Patreon",
	components: {
		Tiers,
		Footer,
		PatreonLinkButton,
	},
	data() {
		return {
			extension_id: character_sync_id,
		};
	},
	computed: {
		...mapGetters(["user", "userInfo"]),
	},
};
</script>

<style lang="scss" scoped>
.grid {
	padding-top: 30px;
	background-size: cover;
	height: calc(100vh - 50px) !important;
	display: grid;
	grid-template-columns: auto;
	grid-template-rows: 3fr 1fr;
	grid-gap: 0;
	grid-template-areas:
		"container"
		"footer";

	h1 {
		margin-bottom: 30px;
	}
	h2 {
		margin-bottom: 10px !important;
	}
	p {
		font-size: 17px;
		line-height: 30px;
		margin-bottom: 30px;
	}
	.interview {
		width: 100%;
		border-radius: $border-radius;
		aspect-ratio: 16/9;
		justify-self: flex-end;
	}
}
@media only screen and (max-width: 1023px) {
	::v-deep {
		.row {
			flex-direction: column-reverse;
		}
	}
}
</style>
