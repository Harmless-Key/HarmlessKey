<template>
	<div v-if="tier">
		<hk-card>
			<ContentHeader type="npcs">
				<ExportUserContent
					slot="actions-left"
					class="btn-sm bg-neutral-5 mr-2"
					content-type="npc"
					:content-id="npcIds"
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

			<div class="card-body" v-if="!loading_npcs">
				<p class="neutral-2">These are your custom Non-Player Characters and monsters.</p>
				<template v-if="npcs.length">
					<q-input
						:dark="$store.getters.theme !== 'light'"
						v-model="search"
						borderless
						filled
						square
						debounce="300"
						clearable
						placeholder="Search NPCs"
					>
						<q-icon slot="prepend" name="search" />
					</q-input>

					<q-table
						:data="npcs"
						:visible-columns="visibleColumns"
						:columns="columns"
						row-key="key"
						card-class="bg-none"
						flat
						:dark="$store.getters.theme !== 'light'"
						:loading="loading_npcs"
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
									:style="
										col.name === 'avatar' && avatar(props.row)
											? `background-image: url('${avatar(props.row)}')`
											: ''
									"
								>
									<template v-if="col.name === 'avatar'">
										<i aria-hidden="true" v-if="!avatar(props.row)" class="hki-monster" />
									</template>
									<template v-else-if="col.name !== 'actions'">
										<router-link v-if="col.name === 'name'" :to="`${$route.path}/${props.key}`">
											{{ col.value }}
										</router-link>
										<template v-else>
											{{ col.value }}
										</template>
									</template>
									<div v-else class="text-right d-flex justify-content-between">
										<router-link
											class="btn btn-sm bg-neutral-5"
											:to="`${$route.path}/${props.key}`"
										>
											<i aria-hidden="true" class="fas fa-pencil" />
											<q-tooltip anchor="top middle" self="center middle"> Edit </q-tooltip>
										</router-link>
										<ExportUserContent
											class="btn-sm bg-neutral-5 mx-2"
											content-type="npc"
											:content-id="props.key"
										/>
										<a
											class="btn btn-sm bg-neutral-5"
											@click="confirmDelete($event, props.key, props.row)"
										>
											<i aria-hidden="true" class="fas fa-trash-alt" />
											<q-tooltip anchor="top middle" self="center middle"> Delete </q-tooltip>
										</a>
									</div>
								</q-td>
							</q-tr>
						</template>
						<div slot="no-data" />
						<hk-loader slot="loading" name="NPCs" />
					</q-table>
				</template>

				<router-link
					v-if="!npcs.length && !overencumbered"
					class="btn btn-lg bg-neutral-5"
					to="/content/npcs/add-npc"
				>
					<i aria-hidden="true" class="fas fa-plus green mr-1" /> Create your first NPC
				</router-link>
				<router-link
					v-else-if="tier.price === 'Free'"
					class="btn bg-neutral-8 btn-block"
					to="/pricing"
				>
					Get more NPC slots
				</router-link>
				<q-resize-observer @resize="setSize" />
			</div>
			<hk-loader v-else name="NPCs" />
		</hk-card>

		<!-- Bulk import dialog -->
		<q-dialog v-model="import_dialog">
			<hk-card :minWidth="400">
				<div slot="header" class="card-header">
					<span>Import NPC from JSON</span>
					<q-btn padding="sm" size="sm" no-caps icon="fas fa-times" flat v-close-popup />
				</div>
				<div class="card-body">
					<ImportUserContent type="npcs" />
				</div>
			</hk-card>
		</q-dialog>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { monsterMixin } from "src/mixins/monster";
import ImportUserContent from "src/components/userContent/ImportUserContent.vue";
import ContentHeader from "src/components/userContent/ContentHeader";
import ExportUserContent from "src/components/userContent/ExportUserContent";

export default {
	name: "Npcs",
	mixins: [monsterMixin],
	components: {
		ImportUserContent,
		ContentHeader,
		ExportUserContent,
	},
	data() {
		return {
			userId: this.$store.getters.user.uid,
			import_dialog: false,
			loading_npcs: true,
			search: "",
			card_width: 0,
			overwrite: undefined,
			columns: [
				{
					name: "avatar",
					label: "",
					field: "avatar",
					align: "left",
					classes: "avatar",
				},
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
					name: "type",
					label: "Type",
					field: "type",
					align: "left",
					sortable: true,
				},
				{
					name: "challenge_rating",
					label: "CR",
					field: "challenge_rating",
					headerStyle: "min-width: 70px;",
					align: "left",
					sortable: true,
					format: (val) => this.cr(val),
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
		...mapGetters("npcs", ["npcs"]),
		...mapGetters("players", ["players"]),
		...mapGetters("campaigns", ["campaigns"]),
		visibleColumns() {
			return this.card_width > 600
				? ["avatar", "name", "type", "challenge_rating", "actions"]
				: this.card_width > 450
					? ["avatar", "name", "type", "actions"]
					: ["avatar", "name", "actions"];
		},
		npcIds() {
			return this.npcs.map((npc) => npc.key);
		},
	},
	async mounted() {
		await this.get_npcs();
		this.update_npc_count();

		this.loading_npcs = false;
	},
	methods: {
		...mapActions(["setDrawer"]),
		...mapActions("npcs", [
			"get_npcs",
			"delete_npc",
			"get_npc",
			"get_full_npcs",
			"add_npc",
			"update_npc_count",
		]),
		...mapActions("spells", ["get_spell"]),
		cr(val) {
			return val == 0.125 ? "1/8" : val == 0.25 ? "1/4" : val == 0.5 ? "1/2" : val;
		},
		avatar(npc) {
			return npc.storage_avatar || npc.avatar;
		},
		confirmDelete(e, key, npc) {
			//Instantly delete when shift is held
			if (e.shiftKey) {
				this.deleteNpc(key);
			} else {
				this.$snotify.error("Are you sure you want to delete " + npc.name + "?", "Delete NPC", {
					timeout: false,
					buttons: [
						{
							text: "Yes",
							action: (toast) => {
								this.deleteNpc(key);
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
		deleteNpc(key) {
			this.delete_npc(key);
		},

		setSize(e) {
			this.card_width = e.width;
		},
	},
};
</script>
