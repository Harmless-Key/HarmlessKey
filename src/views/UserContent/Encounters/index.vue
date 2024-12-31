<template>
	<div v-if="!loading_active">
		<!-- SHOW ENCOUNTERS -->
		<div class="pane__header">
			<span>
				<span>
					<span class="content-count">
						<span
							:class="
								encounter_count > tier.benefits.encounters
									? 'red'
									: encounter_count == tier.benefits.encounters
										? 'neutral-2'
										: 'green'
							"
						>
							{{ encounter_count || 0 }}
						</span>
						/
						<i
							aria-hidden="true"
							v-if="tier.benefits.encounters === 'infinite'"
							class="far fa-infinity"
						/>
						<template v-else>{{ tier.benefits.encounters }}</template>
					</span>
				</span>
				Encounters
			</span>
			<button
				v-if="
					tier.benefits.encounters === 'infinite' ||
					(!overencumbered && encounter_count < tier.benefits.encounters)
				"
				@click="add = !add"
				class="btn btn-sm bg-neutral-5"
			>
				<i aria-hidden="true" class="fas fa-plus green" />
				New encounter
			</button>
			<router-link
				v-else-if="overencumbered"
				class="btn btn-sm ml-1 bg-neutral-5"
				to="/content/manage"
			>
				<i aria-hidden="true" class="fas fa-box-full red mr-1" />
				Over encumbered
			</router-link>
			<router-link v-else class="btn btn-sm ml-1" to="/pricing">
				<i aria-hidden="true" class="fab fa-patreon patreon-red mr-1" />
				Get more slots
			</router-link>
		</div>

		<div class="pane__content">
			<div class="first-encounter" v-if="!encounter_count">
				<q-form @submit="addEncounter">
					<h2 class="mt-0">First encounter</h2>
					<q-input
						:dark="$store.getters.theme === 'dark'"
						filled
						square
						label="Encounter title"
						type="text"
						autocomplete="off"
						v-model="newEncounter"
						:rules="[(val) => (val && val.length > 0) || 'Enter a title']"
					/>

					<q-btn
						class="btn btn-lg bg-green btn-block mt-4"
						label="Create encounter"
						no-caps
						type="submit"
						padding="0"
					/>
				</q-form>
			</div>

			<!-- ACTIVE ENCOUNTERS -->
			<template v-if="active_encounters.length">
				<q-input
					:dark="$store.getters.theme !== 'light'"
					v-model="search"
					square
					debounce="300"
					clearable
					placeholder="Search encounter"
				>
					<q-icon slot="prepend" name="search" />
				</q-input>
				<q-table
					:data="active_encounters"
					:columns="columns"
					:visible-columns="visibleColumns"
					row-key="key"
					card-class="bg-none"
					flat
					:dark="$store.getters.theme !== 'light'"
					separator="none"
					:pagination="{ rowsPerPage: 15 }"
					:filter="search"
					wrap-cells
				>
					<template v-slot:body="props">
						<q-tr :props="props">
							<q-td
								v-for="col in props.cols"
								:key="col.name"
								:props="props"
								:auto-width="col.name !== 'name'"
							>
								<template v-if="col.name !== 'actions'">
									<router-link
										v-if="!overencumbered && col.name === 'name' && props.row.entity_count"
										:to="`/run-encounter/${campaignId}/${props.key}`"
									>
										{{ col.value }}
									</router-link>
									<template v-else>
										{{ col.value }}
									</template>
								</template>
								<div v-else class="text-right d-flex justify-content-end">
									<router-link
										v-if="props.row.entity_count && !overencumbered"
										class="btn btn-sm bg-neutral-5 mr-1"
										:to="'/run-encounter/' + campaignId + '/' + props.key"
									>
										<i aria-hidden="true" class="fas fa-play"></i>
										<q-tooltip anchor="top middle" self="center middle"> Run encounter </q-tooltip>
									</router-link>
									<a v-else class="disabled btn btn-sm mr-1 bg-neutral-5">
										<i aria-hidden="true" class="fas fa-play"></i>
									</a>
									<router-link
										v-if="!overencumbered"
										class="mr-1 btn btn-sm bg-neutral-5"
										:to="'/content/campaigns/' + campaignId + '/' + props.key"
									>
										<i aria-hidden="true" class="fas fa-pencil-alt"></i>
										<q-tooltip anchor="top middle" self="center middle"> Edit </q-tooltip>
									</router-link>
									<a
										class="mr-1 btn btn-sm bg-neutral-5"
										v-if="!overencumbered"
										@click="dialogCloneEncounter(props.key)"
									>
										<i aria-hidden="true" class="fas fa-copy"></i>
										<q-tooltip anchor="top middle" self="center middle"> Clone </q-tooltip>
									</a>
									<a
										class="btn btn-sm bg-neutral-5"
										@click="deleteEncounter($event, props.key, props.row.name)"
									>
										<i aria-hidden="true" class="fas fa-trash-alt"></i>
										<q-tooltip anchor="top middle" self="center middle"> Delete </q-tooltip>
									</a>
								</div>
							</q-td>
						</q-tr>
					</template>
					<div slot="no-data" />
				</q-table>
			</template>

			<!-- FINISHED ENCOUNTERS -->
			<template v-if="finished_encounters.length">
				<div class="d-flex justify-content-between">
					<strong>Finished encounters</strong>
					<a class="btn btn-sm bg-neutral-5" @click="deleteFinishedEncounters">
						<i aria-hidden="true" class="fas fa-trash-alt mr-1 red" />
						Delete all
					</a>
				</div>

				<div>
					<q-table
						:data="finished_encounters"
						:columns="columns"
						row-key="key"
						card-class="bg-none"
						flat
						:dark="$store.getters.theme !== 'light'"
						separator="none"
						:pagination="{ rowsPerPage: 5 }"
						wrap-cells
					>
						<template v-slot:body="props">
							<q-tr :props="props">
								<q-td
									v-for="col in props.cols"
									:key="col.name"
									:props="props"
									:auto-width="col.name !== 'name'"
								>
									<template v-if="col.name !== 'actions'">
										<router-link
											v-if="col.name === 'name' && props.row.entity_count && !overencumbered"
											:to="`/run-encounter/${campaignId}/${props.key}`"
										>
											{{ col.value }}
										</router-link>
										<template v-else>
											{{ col.value }}
										</template>
									</template>
									<div v-else class="text-right d-flex justify-content-end">
										<router-link
											v-if="!overencumbered"
											class="btn btn-sm bg-neutral-5"
											:to="`/run-encounter/${campaignId}/${props.key}`"
										>
											<i aria-hidden="true" class="fas fa-eye"></i>
											<q-tooltip anchor="top middle" self="center middle"> View </q-tooltip>
										</router-link>
										<a
											class="btn btn-sm bg-neutral-5 ml-1"
											@click="reset(props.key, (hard = false))"
										>
											<i aria-hidden="true" class="fas fa-trash-restore-alt"></i>
											<q-tooltip anchor="top middle" self="center middle"> Unfinish </q-tooltip>
										</a>
										<a
											v-if="!overencumbered"
											class="btn btn-sm bg-neutral-5 mx-1"
											@click="reset(props.key)"
										>
											<i aria-hidden="true" class="fas fa-undo"></i>
											<q-tooltip anchor="top middle" self="center middle"> Reset </q-tooltip>
										</a>
										<a
											class="mr-1 btn btn-sm bg-neutral-5"
											v-if="!overencumbered"
											@click="dialogCloneEncounter(props.key)"
										>
											<i aria-hidden="true" class="fas fa-copy"></i>
											<q-tooltip anchor="top middle" self="center middle"> Clone </q-tooltip>
										</a>
										<a
											class="btn btn-sm bg-neutral-5"
											@click="deleteEncounter($event, props.key, props.row.name)"
										>
											<i aria-hidden="true" class="fas fa-trash-alt"></i>
											<q-tooltip anchor="top middle" self="center middle"> Delete </q-tooltip>
										</a>
									</div>
								</q-td>
							</q-tr>
						</template>
						<div slot="no-data" />
						<hk-loader slot="loading" name="Encounters" />
					</q-table>
					<button
						v-if="encounter_count > active_encounters.length + finished_encounters.length"
						class="btn btn-block mb-2 bg-neutral-5"
						@click="getFinishedEncounters"
					>
						Get all finished encounters
					</button>
				</div>
			</template>
			<template v-else-if="encounter_count > active_encounters.length">
				<template v-if="!loading_finished">
					<q-banner
						v-if="finished_fetched"
						:dark="$store.getters.theme !== 'light'"
						rounded
						inline-actions
						class="mb-3"
					>
						No finished encounters found.
						<q-btn
							slot="action"
							size="sm"
							flat
							padding="sm"
							no-caps
							icon="fas fa-times"
							@click="finished_fetched = false"
						/>
					</q-banner>
					<button class="btn btn-block mb-2 bg-neutral-5" @click="getFinishedEncounters">
						Get finished encounters
					</button>
					<p class="text-center">
						<small>Your finished encounters count towards your total.</small>
					</p>
				</template>
				<hk-card v-else>
					<hk-loader name="encounters" />
				</hk-card>
			</template>
			<q-resize-observer @resize="setSize" />
		</div>

		<!-- New encounter dialog -->
		<q-dialog
			v-if="
				add &&
				(encounter_count < tier.benefits.encounters || tier.benefits.encounters == 'infinite')
			"
			v-model="add"
			square
		>
			<div>
				<q-form @submit="addEncounter">
					<hk-card header="New encounter" class="mb-0">
						<div class="card-body">
							<q-input
								:dark="$store.getters.theme === 'dark'"
								filled
								square
								label="Encounter title"
								type="text"
								autocomplete="off"
								v-model="newEncounter"
								:rules="[(val) => (val && val.length > 0) || 'Enter a title']"
							/>
						</div>
						<div slot="footer" class="card-footer d-flex justify-content-end">
							<q-btn v-close-popup class="mr-1" no-caps>Cancel</q-btn>
							<q-btn color="primary" type="submit" no-caps label="Add encounter" />
						</div>
					</hk-card>
				</q-form>
			</div>
		</q-dialog>

		<!-- Clone encounter dialog -->
		<q-dialog
			v-if="
				clone &&
				(encounter_count < tier.benefits.encounters || tier.benefits.encounters == 'infinite')
			"
			v-model="clone"
			square
		>
			<div>
				<q-form @submit="cloneEncounter">
					<hk-card header="Clone encounter" class="mb-0">
						<div class="card-body">
							<q-input
								:dark="$store.getters.theme === 'dark'"
								filled
								square
								label="Encounter title"
								type="text"
								autocomplete="off"
								v-model="cloneEncounterData.name"
								:rules="[(val) => (val && val.length > 0) || 'Enter a title']"
							/>
						</div>
						<div slot="footer" class="card-footer d-flex justify-content-end">
							<q-btn v-close-popup class="mr-1" no-caps>Cancel</q-btn>
							<q-btn color="primary" type="submit" no-caps label="Add encounter" />
						</div>
					</hk-card>
				</q-form>
			</div>
		</q-dialog>
	</div>
	<hk-loader v-else name="encounters" />
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
	name: "Encounters",
	data() {
		return {
			user: this.$store.getters.user,
			campaignId: this.$route.params.campid,
			card_width: 0,
			loading_active: true,
			loading_finished: false,
			finished_fetched: false,
			newEncounter: "",
			add: false,
			clone: false,
			cloneEncounterData: {
				name: undefined,
				key: undefined,
				ogEncounter: undefined,
			},
			currentPage: 1,
			search: undefined,
			columns: [
				{
					name: "name",
					label: "Name",
					field: "name",
					sortable: true,
					align: "left",
					classes: "truncate-cell",
				},
				{
					name: "entities",
					label: "Entities",
					field: "entity_count",
					align: "left",
					style: "width: 40px",
					headerStyle: "width: 40px",
				},
				{
					name: "round",
					label: "Round",
					field: "round",
					align: "left",
					style: "width: 40px",
					headerStyle: "width: 40px",
				},
				{
					name: "turn",
					label: "Turn",
					field: "turn",
					align: "left",
					style: "width: 40px",
					headerStyle: "width: 40px",
					format: (val) => val + 1,
				},
				{
					name: "actions",
					label: "",
					align: "right",
				},
			],
		};
	},
	async mounted() {
		await this.get_campaign_encounters({ campaignId: this.campaignId });
		this.loading_active = false;
	},
	computed: {
		...mapGetters(["tier", "overencumbered"]),
		...mapGetters("encounters", ["get_encounters", "get_encounter_count"]),
		visibleColumns() {
			return this.card_width > 450
				? ["name", "entities", "round", "turn", "actions"]
				: ["name", "actions"];
		},
		encounter_count() {
			return this.get_encounter_count(this.campaignId);
		},
		active_encounters() {
			return this.get_encounters(this.campaignId, false);
		},
		finished_encounters() {
			return this.get_encounters(this.campaignId, true);
		},
	},
	methods: {
		...mapActions("encounters", [
			"get_campaign_encounters",
			"get_encounter",
			"add_encounter",
			"delete_encounter",
			"delete_finished_encounters",
			"finish_encounter",
			"reset_encounter",
		]),
		setSize(e) {
			this.card_width = e.width;
		},
		async getFinishedEncounters() {
			this.loading_finished = true;
			await this.get_campaign_encounters({ campaignId: this.campaignId, finished: true });
			this.loading_finished = false;
			this.finished_fetched = true;
		},
		async addEncounter() {
			this.add = false;
			await this.add_encounter({
				campaignId: this.campaignId,
				encounter: {
					name: this.newEncounter,
					round: 0,
					turn: 0,
					finished: false,
					timestamp: Date.now(),
				},
			});
			this.newEncounter = "";
			this.$snotify.success("Encounter added.", "Critical hit!", {
				position: "rightTop",
			});
		},
		deleteEncounter(e, key, encounter) {
			//Instantly delete when shift is held
			if (e.shiftKey) {
				this.delete_encounter({
					campaignId: this.campaignId,
					id: key,
				});
			} else {
				this.$snotify.error(
					'Are you sure you want to delete "' + encounter + '"?',
					"Delete encounter",
					{
						timeout: 5000,
						buttons: [
							{
								text: "Yes",
								action: (toast) => {
									this.delete_encounter({
										campaignId: this.campaignId,
										id: key,
									});
									this.$snotify.remove(toast.id);
								},
								bold: false,
							},
							{
								text: "No",
								action: (toast) => {
									this.$snotify.remove(toast.id);
								},
								bold: false,
							},
						],
					}
				);
			}
		},
		async dialogCloneEncounter(key) {
			this.clone = true;
			this.cloneEncounterData.key = key;
			const ogEncounter = JSON.parse(
				JSON.stringify(
					await this.get_encounter({
						uid: this.user.uid,
						campaignId: this.campaignId,
						id: key,
					})
				)
			);
			this.cloneEncounterData.ogEncounter = ogEncounter;
			this.cloneEncounterData.name = ogEncounter.name;
		},
		async cloneEncounter() {
			const encounter = this.cloneEncounterData.ogEncounter;
			encounter.name = this.cloneEncounterData.name;
			const new_id = await this.add_encounter({
				campaignId: this.campaignId,
				encounter,
			});
			await this.reset_encounter({ campaignId: this.campaignId, id: new_id });
			this.clone = false;
			this.cloneEncounterData = {
				name: undefined,
				key: undefined,
				ogEncounter: undefined,
			};
		},
		async deleteFinishedEncounters() {
			this.$snotify.error(
				"Are you sure you want to delete all finished encounters?",
				"Delete finished encounters",
				{
					timeout: 5000,
					buttons: [
						{
							text: "Yes",
							action: async (toast) => {
								await this.delete_finished_encounters(this.campaignId);
								this.$snotify.remove(toast.id);
							},
							bold: false,
						},
						{
							text: "No",
							action: (toast) => {
								this.$snotify.remove(toast.id);
							},
							bold: false,
						},
					],
				}
			);
		},
		reset(id, hard = true) {
			if (hard) {
				this.reset_encounter({ campaignId: this.campaignId, id });
			} else {
				this.finish_encounter({ campaignId: this.campaignId, id, finished: false });
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.actions {
	a.disabled {
		color: #494747 !important;
		cursor: default !important;
		&:hover {
			background-color: transparent;
		}
	}
}
</style>
