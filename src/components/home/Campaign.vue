<template>
	<div class="campaign">
		<div class="home__container">
			<div class="head">
				<h2>Campaign Manager</h2>
				<div class="text">
					Our tool started out as a combat tracker for Dungeons & Dragons, but it has grown a lot.
					Over time it has become so much more than that, but if you simply want to run your
					encounters it is still perfect for just that.
				</div>
			</div>

			<div class="row q-col-gutter-xl mb-5">
				<div class="col-12 col-md-6">
					<video
						class="video"
						src="~assets/_img/home/player-overview.mp4"
						muted
						autoplay
						playsinline
						alt="D&D Combat Tracker Shieldmaiden player overview"
						loop
					/>
				</div>
				<div class="col-12 col-md-6">
					<h3>
						More than an encounter tool,<br />
						if you want it to be.
					</h3>

					<q-list>
						<q-item
							v-for="({ name, icon, title }, index) in items"
							:key="`item-${index}`"
							clickable
							@click="setDialog(name)"
						>
							<q-item-section avatar>
								<i aria-hidden="true" :class="icon" class="neutral-2" />
							</q-item-section>
							<q-item-section>
								{{ title }}
							</q-item-section>
							<q-item-section avatar>
								<i aria-hidden="true" class="fas fa-eye neutral-3" />
							</q-item-section>
						</q-item>
					</q-list>
				</div>
			</div>
			<div class="d-flex justify-center">
				<router-link to="sign-up" class="btn btn-lg bg-accent">Start a campaign</router-link>
			</div>
		</div>

		<q-dialog v-model="dialog" square>
			<Carousel :slides="items" :slide="slide" />
		</q-dialog>
	</div>
</template>

<script>
import Carousel from "./Carousel";

export default {
	name: "Campaign",
	components: {
		Carousel,
	},
	data() {
		return {
			dialog: false,
			slide: "status",
			items: [
				{
					name: "status",
					icon: "fas fa-heartbeat",
					title: "Player status",
					text:
						"Keep track of player status outside combat.<br/>" +
						"You have a quick overview of their senses at hand and you " +
						"always know how they're doing healthwise.",
				},
				{
					name: "loot",
					icon: "fas fa-treasure-chest",
					title: "Party loot",
					text:
						"Handing out items to your players this way offers them an overview " +
						"of their inventory. You can link loot to an encounter and award it once the encounter is finished",
				},
				{
					name: "currency",
					icon: "fas fa-coins",
					title: "Currency",
					text:
						"Simply withdraw and add gold to the inventory. " +
						"Just like loot, you can add currency to an encounter and award it afterwards.",
				},
				{
					name: "xp",
					icon: "fas fa-sparkles",
					title: "Experience points",
					text:
						"If you're using experience points in your games, you will love this. " +
						"We do all the maths, like calculating the players' levels and the XP worth of your encounters." +
						"You can simply award XP once an encouner is finished, or at any other time.",
				},
			],
		};
	},
	methods: {
		setDialog(slide) {
			this.slide = slide;
			this.dialog = true;
		},
	},
};
</script>

<style lang="scss" scoped>
.campaign {
	ul {
		margin-bottom: 30px;
	}
	video {
		width: 100%;
		margin-bottom: 30px;
	}
}
</style>
