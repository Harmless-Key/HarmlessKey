<template>
	<div class="content__edit" v-if="!loading">
		<ValidationObserver v-slot="{ handleSubmit, valid }">
			<q-form @submit="handleSubmit(savePlayer)">
				<div
					id="players"
					v-if="
						($route.name == 'Edit Character' && player.control === $store.getters.user.uid) ||
						$route.name != 'Edit Character'
					"
				>
					<hk-card-deck>
						<hk-card>
							<div class="card-header p-0 pr-4" slot="header">
								<div class="d-flex justify-content-start items-center">
									<div
										class="img player-avatar"
										@click="avatar_dialog = true"
										:style="{
											backgroundImage: current_avatar ? `url('${current_avatar}')` : '',
										}"
									>
										<i
											aria-hidden="true"
											v-if="!player.storage_avatar && !player.avatar && !preview_new_upload"
											class="hki-player"
										/>
									</div>
									Basic info
								</div>
							</div>
							<div class="card-body">
								<ValidationProvider
									v-if="$route.name !== 'Edit character'"
									rules="max:15|required"
									name="Name"
									v-slot="{ errors, invalid, validated }"
								>
									<q-input
										:dark="$store.getters.theme === 'dark'"
										filled
										square
										label="Player name *"
										autocomplete="off"
										type="text"
										class="mb-2"
										v-model="player.player_name"
										maxlength="15"
										:error="invalid && validated"
										:error-message="errors[0]"
									/>
								</ValidationProvider>

								<ValidationProvider
									rules="max:35|required"
									name="Character name"
									v-slot="{ errors, invalid, validated }"
								>
									<q-input
										:dark="$store.getters.theme === 'dark'"
										filled
										square
										label="Character name *"
										autocomplete="off"
										type="text"
										class="mb-2"
										v-model="player.character_name"
										maxlength="35"
										:error="invalid && validated"
										:error-message="errors[0]"
									/>
								</ValidationProvider>

								<template v-if="$route.name !== 'Edit character'">
									<!-- Give Player Control -->
									<GiveCharacterControl
										v-if="$route.name !== 'Add player'"
										:playerId="playerId"
										:control="player.control"
										@set="$set(player, 'control', $event)"
										@remove="$set(player, 'control', null)"
									/>

									<!-- Character Sync -->
									<template v-if="tier.price !== 'Free'">
										<div v-if="player.sync_character">
											<q-input
												:dark="$store.getters.theme === 'dark'"
												filled
												square
												class="mt-4"
												type="text"
												:value="linked_character ? linked_character.name : 'Not found'"
												readonly
												label-slot
												:error="!linked_character"
												error-message="Character not found in extension"
											>
												<template #label>
													Linked character
													<q-chip
														v-if="!playerEqualsLinkedCharacter()"
														class="white"
														color="neutral-6"
														>Update available</q-chip
													>
												</template>
												<template #append>
													<button class="btn btn-sm bg-neutral-5" @click="unlink">
														<i class="fas fa-unlink red" aria-hidden="true" />
														<q-tooltip anchor="top middle" self="center middle"> Unlink </q-tooltip>
													</button>
													<button
														class="btn btn-sm bg-neutral-5 ml-2"
														@click="openUrl(player.sync_character)"
													>
														<i class="fas fa-external-link" aria-hidden="true" />
														<q-tooltip anchor="top middle" self="center middle">
															Open to update
														</q-tooltip>
													</button>
													<button
														v-if="linked_character"
														class="btn btn-sm ml-2"
														@click="sync"
														:class="{ 'bg-neutral-5': playerEqualsLinkedCharacter() }"
													>
														<i
															class="fas fa-sync-alt"
															aria-hidden="true"
															:class="{ rotate: syncing }"
															@animationend="syncing = false"
														/>
														<q-tooltip anchor="top middle" self="center middle">
															{{ playerEqualsLinkedCharacter() ? "No update" : "Update" }}
														</q-tooltip>
													</button>
												</template>
											</q-input>
										</div>
										<button
											v-else-if="sync_characters"
											class="btn btn-block bg-neutral-5 mt-4"
											@click.stop.prevent="link_dialog = true"
										>
											<i class="fas fa-link" aria-hidden="true" />
											Link character
										</button>
									</template>
									<template v-else>
										<button
											class="btn btn-block bg-neutral-5"
											@click.prevent="
												setDrawer({
													show: true,
													type: 'drawers/CharacterSync',
												})
											"
										>
											<i class="fas fa-sync-alt" aria-hidden="true" />
											Sync with external character
										</button>
										<small class="neutral-3">
											<router-link to="/pricing" class="mx-1">Subscription</router-link> for
											Shieldmaiden required.
										</small>
									</template>
								</template>
							</div>
						</hk-card>
						<hk-card header="Level & Base Stats">
							<div class="card-body">
								<div class="row q-col-gutter-md">
									<div class="col-12 col-md-6">
										<ValidationProvider
											rules="numeric|between:0,355000"
											name="XP"
											v-slot="{ errors, invalid, validated }"
										>
											<q-input
												:dark="$store.getters.theme === 'dark'"
												filled
												square
												label="Experience points"
												autocomplete="off"
												type="number"
												min="0"
												max="355000"
												v-model="player.experience"
												:disable="player.level > 0"
												:error="invalid && validated"
												:error-message="errors[0]"
											>
												<template v-slot:append>
													<small
														><span class="neutral-2">level:</span>
														<span class="level">{{
															player.level ? player.level : calculatedLevel(player.experience)
														}}</span></small
													>
													<q-icon
														name="info"
														class="ml-1 pointer blue"
														size="xs"
														@click="setDrawer({ show: true, type: 'drawers/xpTable' })"
													/>
												</template>
											</q-input>
										</ValidationProvider>
									</div>
									<div class="col-12 col-md-6">
										<ValidationProvider
											rules="numeric|between:1,20"
											name="Level"
											v-slot="{ errors, invalid, validated }"
										>
											<q-input
												:dark="$store.getters.theme === 'dark'"
												filled
												square
												clearable
												label="Level override"
												autocomplete="off"
												type="number"
												min="1"
												max="20"
												:value="player.level"
												@input="parseToInt($event, player, 'level')"
												:error="invalid && validated"
												:error-message="errors[0]"
											/>
										</ValidationProvider>
									</div>
									<div class="col-12 col-md-4">
										<ValidationProvider
											rules="required|numeric|between:1,999"
											name="Max HP"
											v-slot="{ errors, invalid, validated }"
										>
											<q-input
												:dark="$store.getters.theme === 'dark'"
												filled
												square
												label="Hit points *"
												autocomplete="off"
												type="number"
												min="1"
												max="999"
												:value="player.maxHp"
												name="maxHp"
												placeholder="Maximum Hit Points*"
												@input="parseToInt($event, player, 'maxHp')"
												:error="invalid && validated"
												:error-message="errors[0]"
											>
												<q-icon slot="prepend" name="fas fa-heart" />
												<q-tooltip anchor="top middle" self="center middle"
													>Maximum Hit Points</q-tooltip
												>
											</q-input>
										</ValidationProvider>
									</div>
									<div class="col-12 col-md-4">
										<ValidationProvider
											rules="required|numeric|between:1,99"
											name="AC"
											v-slot="{ errors, invalid, validated }"
										>
											<q-input
												:dark="$store.getters.theme === 'dark'"
												filled
												square
												label="Armor class *"
												autocomplete="off"
												min="1"
												max="99"
												type="number"
												:value="player.ac"
												@input="parseToInt($event, player, 'ac')"
												:error="invalid && validated"
												:error-message="errors[0]"
											>
												<q-icon slot="prepend" name="fas fa-shield" />
												<q-tooltip anchor="top middle" self="center middle">Armor class</q-tooltip>
											</q-input>
										</ValidationProvider>
									</div>
									<div class="col-12 col-md-4">
										<ValidationProvider
											rules="numeric|between:1,99"
											name="Save DC"
											v-slot="{ errors, invalid, validated }"
										>
											<q-input
												:dark="$store.getters.theme === 'dark'"
												filled
												square
												label="Spell save DC"
												autocomplete="off"
												min="1"
												max="99"
												type="number"
												:value="player.spell_save_dc"
												@input="parseToInt($event, player, 'spell_save_dc')"
												:error="invalid && validated"
												:error-message="errors[0]"
											>
												<q-icon slot="prepend" name="fas fa-hand-holding-magic" />
												<q-tooltip anchor="top middle" self="center middle"
													>Spell save DC</q-tooltip
												>
											</q-input>
										</ValidationProvider>
									</div>

									<!-- Speed & Initiative -->
									<div class="col-12 col-md-6">
										<ValidationProvider
											rules="numeric|between:0,999"
											name="Speed"
											v-slot="{ errors, invalid, validated }"
										>
											<q-input
												:dark="$store.getters.theme === 'dark'"
												filled
												square
												label="Speed"
												autocomplete="off"
												type="number"
												min="0"
												max="999"
												:value="player.speed"
												placeholder="Speed"
												@input="parseToInt($event, player, 'speed')"
												:error="invalid && validated"
												:error-message="errors[0]"
											/>
										</ValidationProvider>
									</div>
									<div class="col-12 col-md-6">
										<ValidationProvider
											rules="between:-10,99"
											name="Initiative"
											v-slot="{ errors, invalid, validated }"
										>
											<q-input
												:dark="$store.getters.theme === 'dark'"
												filled
												square
												label="Initiative"
												autocomplete="off"
												min="-10"
												max="99"
												type="number"
												:value="player.initiative"
												@input="parseToInt($event, player, 'initiative')"
												:error="invalid && validated"
												:error-message="errors[0]"
											/>
										</ValidationProvider>
									</div>
								</div>
							</div>
						</hk-card>
					</hk-card-deck>

					<!-- ABILITY SCORES -->
					<hk-card header="Ability Scores & Senses" class="ability-card">
						<div class="card-body">
							<h6 class="mb-2">Ability scores</h6>
							<div class="row q-col-gutter-md">
								<div v-for="ability in abilities" :key="ability" class="col-6 col-md-2 mb-2">
									<ValidationProvider
										rules="numeric|between:1,99"
										:name="ability"
										v-slot="{ errors, invalid, validated }"
									>
										<q-input
											:dark="$store.getters.theme === 'dark'"
											filled
											square
											:label="ability.capitalize()"
											autocomplete="off"
											type="number"
											min="1"
											max="99"
											v-model="player[ability]"
											@input="parseToInt($event, player, ability)"
											:error="invalid && validated"
											:error-message="errors[0]"
										>
											<!-- eslint-disable -->
											<q-checkbox
												slot="append"
												size="xs"
												:dark="$store.getters.theme === 'dark'"
												v-model="player[`${ability}-save-profficient`]"
												:false-value="null"
												indeterminate-value="something-else"
											>
												<q-tooltip anchor="top middle" self="center middle">
													Saving throw proficiency
												</q-tooltip>
											</q-checkbox>
										</q-input>
									</ValidationProvider>
								</div>
							</div>

							<!-- SENSES -->
							<h6 class="mt-3 mb-2">Senses</h6>
							<div class="row q-col-gutter-md">
								<div class="col-12 col-md-4 mb-2">
									<ValidationProvider
										rules="numeric|between:1,99"
										name="Passive perception"
										v-slot="{ errors, invalid, validated }"
									>
										<q-input
											:dark="$store.getters.theme === 'dark'"
											filled
											square
											label="Passive perception"
											autocomplete="off"
											type="number"
											min="1"
											max="99"
											v-model="player.passive_perception"
											@input="parseToInt($event, player, 'passive_perception')"
											placeholder="Perception"
											:error="invalid && validated"
											:error-message="errors[0]"
										>
											<q-icon slot="prepend" name="fas fa-eye" />
										</q-input>
									</ValidationProvider>
								</div>
								<div class="col-12 col-md-4 mb-2">
									<ValidationProvider
										rules="numeric|between:1,99"
										name="Passive investigation"
										v-slot="{ errors, invalid, validated }"
									>
										<q-input
											:dark="$store.getters.theme === 'dark'"
											filled
											square
											label="Passive investigation"
											autocomplete="off"
											type="number"
											min="1"
											max="99"
											v-model="player.passive_investigation"
											@input="parseToInt($event, player, 'passive_investigation')"
											placeholder="Investigation"
											:error="invalid && validated"
											:error-message="errors[0]"
										>
											<q-icon slot="prepend" name="fas fa-search" />
										</q-input>
									</ValidationProvider>
								</div>
								<div class="col-12 col-md-4 mb-2">
									<ValidationProvider
										rules="numeric|between:1,99"
										name="Passive insight"
										v-slot="{ errors, invalid, validated }"
									>
										<q-input
											:dark="$store.getters.theme === 'dark'"
											filled
											square
											label="Passive insight"
											autocomplete="off"
											type="number"
											min="1"
											max="99"
											v-model="player.passive_insight"
											@input="parseToInt($event, player, 'passive_insight')"
											placeholder="Insight"
											:error="invalid && validated"
											:error-message="errors[0]"
										>
											<q-icon slot="prepend" name="fas fa-lightbulb-on" />
										</q-input>
									</ValidationProvider>
								</div>
							</div>
						</div>
					</hk-card>

					<Defenses v-model="player" />

					<!-- SKILLS -->
					<hk-card header="Skills">
						<div class="card-body">
							<div class="d-flex justify-between">
								<h5>
									Proficiency Bonus: +<strong class="blue">{{
										returnProficiency(
											player.level ? player.level : calculatedLevel(player.experience)
										)
									}}</strong>
								</h5>
								<q-checkbox
									size="s"
									:dark="$store.getters.theme === 'dark'"
									:false-value="null"
									v-model="player.skills_jack_of_all_trades"
									indeterminate-value="something-else"
									left-label
								>
									<template slot:label>
										<q-icon name="info" class="mr-2 pointer blue" size="xs">
											<q-tooltip anchor="top middle" self="center middle">
												Adds ½ proficiency modifier to skill you are not profficient in.
											</q-tooltip>
										</q-icon>
										<span>Jack of all Trades</span>
									</template>
								</q-checkbox>
							</div>

							<div class="skills">
								<div
									v-for="(skill, key) in skillList"
									:key="key"
									class="d-flex justify-content-start"
								>
									<q-checkbox
										size="xs"
										:dark="$store.getters.theme === 'dark'"
										:val="key"
										v-model="skills_expertise"
										:false-value="null"
										indeterminate-value="something-else"
										:disable="player.skills ? !player.skills.includes(key) : true"
									>
										<template slot:label>
											+{{
												returnProficiency(
													player.level ? player.level : calculatedLevel(player.experience)
												)
											}}
										</template>
										<q-tooltip anchor="top middle" self="center middle"> Expertise </q-tooltip>
									</q-checkbox>

									<q-checkbox
										size="xs"
										:dark="$store.getters.theme === 'dark'"
										:val="key"
										v-model="skills"
										:false-value="null"
										indeterminate-value="something-else"
									>
										<template slot:label>
											<div class="skill">
												<div class="neutral-2 abillity">{{ skill.ability.substring(0, 3) }}</div>
												{{ skill.skill }}
												<div class="mod">
													{{
														skillMod(skill, key) > 0
															? `+${skillMod(skill, key)}`
															: skillMod(skill, key)
													}}
												</div>
											</div>
										</template>
										<q-tooltip anchor="top middle" self="center middle"> Proficiency </q-tooltip>
									</q-checkbox>
								</div>
							</div>
						</div>
					</hk-card>

					<!-- COMPANIONS -->
					<hk-card>
						<div slot="header" class="card-header">
							Companions
							<a
								v-if="isOwner() && npc_count"
								class="btn btn-sm bg-neutral-5"
								@click="companion_dialog = !companion_dialog"
							>
								<i aria-hidden="true" class="fas fa-plus green mr-1" />
								Add companion
							</a>
						</div>
						<div class="card-body">
							<template v-if="isOwner()">
								<div v-if="!npc_count">
									<p>You currently have no custom npcs created</p>
									<p>First create a custom NPC to use as a companion</p>
									<router-link class="btn bg-green" to="/content/npcs">
										<i aria-hidden="true" class="fas fa-plus"></i>Add an NPC
									</router-link>
								</div>
							</template>

							<!--  Companions table -->
							<hk-table
								v-if="companions && companions.length"
								:columns="columns"
								:items="companions"
							>
								<template slot="avatar" slot-scope="data">
									<div class="image" :style="{ backgroundImage: 'url(\'' + data.item + '\')' }">
										<i aria-hidden="true" v-if="!data.item" class="hki-monster" />
									</div>
								</template>

								<template slot="name" slot-scope="data">
									<router-link class="mx-2" :to="`/content/companions/${userId}/${data.row.key}`">
										{{ data.item }}
										<q-tooltip anchor="top middle" self="center middle"> Edit </q-tooltip>
									</router-link>
								</template>

								<div slot="actions" slot-scope="data" class="actions">
									<router-link
										class="btn btn-sm bg-neutral-5 mx-1"
										:to="`/content/companions/${userId}/${data.row.key}`"
									>
										<i aria-hidden="true" class="fas fa-pencil"></i>
										<q-tooltip anchor="top middle" self="center middle"> Edit </q-tooltip>
									</router-link>
									<a
										v-if="isOwner()"
										class="btn btn-sm bg-neutral-5"
										@click="removeCompanion(data.index, data.row.key)"
									>
										<i aria-hidden="true" class="fas fa-trash-alt"></i>
										<q-tooltip anchor="top middle" self="center middle"> Remove </q-tooltip>
									</a>
								</div>
							</hk-table>
							<div v-else-if="!isOwner()">
								<p>You currently have no companions linked to your player character</p>
								<p>Ask your DM to link an NPC to you character</p>
							</div>
							<div v-else>
								<p>No companions linked to player.</p>
								<a
									v-if="isOwner() && npc_count"
									class="btn bg-neutral-5"
									@click="companion_dialog = !companion_dialog"
								>
									<i aria-hidden="true" class="fas fa-plus green mr-1" />
									Add companion
								</a>
							</div>
						</div>
					</hk-card>

					<div class="save">
						<div class="buttons">
							<q-icon v-if="!valid" name="error" color="red" size="md" class="mr-2">
								<q-tooltip anchor="top middle" self="center middle">
									There are validation errors
								</q-tooltip>
							</q-icon>
							<router-link to="/content/players" class="btn bg-neutral-5 mr-2">
								Cancel
							</router-link>
							<q-btn color="primary" type="submit" no-caps>
								{{ $route.name == "Add player" ? "Add player" : "Save" }}
							</q-btn>
						</div>
					</div>
				</div>
			</q-form>
		</ValidationObserver>

		<q-dialog v-model="companion_dialog">
			<hk-card header="Add companion" :min-width="320">
				<div class="card-body">
					<CopyContent
						@copy="add"
						type="monster"
						button="plus"
						:content="['custom']"
						:disabled-custom="npcsAsCompanion"
					/>
				</div>
			</hk-card>
		</q-dialog>

		<!-- AVATAR -->
		<q-dialog v-model="avatar_dialog">
			<hk-image-uploader
				:avatar="player.avatar"
				:storage_avatar="player.storage_avatar"
				:preview_new_upload="preview_new_upload"
				@crop="saveBlob"
				@url="saveUrl"
				@cancel="avatar_dialog = false"
				@clear="clearAvatar"
			/>
		</q-dialog>

		<!-- LINK CHARACTER -->
		<q-dialog v-if="tier.price !== 'Free'" v-model="link_dialog">
			<hk-link-character @link="linkCharacter" />
		</q-dialog>
	</div>
	<hk-card v-else header="Player">
		<hk-loader name="player" />
	</hk-card>
