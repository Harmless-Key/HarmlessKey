<template>
	<div>
		<ValidationObserver v-slot="{ handleSubmit, valid }">
			<q-form @submit="handleSubmit(edit)" greedy>
				<h3 class="d-flex justify-between">
					Atmosphere
					<div v-if="!demo">
						<q-btn color="primary" type="submit" no-caps>Save</q-btn>
						<q-icon v-if="!valid" name="error" color="red" size="md" class="ml-2">
							<q-tooltip anchor="top middle" self="center middle">
								There are validation errors
							</q-tooltip>
						</q-icon>
					</div>
				</h3>

				<template v-if="demo">
					<p>
						If you create an account, you can add atmosphere to your encounters, to let your players
						immerse even more.
					</p>
					<q-list class="mb-3">
						<q-item class="bg-neutral-8">
							<q-item-section avatar>
								<hk-icon icon="fas fa-image" />
							</q-item-section>
							<q-item-section>Background</q-item-section>
						</q-item>
						<q-item class="bg-neutral-8">
							<q-item-section avatar>
								<hk-icon icon="fas fa-music" />
							</q-item-section>
							<q-item-section>Audio</q-item-section>
						</q-item>
						<q-item class="bg-neutral-8">
							<q-item-section avatar>
								<hk-icon icon="fas fa-cloud-showers" />
							</q-item-section>
							<q-item-section>Weather effects</q-item-section>
						</q-item>
					</q-list>
					<router-link to="/sign-up" class="btn">Create an account</router-link>
				</template>

				<template v-else>
					<ValidationProvider rules="required" name="Name" v-slot="{ errors, invalid, validated }">
						<q-input
							:dark="$store.getters.theme === 'dark'"
							filled
							square
							label="Name of your encounter"
							autocomplete="off"
							class="mb-3"
							v-model="editableEncounter.name"
							:error="invalid && validated"
							:error-message="errors[0]"
						/>
					</ValidationProvider>

					<ValidationProvider rules="audio" name="Audio" v-slot="{ errors, invalid, validated }">
						<div class="audio">
							<div v-if="encounter.audio && !invalid" class="img pointer">
								<a :href="encounter.audio" target="_blank" rel="noopener">
									<q-icon
										:class="audio_icons[audio_link_type].icon"
										:style="`color:${audio_icons[audio_link_type].color};`"
									></q-icon>
								</a>
							</div>
							<div class="img" v-else>
								<q-icon name="fas fa-music-alt" />
							</div>
							<div>
								<q-input
									:dark="$store.getters.theme === 'dark'"
									filled
									square
									label="Audio"
									autocomplete="off"
									v-model="editableEncounter.audio"
									placeholder="Audio URL"
									:error="invalid && validated"
									:error-message="errors[0]"
								/>
							</div>
						</div>
					</ValidationProvider>

					<hk-background-select
						v-if="demo || (tier && tier.price !== 'Free')"
						v-model="editableEncounter.hk_background"
						label="Background"
						:disable="!!editableEncounter.background"
						@input="setBackground($event)"
						class="mb-3"
					/>
					<ValidationProvider rules="url" name="Audio" v-slot="{ errors, invalid, validated }">
						<div class="background mb-3">
							<div
								v-if="encounter.background && !invalid"
								class="img pointer"
								:style="{ backgroundImage: 'url(\'' + encounter.background + '\')' }"
								@click="image = true"
							></div>
							<div class="img" v-else>
								<q-icon name="fas fa-image" />
							</div>
							<div>
								<q-input
									:dark="$store.getters.theme === 'dark'"
									filled
									square
									label="Background"
									autocomplete="off"
									v-model="editableEncounter.background"
									class="mb-2"
									placeholder="Background URL"
									:error="invalid && validated"
									:error-message="errors[0]"
									@input="editableEncounter.hk_background = null"
								>
									<hk-popover
										slot="append"
										header="Custom background"
										v-if="demo || (tier && tier.price !== 'Free')"
									>
										<i class="fas fa-info-circle" aria-hidden="true" />
										<template #content>
											Setting a custom background will overwrite your selected background.
										</template>
									</hk-popover>
								</q-input>
							</div>
						</div>
					</ValidationProvider>

					<template v-if="tier && tier.price !== 'Free'">
						<h3>
							Background effects
							<q-icon name="fas fa-eye" class="blue ml-1 pointer" @click="image = true">
								<q-tooltip anchor="top middle" self="center middle"> Background preview </q-tooltip>
							</q-icon>
						</h3>
						<EditWeather v-model="weather" />
					</template>

					<div v-if="!demo" class="d-flex justify-start items-center mb-3">
						<q-btn color="primary" type="submit" no-caps>Save</q-btn>
						<q-icon v-if="!valid" name="error" color="red" size="md" class="ml-2">
							<q-tooltip anchor="top middle" self="center middle">
								There are validation errors
							</q-tooltip>
						</q-icon>
					</div>

					<hk-card v-if="!demo && (!tier || tier.price === 'Free')">
						<div slot="header" class="card-header">
							<span>
								<i class="fas fa-cloud-showers" aria-hidden="true" />
								<i class="fas fa-cloud-snow mx-2" aria-hidden="true" />
								<i class="fas fa-fog" aria-hidden="true" />
							</span>
							<strong>Backgrounds & Effects</strong>
							<span>
								<i class="fas fa-bolt" aria-hidden="true" />
								<i class="fas fa-tornado mx-2" aria-hidden="true" />
								<i class="fas fa-waveform-path" aria-hidden="true" />
							</span>
						</div>
						<div class="p-3 text-center">
							<p>With a subscription you have access to our backgrounds and background effects.</p>
							<p>
								<template v-for="(effect, i) in effects">
									<strong :key="`effect-${effect}`">{{ effect.toUpperCase() }}</strong>
									<span class="neutral-2 mx-1" :key="`pipe-${effect}`" v-if="i < effects.length - 1"
										>|</span
									>
								</template>
							</p>
							<router-link class="btn btn-sm bg-neutral-5 full-width" to="/weather-demo">
								Checkout all effects
							</router-link>
							<router-link class="btn btn-sm full-width mt-2 bg-patreon-red" to="/pricing">
								Get a subscription
							</router-link>
						</div>
					</hk-card>
				</template>
			</q-form>
		</ValidationObserver>

		<q-dialog v-if="demo || (tier && tier.price !== 'Free')" v-model="image" full-height full-width>
			<q-card :dark="$store.getters.theme === 'dark'">
				<q-toolbar class="bg-neutral-9">
					<div>Background preview</div>
					<q-space />

					<q-btn-dropdown stretch flat no-caps label="Weather" dark square>
						<div class="bg-neutral-9 edit-weather">
							<q-item-label header>Weather effects</q-item-label>
							<EditWeather v-model="weather" />
						</div>
					</q-btn-dropdown>

					<q-btn flat round dense no-caps icon="close" class="q-mr-sm" v-close-popup />
				</q-toolbar>
				<div class="preview">
					<Weather
						:weather="weather"
						:key="JSON.stringify(weather)"
						:background="getBackground(editableEncounter)"
					/>
				</div>
			</q-card>
		</q-dialog>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import EditWeather from "./Weather";
