<template>
	<div v-if="tier">
		<hk-card>
			<ContentHeader type="spells">
				<ExportUserContent
					slot="actions-left"
					class="btn-sm bg-neutral-5 mr-2"
					content-type="spell"
					:content-id="spellIds"
				>
					<span>Export</span>
				</ExportUserContent>
				<button
					v-if="tier.price !== 'Free'"
					slot="actions-right"
					class="btn btn-sm bg-neutral-5 mr-2"
					@click="import_dialog = true"
				>
					Import
				</button>
			</ContentHeader>

			<div class="card-body" v-if="!loading_spells">
				<p class="neutral-2">These are your custom spells.</p>
				<template v-if="spells.length">
					<q-input
						:dark="$store.getters.theme !== 'light'"
						v-model="search"
						borderless
						filled
						square
						debounce="300"
						clearable
						placeholder="Search spells"
					>
						<q-icon slot="prepend" name="search" />
					</q-input>

					<q-table
						:data="spells"
						:columns="columns"
						row-key="key"
						card-class="bg-none"
						flat
						:dark="$store.getters.theme !== 'light'"
						:loading="loading_spells"
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
										<router-link v-if="col.name === 'name'" :to="`${$route.path}/${props.key}`">
											{{ col.value }}
										</router-link>
										<template v-else>
											{{ col.value }}
										</template>
									</template>
									<div v-else class="d-flex justify-content-end">
										<router-link
											class="btn btn-sm bg-neutral-5"
											:to="`${$route.path}/${props.key}`"
										>
											<i aria-hidden="true" class="fas fa-pencil" />
											<q-tooltip anchor="top middle" self="center middle">Edit</q-tooltip>
										</router-link>
										<ExportUserContent
											class="btn-sm bg-neutral-5 mx-2"
											content-type="spell"
											:content-id="props.key"
										/>
										<button
											class="btn btn-sm bg-neutral-5"
											@click="confirmDelete($event, props.key, props.row)"
										>
											<i aria-hidden="true" class="fas fa-trash-alt" />
											<q-tooltip anchor="top middle" self="center middle">Delete</q-tooltip>
										</button>
									</div>
								</q-td>
							</q-tr>
						</template>
						<div slot="no-data" />
						<hk-loader slot="loading" name="spells" />
					</q-table>
				</template>

				<router-link
					v-if="!spells.length && !overencumbered"
					class="btn btn-lg bg-neutral-5"
					to="/content/spells/add-spell"
				>
					<i aria-hidden="true" class="fas fa-plus green mr-1" /> Create your first Spell
				</router-link>
				<router-link
					v-else-if="tier.price === 'Free'"
					class="btn bg-neutral-8 btn-block"
					to="/pricing"
				>
					Get more spell slots
				</router-link>
			</div>
			<hk-loader v-else name="spells" />
		</hk-card>

		<!-- Bulk import dialog -->
		<q-dialog v-model="import_dialog">
			<hk-card :minWidth="400">
				<div slot="header" class="card-header">
					<span>Import spells from JSON</span>
					<q-btn padding="sm" size="sm" no-caps icon="fas fa-times" flat v-close-popup />
				</div>
				<div class="card-body">
					<ImportUserContent type="spells" />
				</div>
			</hk-card>
		</q-dialog>
	</div>
</template>

<script>
import numeral from "numeral";
import { mapActions, mapGetters } from "vuex";
import ContentHeader from "src/components/userContent/ContentHeader";
import ImportUserContent from "src/components/userContent/ImportUserContent.vue";
import { downloadJSON } from "src/utils/generalFunctions";
import ExportUserContent from "src/components/userContent/ExportUserContent";

export default {
	name: "Spells",
	components: {
		ContentHeader,
		ImportUserContent,
		ExportUserContent,
	},
	data() {
		return {
			userId: this.$store.getters.user.uid,
			import_dialog: false,
			loading_spells: true,
			search: "",
			columns: [
				{
					name: "name",
					label: "Name",
					field: "name",
					sortable: true,
					align: "left",
					classes: "truncate-cell",
					format: (val) => val.capitalizeEach(),
				},
				{
					name: "school",
					label: "School",
					field: "school",
					sortable: true,
					align: "left",
					format: (val) => val.capitalize(),
				},
				{
					name: "level",
					label: "Level",
					field: "level",
					sortable: true,
					align: "left",
					headerStyle: "min-width: 80px;",
					format: (val) => this.spellLevel(val),
				},
				{
					name: "actions",
					label: "",
					align: "right",
				},
			],
		};
	},
	computed: {
		...mapGetters(["tier", "overencumbered"]),
		...mapGetters("spells", ["spells"]),
		spellIds() {
			return this.spells.map((spell) => spell.key);
		},
	},
	async mounted() {
		await this.get_spells();
		this.update_spell_count();
		this.loading_spells = false;
	},
	methods: {
		...mapActions(["setDrawer"]),
		...mapActions("spells", ["get_spells", "get_spell", "delete_spell", "update_spell_count"]),
		spellLevel(level) {
			return level === 0 ? "Cantrip" : numeral(level).format("0o");
		},
		confirmDelete(e, key, spell) {
			//Instantly delete when shift is held
			if (e.shiftKey) {
				this.deleteSpell(key);
			} else {
				this.$snotify.error("Are you sure you want to delete " + spell.name + "?", "Delete spell", {
					timeout: false,
					buttons: [
						{
							text: "Yes",
							action: (toast) => {
								this.deleteSpell(key);
								this.$snotify.remove(toast.id);
							},
							bold: false,
						},
						{
							text: "No",
							action: (toast) => {
								this.$snotify.remove(toast.id);
							},
							bold: true,
						},
					],
				});
			}
		},
		deleteSpell(key) {
			this.delete_spell(key);
		},
	},
};
</script>
