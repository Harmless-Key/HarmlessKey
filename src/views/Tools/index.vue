<template>
	<hk-card>
		<div class="card-header" slot="header">
			<h1><i aria-hidden="true" class="fas fa-tools mr-2" /> D&D 5e Tools</h1>
		</div>
		<div class="card-body">
			<template v-for="(group, i) in tools">
				<h2 :key="`title-${i}`" :class="{ 'mt-3': i > 0 }">{{ group.title }}</h2>
				<div class="row q-col-gutter-md" :key="i" :class="{ 'pb-2': i === 0 }">
					<div v-for="(tool, key) in group.tools" class="col-12 col-sm-6 col-md-4" :key="key">
						<router-link :to="tool.url">
							<hk-card class="full-height tool">
								<div
									slot="image"
									class="card-image"
									:style="[
										tool.image
											? {
													backgroundImage: `url(${require(`src/assets/_img/atmosphere/medium/${tool.image}`)})`,
												}
											: '',
									]"
								></div>
								<div class="card-body">
									<div class="header">
										<i :class="tool.icon" aria-hidden="true" class="mr-1" />
										{{ tool.title }}
									</div>
									{{ tool.description }}
								</div>
								<div slot="footer" class="footer">
									<div v-if="tool.under_development" class="red full-width text-center">
										Under development
									</div>
									<button v-else class="btn btn-sm">Use {{ tool.title }}</button>
								</div>
							</hk-card>
						</router-link>
					</div>
				</div>
			</template>
			<h2 class="mt-3">
				Online tools to enhance and simplify every aspect of your tabletop role-playing experience.
			</h2>
			<p>
				Designed with the Dungeon Master in mind, our suite of tools is a comprehensive resource to
				streamline and enrich every facet of your storytelling journey. From managing combat
				encounters with our initiative tracker and creating unique monsters to seamlessly guiding
				the narrative with a digital DM screen, our tools provide the essential support needed for
				Dungeon Masters to create immersive and dynamic adventures. Dive into a realm where our
				tools serve as your digital assistant, helping you master the art of storytelling and
				deliver unparalleled experiences to your players.
			</p>
		</div>
	</hk-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "ToolsOverview",
	computed: {
		...mapGetters(["user"]),
	},
	data() {
		return {
			tools: [
				{
					title: "D&D Tools by Shieldmaiden",
					tools: {
						"combat-tracker": {
							title: "Combat Tracker",
							description:
								"Track everything in your encounters and share initiative with your players.",
							image: "combat-tracker-medium.webp",
							url: "/tools/combat-tracker",
							icon: "fas fa-swords",
						},
						"encounter-builder": {
							title: "Encounter Builder",
							description:
								"Build encounters and see their difficulty for your party. You can run your encounters in our combat tracker.",
							image: "encounter-builder-medium.webp",
							url: "/tools/encounter-builder",
							icon: "fas fa-hammer-war",
						},
						"dm-screen": {
							title: "DM Screen",
							description:
								"Quick access to rules, a soundboard, your players, your custom encounters and more.",
							image: "dm-screen-medium.png",
							url: "/tools/dm-screen",
							icon: "fas fa-map",
						},
						"monster-creator": {
							title: "Monster Creator",
							description:
								"Build custom monster stat blocks with easy to roll actions. You can use your monsters in our combat tracker.",
							image: "monster-medium.jpg",
							url: "/tools/monster-creator",
							icon: "fas fa-dragon",
						},
						"spell-creator": {
							title: "Spell Creator",
							description:
								"Create custom spells to roll directly, or use on your spellcaster monsters.",
							image: "fire-dragon-medium.jpg",
							url: "/tools/spell-creator",
							icon: "fas fa-wand-magic",
						},
						"character-sync": {
							title: "Character Sync",
							description:
								"Access your characters from external resources and sync them with Shieldmaiden.",
							image: "character-sync.png",
							url: "/tools/character-sync",
							icon: "fas fa-sync-alt",
						},
						compendium: {
							title: "Compendium",
							description: "Quickly reference Monsters, Spells, Conditions and Items.",
							image: "compendium-medium.jpg",
							url: "/compendium",
							icon: "fas fa-book-spells",
						},
						"Character Builder": {
							title: "Character Builder",
							description: "Build your character and get an online character sheet.",
							image: "characters-medium.jpg",
							url: "/tools/character-builder",
							under_development: true,
							icon: "fas fa-helmet-battle",
						},
					},
				},
				{
					title: "D&D Tools by our friends",
					tools: {
						"homebrew-creation": {
							title: "Homebrew Creation",
							description: "Need a free adventure template, homebrew content or DMing inspiration?",
							image: "homebrew-creation.png",
							url: "/tools/homebrew-creation",
							icon: "fas fa-scroll-old",
						},
					},
				},
			],
		};
	},
};
</script>

<style lang="scss" scoped>
h2 {
	line-height: 25px;
}
a {
	all: unset;
	cursor: pointer;
}
.hk-card.tool {
	transition: all 0.5s ease-in;
	background-color: $neutral-7;

	.header {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 10px;
	}
	.footer {
		padding: 0 20px 20px 20px;
	}
	.card-image {
		transition: all 0.5s ease-in-out;
		font-size: 95px;
		width: inherit;
		text-align: center;
		line-height: 180px;
		text-shadow: 0 0 20px $black;
	}
	&:hover {
		background-color: $neutral-5;
	}
}
</style>