</template>

<script>
import GiveCharacterControl from "./GiveCharacterControl.vue";
import { mapGetters, mapActions } from "vuex";
import { experience } from "src/mixins/experience.js";
import { general } from "src/mixins/general.js";
import Defenses from "src/components/npcs/Defenses";
import CopyContent from "../../../components/CopyContent.vue";
import { abilities, skills } from "src/utils/generalConstants";
import {
	calc_skill_mod,
	getCharacterSyncCharacter,
	getCharacterSyncStorage,
	characterToPlayer,
	comparePlayerToCharacter,
} from "src/utils/generalFunctions";

export default {
	name: "EditPlayer",
	mixins: [experience, general],
	components: {
		GiveCharacterControl,
		Defenses,
		CopyContent,
	},
	data() {
		return {
			abilities: abilities,
			syncing: false,
			link_dialog: false,
			linked_character: undefined,
			sync_characters: undefined,
			skillList: skills,
			playerId: this.$route.params.id,
			userId: undefined,
			avatar_dialog: false,
			preview_new_upload: undefined,
			companion_dialog: false,
			skills_jack_of_all_trades: false,
			player: {},
			loading: this.$route.name === "Edit player",
			companions_to_delete: [],
			companions: [],
			columns: {
				avatar: {
					width: 46,
					noPadding: true,
				},
				name: {
					label: "Name",
					truncate: true,
				},
				actions: {
					label: '<i aria-hidden="true" class="far fa-ellipsis-h"></i>',
					noPadding: true,
					right: true,
					maxContent: true,
				},
			},
		};
	},
	computed: {
		...mapGetters(["tier", "overencumbered"]),
		...mapGetters("npcs", ["npc_count"]),
		...mapGetters("players", ["player_count", "players"]),
		current_avatar() {
			return this.preview_new_upload || this.player.storage_avatar || this.player.avatar;
		},
		skills: {
			get() {
				return this.player.skills ? this.player.skills : [];
			},
			set(newValue) {
				this.$set(this.player, "skills", newValue);
			},
		},
		skills_expertise: {
			get() {
				return this.player.skills_expertise ? this.player.skills_expertise : [];
			},
			set(newValue) {
				this.$set(this.player, "skills_expertise", newValue);
			},
		},
		npcsAsCompanion() {
			const companions = [];
			for (const player of this.players) {
				if (player.companions) {
					for (const key in player.companions) {
						companions.push(key);
					}
				}
			}
			return companions;
		},
	},
	async mounted() {
		await this.get_players();
		if (this.$route.name === "Add player") {
			for (const ability of this.abilities) {
				this.$set(this.player, ability, 10);
			}
		}

		//User ID needs te be different if it is
		//an external controlled character
		if (!this.isOwner()) {
			this.userId = await this.get_owner_id({
				uid: this.$store.getters.user.uid,
				playerId: this.playerId,
			});
		} else {
			this.userId = this.$store.getters.user.uid;
		}

		if (this.playerId) {
			this.loading = true;
			await this.get_player({ uid: this.userId, id: this.playerId }).then(async (player) => {
				this.player = { ...player };

				let comps = [];
				for (let key in player.companions) {
					let npc = await this.get_npc({ uid: this.userId, id: key });

					if (npc) {
						npc.key = key;
						comps.push(npc);
					}
					// The NPC can't be found, so it was deleted. Also delete it as a companion from the player
					else {
						this.delete_companion({ uid: this.userId, playerId: this.playerId, id: key });
					}
				}
				this.companions = comps;
				this.loading = false;
			});
		}

		if (this.player.sync_character) {
			this.linked_character = await getCharacterSyncCharacter(this.player.sync_character);
		}
		this.sync_characters = await getCharacterSyncStorage();
	},
	methods: {
		...mapActions(["setDrawer"]),
		...mapActions("players", [
			"get_player",
			"get_owner_id",
			"add_player",
			"edit_player",
			"get_players",
			"delete_companion",
		]),
		...mapActions("npcs", ["get_npc"]),
		...mapActions("campaigns", ["get_campaign"]),
		isOwner() {
			return this.$route.name !== "Edit character";
		},
		playerEqualsLinkedCharacter() {
			return comparePlayerToCharacter(this.linked_character, this.player);
		},
		async linkCharacter(url) {
			this.$set(this.player, "sync_character", url);
			this.linked_character = await getCharacterSyncCharacter(this.player.sync_character);
			await this.sync();
			this.link_dialog = false;
		},
		unlink() {
			this.linked_character = undefined;
			this.player.sync_character = null;
		},
		async sync() {
			this.syncing = true;
			this.linked_character = await getCharacterSyncCharacter(this.player.sync_character);
			if (this.linked_character) {
				const new_player = characterToPlayer(this.linked_character);
				this.player = { ...this.player, ...new_player };
			}
		},
		savePlayer() {
			if (this.$route.name === "Add player") {
				this.addPlayer();
			} else {
				this.editPlayer();
			}
		},
		async addPlayer() {
			if (this.player_count >= this.tier.benefits.players) {
				this.$snotify.error("You have too many players.", "Error");
			} else {
				await this.add_player(this.player).then(() => {
					this.$router.replace("/content/players");
				});
			}
		},
		async editPlayer() {
			await this.edit_player({
				uid: this.userId,
				id: this.playerId,
				player: this.player,
				companions: this.companions || [],
				deleted_companions: this.companions_to_delete || [],
			});
			if (this.$route.name === "Edit character") this.$router.replace("/content/characters");
			else this.$router.replace("/content/players");
		},
		add({ result, id }) {
			this.companion_dialog = false;
			if (this.player.companions === undefined) {
				this.$set(this.player, "companions", {});
			}

			this.$set(this.player.companions, id, true);
			result.key = id;
			this.companions.push(result);
			this.npcsAsCompanion.push(id);

			// If companion was deleted before saving, undelete it
			if (this.companions_to_delete.indexOf(id) > -1) {
				this.companions_to_delete.splice(this.companions_to_delete.indexOf(id), 1);
			}

			this.$forceUpdate();
		},
		removeCompanion(index, id) {
			this.$delete(this.companions, index);
			this.$delete(this.player.companions, id);
			this.companions_to_delete.push(id);

			const npcsAsCompanionIndex = this.npcsAsCompanion.indexOf(id);
			if (npcsAsCompanionIndex > -1) {
				this.npcsAsCompanion.splice(npcsAsCompanionIndex, 1);
			}
		},
		parseToInt(value, object, property) {
			if (value === undefined || value === null || value === "") {
				this.$set(object, property, null);
			} else {
				value = parseInt(value);
				if (property === "level") {
					value = value.between(1, 20);
				}
				this.$set(object, property, value);
			}
		},
		skillMod(skill, key) {
			const ability_mod = this.calcMod(this.player[skill.ability]);
			const proficiency = this.returnProficiency(
				this.player.level ? this.player.level : this.calculatedLevel(this.player.experience)
			);

			const proficient = this.player.skills ? this.player.skills.includes(key) : false;
			const expertise = this.player.skills_expertise
				? this.player.skills_expertise.includes(key)
				: false;
			const jack_oa_trades = this.player.skills_jack_of_all_trades;

			const mod = calc_skill_mod(
				ability_mod,
				proficiency,
				0,
				proficient,
				expertise,
				jack_oa_trades
			);
			return parseInt(mod);
		},
		saveBlob(value) {
			this.$delete(this.player, "avatar");
			this.$set(this.player, "blob", value.blob);
			this.preview_new_upload = value.dataUrl;
			this.avatar_dialog = false;
		},
		saveUrl(value) {
			this.$delete(this.player, "storage_avatar");
			this.$set(this.player, "avatar", value);
			this.preview_new_upload = undefined;
			this.avatar_dialog = false;
		},
		clearAvatar() {
			this.$delete(this.player, "avatar");
			this.$delete(this.player, "storage_avatar");
			this.$delete(this.player, "blob");
			this.preview_new_upload = undefined;
			this.avatar_dialog = false;
		},
		openUrl(url) {
			window.open(url, "_blank").opener = null;
		},
	},
};
</script>

