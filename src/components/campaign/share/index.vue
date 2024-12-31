<template>
	<div v-if="!campaign.sharing" class="full-height">
		<div v-if="!broadcast.live" class="not-live">
			<p>Go live to share with your players</p>
			<div
				class="live pointer"
				@click="
					setDrawer({
						show: true,
						type: 'drawers/Broadcast',
						data: { campaign_id: campaignId, private: campaign.private },
					})
				"
			>
				Go live
			</div>
		</div>
		<q-tabs
			v-model="tab"
			:dark="$store.getters.theme === 'dark'"
			indicator-color="transparent"
			inline-label
			outside-arrows
			mobile-arrows
			no-caps
		>
			<q-tab
				v-for="{ name, label, icon } in tabs"
				:name="name"
				:icon="icon"
				:label="label"
				:key="name"
			>
				<q-badge v-if="showBadge(name)" class="bg-red" floating> Active </q-badge>
			</q-tab>
		</q-tabs>
		<q-tab-panels v-model="tab" class="bg-transparent">
			<q-tab-panel name="background">
				<ValidationObserver v-slot="{ valid }">
					<hk-input
						v-model="background.image"
						label="Background image"
						name="Background image"
						rules="url"
						class="mb-2"
						clearable
						:disable="disableBackground('image')"
						@input="
							(value) => {
								if (!value) {
									$delete(background, 'image');
								}
							}
						"
					>
						<hk-icon slot="prepend" icon="fas fa-image" />
					</hk-input>
					<hk-input
						v-model="background.video"
						label="Background video"
						name="Background video"
						rules="url"
						class="mb-2"
						clearable
						:disable="disableBackground('video')"
						@input="
							(value) => {
								if (!value) {
									$delete(background, 'video');
								}
							}
						"
					>
						<hk-icon slot="prepend" icon="fas fa-video" />
					</hk-input>
					<hk-input
						v-model="background.youtube"
						label="Background Youtube video"
						name="Background youtube"
						rules="url"
						class="mb-2"
						clearable
						:disable="disableBackground('youtube')"
						@input="
							(value) => {
								if (!value) {
									$delete(background, 'youtube');
								}
							}
						"
					>
						<hk-icon slot="prepend" icon="fab fa-youtube" />
					</hk-input>
					<div class="actions">
						<button class="btn bg-neutral-5" @click="clearBackground">Clear</button>
						<button
							class="btn"
							@click="valid ? setBackground() : null"
							:disabled="isEmpty(background) || !valid"
						>
							Set
						</button>
					</div>
				</ValidationObserver>
			</q-tab-panel>

			<q-tab-panel name="share">
				<ValidationObserver v-slot="{ valid }">
					<hk-input
						v-model="share.image"
						label="Share image"
						name="Share image"
						rules="url"
						class="mb-2"
						clearable
						:disable="disableShare('image')"
						@input="
							(value) => {
								if (!value) {
									$delete(share, 'image');
								}
							}
						"
					>
						<hk-icon slot="prepend" icon="fas fa-image" />
					</hk-input>
					<hk-input
						v-model="share.youtube"
						label="Share Youtube video"
						name="Share Youtube video"
						rules="url"
						class="mb-2"
						clearable
						:disable="disableShare('youtube')"
						@input="
							(value) => {
								if (!value) {
									$delete(share, 'youtube');
								}
							}
						"
					>
						<hk-icon slot="prepend" icon="fab fa-youtube" />
					</hk-input>
					<hk-input
						v-model="share.message"
						label="Share message"
						name="Share message"
						type="textarea"
						rules="max:1000"
						maxlength="1001"
						class="mb-2"
						clearable
						:disable="disableShare('message')"
						@input="
							(value) => {
								if (!value) {
									$delete(share, 'message');
								}
							}
						"
					/>
					<div class="actions">
						<button
							class="btn btn-block"
							:disabled="isEmpty(share) || !valid"
							@click="valid ? startShare() : null"
						>
							Share
						</button>
					</div>
				</ValidationObserver>
			</q-tab-panel>

			<q-tab-panel name="weather">
				<Weather v-model="weather" class="pb-4" :disabled="tier.price === 'Free'" />
				<div class="actions">
					<template v-if="tier.price !== 'Free'">
						<button class="btn bg-neutral-5" @click="clearWeather">Clear</button>
						<button class="btn" :disabled="isEmpty(weather)" @click="setWeather">Set</button>
					</template>
					<template v-else>
						<button v-if="!isEmpty(weather)" class="btn bg-neutral-5" @click="clearWeather">
							Clear
						</button>
						<router-link v-else to="/pricing" class="btn bg-patreon-red"
							>Get a subscription</router-link
						>
					</template>
				</div>
			</q-tab-panel>
		</q-tab-panels>
	</div>
	<Sharing v-else @stop="stopShare" />
