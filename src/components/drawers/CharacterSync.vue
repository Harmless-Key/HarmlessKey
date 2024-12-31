<template>
	<q-no-ssr>
		<h3>Character Sync</h3>
		<div v-if="browser !== 'Chrome'" class="red mb-2">
			Google
			<a href="https://chrome.google.com" target="_blank" rel="noopener">Chrome</a>
			is needed for this feature to work.
		</div>

		<!-- No extension -->
		<template v-if="!extensionVersion">
			<p>A Google Chrome Extension is needed to Sync your characters from other resources.</p>
			<a
				class="btn btn-block"
				:href="`https://chrome.google.com/webstore/detail/dd-character-sync/${extension_id}`"
				target="_blank"
				rel="noopener"
			>
				Install D&D Character Sync
			</a>
		</template>

		<!-- Version too low -->
		<template v-if="extensionVersion < '0.2.1'">
			<strong class="orange">Version too low</strong>
			<span class="neutral-3"> (0.2.1 or higher required)</span>
			<p>A newer version of the <strong>D&D Character Sync</strong> extension is required</p>
			<div class="extension-icon mb-1" />
			- Right click on the extension's icon<br />
			- Click <strong>Manage extension</strong> and then the <strong>Update</strong> button -
			Refresh this page
		</template>

		<!-- Has extension and correct version -->
		<q-stepper v-else :dark="$store.getters.theme === 'dark'" v-model="step" vertical animated>
			<q-step
				v-for="({ title, description, icon }, i) in steps"
				:name="i"
				:title="title"
				:icon="icon"
				:active-icon="icon"
				done-icon="fas fa-check white"
				done-color="positive"
				:done="step > i"
				:key="`step-${i}`"
			>
				<div v-html="description" />

				<div v-if="i === 0" class="extension-icon" />

				<q-stepper-navigation>
					<q-btn v-if="step > 0" label="Previous" no-caps @click="previous" class="mr-1" />
					<q-btn
						color="primary"
						label="Next"
						no-caps
						@click="next"
						v-if="step < steps.length - 1"
					/>
				</q-stepper-navigation>
			</q-step>
		</q-stepper>
		<template v-if="tier.price === 'Free'">
			<hr />
			<p>This feature is only available with a subscription.</p>
			<router-link to="/pricing" class="btn btn-block bg-patreon-red"
				>Get a subscription</router-link
			>
		</template>
	</q-no-ssr>
</template>

<script>
import { extensionInstalled } from "src/utils/generalFunctions";
import { browserDetect } from "src/functions";
import { mapGetters } from "vuex";
import { character_sync_id } from "src/utils/generalConstants";

export default {
	name: "CharacterSync",
	data() {
		return {
			extensionVersion: false,
			extension_id: character_sync_id,
			browser: browserDetect(),
			step: 0,
			steps: [
				{
					title: "Store Characters",
					description:
						"First store at least one character in the <strong>D&D Character Sync</strong> extension.<br/>" +
						"Open the extension and follow the steps to sync. With the extension you can save any character you want, also those of your players.",
					icon: "fas fa-download",
				},
				{
					title: "Link a Character",
					description:
						"<p>Link a Character from the extension to a Player in Shieldmaiden.<br/>" +
						'If you now revisit your player overview, there are <button class="btn btn-sm bg-neutral-5"><i class="fas fa-link" aria-hidden="true"></i></button> ' +
						'buttons next to each player to link a character with <span class="neutral-3">*</span>.</p>' +
						'<small class="neutral-3">* Only if you have a Shieldmaiden subscription</small>',
					icon: "fas fa-link",
				},
				{
					title: "Sync Character",
					description:
						"<p>Now that you linked a character to your player, you can sync the stats from the extension " +
						'to Shieldmaiden with one click on the <button class="btn btn-sm bg-neutral-5"><i class="fas fa-sync-alt" aria-hidden="true"></i></button> button.</p>' +
						"Every time changes are made to the original character sheet, it has to be revisited to update it in the extension, then the Sync button in Shieldmaiden must be used to update the player again.",
					icon: "fas fa-sync-alt",
				},
			],
		};
	},
	computed: {
		...mapGetters(["tier"]),
	},
	methods: {
		previous() {
			this.step--;
		},
		next() {
			this.step++;
		},
	},
	async mounted() {
		this.extensionVersion = await extensionInstalled();
	},
};
</script>

<style lang="scss" scoped>
.q-stepper {
	border: none;
	padding: 0;
}
.extension-icon {
	border-radius: 25px;
	margin-top: 15px;
	height: 50px;
	width: 165px;
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url("../../assets/_img/CharacterSyncExtensionIcon.webp");
}
</style>