<style lang="scss" scoped>
label {
	line-height: 37px;
	margin-bottom: 0;

	&.experience {
		display: flex;
		justify-content: space-between;
	}

	svg {
		fill: $neutral-2;
		width: 20px;
		height: 20px;
	}
}

.img {
	border: solid 1px $neutral-4;
	display: block;
	width: 62px;
	height: 62px;
	background-size: cover;
	background-position: center top;
	color: $neutral-2;
	background-color: $neutral-9;
	font-size: 50px;
	cursor: pointer;
	border-top-left-radius: $border-radius;
	margin-right: 15px;

	i::before {
		vertical-align: 5px;
	}
	&:hover {
		border-color: $blue;
		color: $blue-light;
	}
}

.current-avatar {
	background-color: $neutral-7;
	border-bottom: solid 1px $neutral-5;
	display: flex;
	justify-content: space-between;
	padding-right: 0.5rem;

	.img {
		border-radius: 0;
		width: 47px;
		height: 47px;
		cursor: default;
	}
}

.skills {
	columns: 3;

	.skill {
		width: 100%;
		display: grid;
		grid-template-columns: 45px 1fr min-content;

		.abillity {
			text-transform: uppercase;
			text-align: center;
		}
		.mod {
			margin-left: 8px;
		}
	}
}

[data-theme="light"] {
	.avatar .img {
		background-color: $neutral-2;
		color: $neutral-8;
	}
}

@media only screen and (max-width: 1250px) {
	.skills {
		columns: 2;
	}
}
@media only screen and (max-width: 890px) {
	.skills {
		columns: 1;
	}
}
</style>
