<template>
	<div class="share">
		<div class="home__container">
			<div class="row q-col-gutter-xl">
				<div class="col-12 col-md-7">
					<img src="~assets/_img/home/live-initiative-list.webp" alt="Live Initiative Tracker" />
				</div>
				<div class="col-12 col-md-5">
					<div class="head">
						<h2>Live Initiative List</h2>
						<h3>Share a live initiative list with your players</h3>
						<p class="text">
							Show your players a live initiative list of the encounter that updates as you play.
							Perfect for at the table or if you are hosting a podcast or stream.<br />
							<router-link to="/tools/combat-tracker" class="learn-more">Learn more</router-link>
						</p>
						<router-link to="/sign-up" class="btn btn-lg bg-accent"
							>Create Free Account</router-link
						>
					</div>
				</div>
			</div>
		</div>

		<q-dialog v-model="dialog" square>
			<Carousel :slides="items" :slide="slide" />
		</q-dialog>
	</div>
</template>

<script>
import Carousel from "./Carousel";
import { live_initiative_texts } from "src/utils/generalConstants";

export default {
	name: "Share",
	components: {
		Carousel,
	},
	data() {
		return {
			dialog: false,
			slide: "hp",
			items: live_initiative_texts,
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
.share {
	img {
		width: 100%;
		padding: 0 25px;
		object-fit: contain;
		border-radius: $border-radius;
		aspect-ratio: 16/9;
	}
}
@media only screen and (max-width: $sm-breakpoint) {
	.share {
		img {
			padding: 0;
		}
		.btn {
			width: 100%;
			display: block;
		}
	}
}
</style>
