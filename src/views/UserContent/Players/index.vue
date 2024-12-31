<template>
	<hk-card v-if="tier">
		<ContentHeader type="players" />
		<div class="card-body" v-if="!loading_players">
			<p class="neutral-2">These are the players you can use in your campaigns.</p>

			<template v-if="players.length">
				<q-input
					:dark="$store.getters.theme !== 'light'"
					v-model="search"
					borderless
					filled
					square
					debounce="300"
					clearable
					placeholder="Search players"
				>
					<q-icon slot="prepend" name="search" />
				</q-input>

				<q-table
					:data="players"
					:columns="columns"
					row-key="key"
					card-class="bg-none"
					flat
					:dark="$store.getters.theme !== 'light'"
					:loading="loading_players"
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
									<i aria-hidden="true" v-if="!avatar(props.row)" class="hki-player" />
								</template>
								<template v-else-if="col.name !== 'actions'">
									<router-link v-if="col.name === 'name'" :to="`${$route.path}/${props.key}`">
										{{ col.value }}
									</router-link>
									<template v-else>
										{{ col.value }}
									</template>
								</template>
								<div v-else class="text-right d-flex justify-content-end">
									<template v-if="tier.price !== 'Free' && Object.keys(sync_characters).length">
										<button
											v-if="
												!props.row.sync_character || !(props.row.sync_character in sync_characters)
											"
											class="btn btn-sm bg-neutral-5"
											@click="linkDialog(props.key)"
										>
											<i class="fas fa-link" aria-hidden="true" />
											<q-tooltip anchor="top middle" self="center middle">
												Link Character to Sync with
											</q-tooltip>
										</button>
										<template v-else>
											<a
												class="btn btn-sm bg-neutral-5"
												:href="props.row.sync_character"
												target="_blank"
												rel="noopener"
											>
												<i class="fas fa-external-link" aria-hidden="true" />
												<q-tooltip anchor="top middle" self="center middle">
													Open linked character sheet
												</q-tooltip>
											</a>
											<button
												class="btn btn-sm bg-neutral-5 ml-2"
												@click="syncCharacter(props.key, props.row.sync_character)"
											>
												<i
													class="fas fa-sync-alt fade-color"
													:class="{
														rotate: props.key in syncing,
														green: syncing[props.key] === 'success',
														red: syncing[props.key] === 'error',
													}"
													aria-hidden="true"
												/>
												<q-tooltip anchor="top middle" self="center middle">
													Update with Character Sync
												</q-tooltip>
											</button>
										</template>
										<q-separator vertical :dark="$store.getters.theme === 'dark'" class="ml-2" />
									</template>

									<router-link
										class="btn btn-sm bg-neutral-5 mx-2"
										:to="`${$route.path}/${props.key}`"
									>
										<i aria-hidden="true" class="fas fa-pencil"></i>
										<q-tooltip anchor="top middle" self="center middle"> Edit </q-tooltip>
									</router-link>
									<a
										class="btn btn-sm bg-neutral-5"
										@click="confirmDelete($event, props.key, props.row)"
									>
										<i aria-hidden="true" class="fas fa-trash-alt"></i>
										<q-tooltip anchor="top middle" self="center middle"> Delete </q-tooltip>
									</a>
								</div>
							</q-td>
						</q-tr>
					</template>
					<div slot="no-data" />
					<hk-loader slot="loading" name="players" />
				</q-table>
			</template>

			<router-link
				v-if="!players.length && !overencumbered"
				class="btn btn-lg bg-neutral-5"
				to="/content/players/add-player"
			>
				<i aria-hidden="true" class="fas fa-plus green mr-1" /> Create your first player
			</router-link>
			<router-link
				v-else-if="tier.price === 'Free'"
				class="btn bg-neutral-8 btn-block"
				to="/pricing"
			>
				Get more player slots
			</router-link>
		</div>
		<hk-loader v-else name="players" />

		<q-dialog v-model="link_dialog" @before-hide="link_character = undefined">
			<hk-link-character @link="linkCharacter" />
		</q-dialog>
	</hk-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { experience } from "src/mixins/experience.js";
import ContentHeader from "src/components/userContent/ContentHeader";
import { getCharacterSyncStorage } from "src/utils/generalFunctions";

export default {
	name: "Players",
	mixins: [experience],
	components: {
		ContentHeader,
	},
	data() {
		return {
			userId: this.$store.getters.user ? this.$store.getters.user.uid : undefined,
			loading_players: true,
			sync_characters: {},
			link_character: undefined,
			link_dialog: false,
			syncing: {},
			search: "",
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
					field: "character_name",
					classes: "truncate-cell",
					sortable: true,
					align: "left",
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
		...mapGetters("players", ["players"]),
	},
	async mounted() {
		await this.get_players();
		this.loading_players = false;
		this.sync_characters = await getCharacterSyncStorage();
	},
	methods: {
		...mapActions("players", ["get_players", "delete_player", "set_player_prop", "sync_player"]),
		avatar(player) {
			return player.storage_avatar || player.avatar;
		},
		confirmDelete(e, key, player) {
			//Instantly delete when shift is held
			if (e.shiftKey) {
				this.deletePlayer(key);
			} else {
				this.$snotify.error(
					"Are you sure you want to delete " + player.character_name + "?",
					"Delete player",
					{
						timeout: false,
						buttons: [
							{
								text: "Yes",
								action: (toast) => {
									this.deletePlayer(key);
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
					}
				);
			}
		},
		deletePlayer(key) {
			this.delete_player(key);
		},
		linkDialog(key) {
			this.link_character = key;
			this.link_dialog = true;
		},
		async linkCharacter(url) {
			await this.set_player_prop({
				uid: this.userId,
				id: this.link_character,
				property: "sync_character",
				value: url,
			});
			await this.syncCharacter(this.link_character, url);
			this.link_dialog = false;
		},
		async syncCharacter(id, sync_character) {
			this.$set(this.syncing, id, "syncing");
			try {
				await this.sync_player({ uid: this.userId, id, sync_character });
				this.$set(this.syncing, id, "success");
			} catch (e) {
				this.syncing[id] = "error";
				this.$snotify.error(e, "Sync failed", {});
			} finally {
				setTimeout(() => {
					this.$delete(this.syncing, id);
				}, 2000);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.fade-color {
	transition: all 0.5s;
}
</style>
