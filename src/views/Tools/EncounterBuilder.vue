<template>
	<ToolsPage title="Encounter Builder" bg_img="encounter-builder-header.webp">
		<template v-slot:action_btn="{ btn_classes }">
			<q-btn
				color="primary"
				:class="btn_classes"
				no-caps
				push
				to="/tools/encounter-builder/build-encounter"
			>
				Create encounter
			</q-btn>
		</template>

		<section>
			<h2>Encounter Builder</h2>
			<p>
				Our Dungeons & Dragons encounter builder is a tool designed to help dungeon masters create
				exciting and challenging combat encounters for their players and run them in our
				<router-link to="/tools/combat-tracker">Combat Tracker</router-link>. With our easy-to-use
				interface, you can quickly and easily build encounters using a variety of monsters,
				atmospheric features, and other elements.
			</p>
			<p>
				The encounter builder allows you to add monsters with either rolled or average hit points,
				depending on your preference. This gives you greater flexibility and control over your
				encounters.
			</p>

			<q-img
				class="media large"
				src="~assets/_img/tools/encounter-builder/example-encounter.png"
				alt="Example encounter"
				fit="contain"
			/>
		</section>

		<section class="d-lg-flex justify-between mt-5">
			<div>
				<h2>Encounter Difficulty Calculator</h2>
				<p>
					One of the features of our encounter builder is the built-in difficulty calculator. This
					tool uses the official rules to analyze your encounter and calculate its difficulty level
					based on your party's size, level, and other factors. This makes it easy to ensure that
					your encounters are appropriately challenging for your players, without overwhelming them
					or making combat encounters too easy.
				</p>
			</div>
			<video
				class="video media small"
				src="~assets/_img/tools/encounter-builder/difficulty.mp4"
				muted
				autoplay
				playsinline
				alt="Shieldmaiden logo animation"
				loop
			/>
		</section>

		<em class="mb-0">To save encounters, you need an account.</em>
	</ToolsPage>
</template>

<script>
import ToolsPage from "src/components/ToolsPage.vue";

export default {
	name: "ToolsEncounterBuilder",
	components: {
		ToolsPage,
	},
	meta() {
		return {
			meta: {
				twitterImage: {
					name: "twitter:image",
					content: require(`assets/_img/meta/shieldmaiden-encounter-builder.png`),
				},
				ogImage: {
					property: "og:image",
					content: require(`assets/_img/meta/shieldmaiden-encounter-builder.png`),
				},
				ogImageAlt: {
					property: "og:image:alt",
					content: "Shieldmaiden Encounter Builder",
				},
			},
		};
	},
};
</script>

<style lang="scss" scoped>
.media {
	display: block;
	margin: 30px auto;
}
.media.large {
	width: 100%;
	max-width: 600px;
}
.media.small {
	width: 50%;
	max-width: 300px;
	margin-left: 20px;
}

@media only screen and (max-width: $md-breakpoint) {
	.hk-card .card-image {
		font-size: 30px;
		line-height: 30px;
	}

	.media.small {
		width: 100%;
	}
}
</style>
