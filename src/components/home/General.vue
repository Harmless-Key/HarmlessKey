<template>
	<div class="general">
		<div class="home__container">
			<div class="row q-col-gutter-xl items-center">
				<div class="col-12 col-md-7">
					<img
						src="~assets/_img/combat-tracker-shieldmaiden.webp"
						alt="Combat Tracker Shieldmaiden"
					/>
				</div>
				<div class="col-12 col-md-5">
					<div class="head">
						<h2>Combat Tracker for D&D</h2>
						<h3>We keep track, you focus on the game</h3>
						<p class="text">
							We focus on keeping the game on the table by managing everything you need to keep
							track of during encounters. On top of that we enhance the player experience.<br />
							<router-link to="/tools/combat-tracker" class="learn-more">Learn more</router-link>
						</p>
						<router-link to="/demo" class="btn btn-lg bg-accent">Try Demo Encounter</router-link>
					</div>
					<!-- <q-list>
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
					</q-list> -->
				</div>
			</div>
		</div>

		<q-dialog v-model="dialog">
			<Carousel :slides="items" :slide="slide" />
		</q-dialog>
	</div>
</template>

<script>
import Carousel from "./Carousel";
import { combat_tracker_texts } from "src/utils/generalConstants";

export default {
	name: "General",
	components: {
		Carousel,
	},
	data() {
		return {
			dialog: false,
			slide: "hp",
			items: combat_tracker_texts,
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
.general {
	img {
		width: 100%;
		object-fit: cover;
		border-radius: $border-radius;
		aspect-ratio: 16/9;
	}
}
@media only screen and (max-width: $sm-breakpoint) {
	.btn {
		width: 100%;
		display: block;
	}
}
</style>