</template>

<script>
import { generateYoutubeEmbedUrl } from "src/utils/generalFunctions";
import Weather from "src/components/encounters/Weather.vue";
import Sharing from "./Sharing.vue";
import { mapGetters, mapActions } from "vuex";
import { isEmpty } from "lodash";

export default {
	name: "CampaignShare",
	props: {
		campaign: {
			type: Object,
		},
	},
	components: {
		Weather,
		Sharing,
	},
	data() {
		return {
			campaignId: this.$route.params.campid,
			isEmpty: isEmpty,
			tab: "background",
			tabs: [
				{
					name: "background",
					label: "Background",
					icon: "fas fa-image",
				},
				{
					name: "share",
					label: "Share",
					icon: "fas fa-share-alt",
				},
				{
					name: "weather",
					label: "Weather",
					icon: "fas fa-cloud-rain",
				},
			],
			share: {},
			weather: this.campaign.weather || {},
			background: this.campaign.temporary_background || {},
		};
	},
	computed: {
		...mapGetters(["broadcast", "tier"]),
	},
	methods: {
		...mapActions(["setDrawer"]),
		...mapActions("campaigns", ["set_campaign_prop"]),
		showBadge(tab) {
			switch (tab) {
				case "background":
					return !!this.campaign.temporary_background;
				case "share":
					return !!this.campaign.sharing;
				case "weather":
					return !!this.campaign.weather;
			}
		},
		disableShare(property) {
			return !isEmpty(this.share) && !Object.keys(this.share).includes(property);
		},
		disableBackground(property) {
			return !isEmpty(this.background) && !Object.keys(this.background).includes(property);
		},
		startShare() {
			if (this.share.youtube) {
				this.share.youtube = generateYoutubeEmbedUrl(this.share.youtube);
			}
			this.set_campaign_prop({
				id: this.campaignId,
				property: "sharing",
				value: this.share,
			});
		},
		stopShare() {
			this.set_campaign_prop({
				id: this.campaignId,
				property: "sharing",
				value: null,
			});
		},
		setBackground() {
			if (this.background.youtube) {
				this.background.youtube = generateYoutubeEmbedUrl(this.background.youtube);
			}
			this.set_campaign_prop({
				id: this.campaignId,
				property: "temporary_background",
				value: this.background,
			});
		},
		clearBackground() {
			this.set_campaign_prop({
				id: this.campaignId,
				property: "temporary_background",
				value: null,
			});
			this.background = {};
		},
		setWeather() {
			this.set_campaign_prop({
				id: this.campaignId,
				property: "weather",
				value: this.weather,
			});
		},
		clearWeather() {
			this.set_campaign_prop({
				id: this.campaignId,
				property: "weather",
				value: null,
			});
			this.weather = {};
		},
	},
};
</script>

<style lang="scss" scoped>
.q-tabs {
	background-color: $neutral-8;
	position: sticky;
	top: 0;
	z-index: 10;

	.q-tab {
		&--active {
			color: $blue;
		}
	}
}
.q-tab-panels {
	position: static;
}

.q-tab-panel {
	position: static;
	padding-bottom: 40px;
}
.actions {
	position: absolute;
	display: flex;
	justify-content: flex-end;
	gap: 8px;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 8px;
	width: 100% !important;
	z-index: 40;
	background: $neutral-6;
}
.not-live {
	text-align: center;
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	background-color: #00000091;
	z-index: 50;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
