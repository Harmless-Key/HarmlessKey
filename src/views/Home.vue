<template>
	<div v-if="!user" class="home" ref="scrollArea">
		<Header :scrolled="!!scrolled" />
		<template v-if="diceColors.length > 0">
			<section class="home-section" id="top">
				<Top :maintenance="maintenance" />
				<span
					class="die"
					:style="{
						backgroundImage:
							'url(' +
							require('src/assets/_img/logo/logo-icon-no-shield-' + diceColors[0] + '.svg') +
							')',
						transform: `rotate(${scrolled}deg)`,
					}"
				>
				</span>
			</section>
			<section id="overview" class="home-section bg-neutral-10">
				<Feedback />
				<span
					class="die"
					:style="{
						backgroundImage:
							'url(' +
							require('src/assets/_img/logo/logo-icon-no-shield-' + diceColors[1] + '.svg') +
							')',
						transform: `rotate(${scrolled}deg)`,
					}"
				>
				</span>
			</section>
			<section id="general" class="home-section bg-neutral-9">
				<General />
				<span
					class="die"
					:style="{
						backgroundImage:
							'url(' +
							require('src/assets/_img/logo/logo-icon-no-shield-' + diceColors[2] + '.svg') +
							')',
						transform: `rotate(${scrolled}deg)`,
					}"
				>
				</span>
			</section>
			<section id="builder" class="home-section bg-neutral-10">
				<Builder />
				<span
					class="die"
					:style="{
						backgroundImage:
							'url(' +
							require('src/assets/_img/logo/logo-icon-no-shield-' + diceColors[3] + '.svg') +
							')',
						transform: `rotate(${scrolled}deg)`,
					}"
				>
				</span>
			</section>
			<section id="share" class="home-section bg-neutral-9">
				<Share />
				<span
					class="die"
					:style="{
						backgroundImage:
							'url(' +
							require('src/assets/_img/logo/logo-icon-no-shield-' + diceColors[4] + '.svg') +
							')',
						transform: `rotate(${scrolled}deg)`,
					}"
				>
				</span>
			</section>
			<section id="pricing" class="home-section bg-neutral-10">
				<Pricing />
			</section>
			<Footer />
		</template>
	</div>
	<div v-else class="user-content">
		<Authenticated>
			<UserContent />
		</Authenticated>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import Header from "src/components/home/Header.vue";
import Top from "src/components/home/Top.vue";
import Pricing from "src/components/home/Pricing.vue";
import Feedback from "src/components/home/Feedback.vue";
import General from "src/components/home/General.vue";
import Share from "src/components/home/Share.vue";
import Builder from "src/components/home/Builder.vue";
import Footer from "src/components/Footer.vue";
import UserContent from "./UserContent";
import Authenticated from "src/layouts/authenticated.vue";

export default {
	name: "home",
	props: {
		maintenance: [Boolean, String],
	},
	components: {
		Header,
		Top,
		Feedback,
		Pricing,
		General,
		Share,
		Builder,
		Footer,
		UserContent,
		Authenticated,
	},
	data() {
		return {
			scrolled: 0,
		};
	},
	computed: {
		...mapGetters(["user"]),
		diceColors() {
			return ["cyan", "yellow", "orange", "green", "blue", "red"];
		},
	},
	mounted() {
		const scrollArea = this.$refs.scrollArea;
		this._scrollListener = () => {
			this.scrolled = scrollArea.scrollTop;
		};
		this._scrollListener();
		scrollArea.addEventListener("scroll", this._scrollListener);
	},
	methods: {
		handleScroll(e) {
			this.scrolled = e.verticalPosition;
		},
	},
	beforeDestroy() {
		this.$refs.scrollArea.removeEventListener("scroll", this._scrollListener);
	},
};
</script>

<style lang="scss" scoped>
.home {
	height: 100vh;
	overflow: auto;

	.home-section {
		position: relative;
		padding: 50px 0;

		&#top {
			padding: $header-height 0 0 0;
		}
	}
	.die {
		width: 60px;
		height: 60px;
		background-size: 60px;
		margin-left: -30px;
		bottom: -30px;
		left: 50%;
		position: absolute;
		display: inline-block;
		background-position: center;
		background-repeat: no-repeat;
		z-index: 97;
	}
	::v-deep {
		a.learn-more {
			font-weight: bold;
			color: $neutral-1;

			&:hover {
				text-decoration: underline;
			}
			&::after {
				content: "...";
			}
		}
	}
}
.hk-layout {
	height: 100vh;
	padding-top: $header-height;
}

@media only screen and (min-width: $md-breakpoint) {
	.home {
		.die {
			width: 80px;
			height: 80px;
			background-size: 80px;
			margin-left: -50px;
			bottom: -40px;
		}

		.home-section {
			padding: 80px 0;
		}
	}
}
</style>