import { audio } from "src/mixins/audio";

export default {
	name: "General",
	props: {
		encounter: {
			type: Object,
			required: true,
		},
		campaign: {
			type: Object,
			required: true,
		},
	},
	components: {
		EditWeather,
		Weather: () => import("src/components/weather"),
	},
	mixins: [audio],
	data() {
		return {
			demo: this.$route.name === "ToolsBuildEncounter" || this.$route.name === "DemoBuildEncounter",
			campaignId: this.$route.params.campid,
			encounterId: this.$route.params.encid,
			user: this.$store.getters.user,
			image: false,
			weatherSetter: undefined,
			weather: {},
			editableEncounter: this.encounter,
			effects: [
				"rain",
				"snow",
				"fog",
				"hail",
				"quakes",
				"lightning",
				"sandstorm",
				"ash rain",
				"smoke",
			],
		};
	},
	computed: {
		...mapGetters(["tier"]),
	},
	mounted() {
		if (this.encounter && this.encounter.weather) {
			this.weather = this.encounter.weather;
		}
		if (this.editableEncounter && !this.editableEncounter.hk_background) {
			this.$set(this.editableEncounter, "hk_background", null);
		}
	},
	methods: {
		...mapActions("encounters", ["edit_encounter"]),
		...mapActions(["setDrawer"]),
		edit() {
			this.editableEncounter.weather = Object.keys(this.weather).length > 0 ? this.weather : null;

			this.edit_encounter({
				campaignId: this.campaignId,
				encounterId: this.encounterId,
				value: this.editableEncounter,
			})
				.then(() => {
					this.$snotify.success("Saved.", "Critical hit!", {
						position: "rightTop",
					});
				})
				.catch(() => {
					this.$snotify.error("Something went wrong saving the encounter.", "Save failed", {
						position: "rightTop",
					});
				});
		},
		intensity(type) {
			const value = this.weather[type];
			if (value === 0) return "Off";

			if (type === "lightning") {
				if (value === 1) return "6m interval";
				if (value === 2) return "3m interval";
				if (value === 3) return "1m interval";
			} else {
				if (value === 1) return "Light";
				if (value === 2) return "Medium";
				if (value === 3) return "Heavy";
			}
		},
		setBackground(value) {
			this.$set(this.editableEncounter, "hk_background", value);
		},
		getBackground(encounter) {
			if (encounter.background) return encounter.background;
			if (encounter.hk_background)
				return require(`src/assets/_img/atmosphere/${encounter.hk_background}.jpg`);
		},
	},
};
</script>

<style lang="scss" scoped>
.background,
.audio {
	display: grid;
	grid-template-columns: 56px 1fr;
	grid-column-gap: 10px;
	font-size: 35px;
	text-align: center;

	.img {
		border: solid 1px $neutral-2;
		display: block;
		width: 56px;
		height: 56px;
		background-size: cover;
		background-position: center top;
	}
}
.q-card {
	.preview {
		overflow: hidden;
		height: calc(100% - 50px);
		width: 100%;
		position: relative;
		background-size: cover;
		background-position: center top;
	}
}
.edit-weather {
	min-width: 240px;
}
.q-item {
	margin-bottom: 1px;
}
</style>
