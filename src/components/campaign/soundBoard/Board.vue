<template>
	<div class="soundboard">
		<hk-input v-model="search" dense label="Search" class="mb-2" clearable>
			<q-icon slot="prepend" name="search" />
		</hk-input>
		<p class="red" v-if="!filtered.length">Nothing found</p>
		<transition-group
			tag="div"
			name="board"
			class="board"
			enter-active-class="animated animate__flipInX"
			leave-active-class="animated animate__flipOutX"
		>
			<template v-for="sound in filtered">
				<a
					v-if="sound.url"
					:key="`${sound.type}-${sound.key}`"
					class="board__button"
					:href="!edit ? sound.url : null"
					target="_blank"
					rel="noopener"
				>
					<img
						v-if="sound.hk"
						src="~assets/_img/logo/logo-icon-cyan.svg"
						alt="sound board button background"
						class="board__button-logo"
					/>
					<button
						v-if="edit && !sound.hk"
						class="btn btn-sm bg-neutral-5 board__button-delete"
						@click.stop="delete_soundboard_link(sound.key)"
					>
						<hk-icon icon="fas fa-trash-alt red" />
					</button>
					<hk-icon v-else-if="!sound.image" :icon="sound.icon" class="board__button-icon" />
					<div class="truncate board__button-title">
						{{ sound.name }}
					</div>
					<div v-if="sound.image" class="board__button-bg">
						<img :src="sound.image" :alt="`${sound.name} icon`" />
					</div>
					<q-tooltip anchor="top middle" self="center middle">{{ sound.name }}</q-tooltip>
				</a>
			</template>
		</transition-group>

		<div class="soundboard__actions">
			<router-link v-if="tier.price === 'Free'" class="btn btn-block bg-patreon-red" to="/pricing">
				Add custom links
			</router-link>
			<template v-else>
				<button class="btn btn-block bg-neutral-5" @click="add_dialog = true">
					<hk-icon icon="fas fa-plus" class="green" />
					Add {{ type }}
				</button>
				<button class="btn bg-neutral-5" @click="edit = !edit">
					<hk-icon :icon="edit ? 'fas fa-times' : 'fas fa-pencil-alt'" />
				</button>
			</template>
		</div>

		<q-dialog v-model="add_dialog">
			<div>
				<ValidationObserver v-slot="{ handleSubmit }">
					<q-form @submit="handleSubmit(addLink)" greedy>
						<hk-card :min-width="320" no-margin>
							<div slot="header" class="card-header">
								<span>Add to your Soundboard</span>
								<q-btn padding="sm" size="sm" no-caps icon="fas fa-times" flat v-close-popup />
							</div>
							<div class="card-body">
								<q-btn-toggle v-model="add.type" :options="toggle" spread no-caps class="mb-3" />
								<hk-input
									v-model="add.name"
									rules="required|max:20"
									maxLength="21"
									label="Name"
									name="Name"
								/>
								<hk-input
									v-model="add.url"
									rules="required|url"
									maxLength="21"
									label="URL"
									name="URL"
								>
									<hk-icon slot="prepend" icon="fas fa-music" />
								</hk-input>
								<div class="">
									<hk-input v-model="add.image" rules="url" maxLength="21" label="Icon" name="Icon">
										<hk-icon slot="prepend" icon="fas fa-image" />
									</hk-input>
								</div>
							</div>
							<div slot="footer" class="card-footer">
								<q-btn v-close-popup class="mr-1" no-caps>Cancel</q-btn>
								<q-btn no-caps label="Add" color="primary" type="submit" />
							</div>
						</hk-card>
					</q-form>
				</ValidationObserver>
			</div>
		</q-dialog>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { urlType } from "src/utils/generalFunctions";

export default {
	name: "Soundboard",
	props: {
		type: {
			type: String,
			default: "ambience",
		},
	},
	data() {
		return {
			loading: false,
			add_dialog: false,
			edit: false,
			search: null,
			add: {
				type: this.type,
				name: null,
				url: null,
				image: null,
			},
			toggle: [
				{
					value: "ambience",
					label: "Ambience",
				},
				{
					value: "music",
					label: "Music",
				},
			],
			hk_links: [
				{
					type: "music",
					name: "Combat",
					url: "https://www.youtube.com/watch?v=WEel3jMmGo4",
					image: require("assets/_img/soundboard/combat_1.webp"),
					hk: true,
					key: "a",
				},
				{
					type: "music",
					name: "Combat 2",
					url: "https://www.youtube.com/watch?v=w0sUw735gRw",
					image: require("assets/_img/soundboard/combat_2.webp"),
					hk: true,
					key: "b",
				},
				{
					type: "music",
					name: "Tavern",
					url: "https://www.youtube.com/watch?v=2EFpqObW9hY",
					image: require("assets/_img/soundboard/tavern_music.webp"),
					hk: true,
					key: "c",
				},
				{
					type: "music",
					name: "Magical",
					url: "https://www.youtube.com/watch?v=wrmwsM00QG4",
					image: require("assets/_img/soundboard/magical.webp"),
					hk: true,
					key: "d",
				},
				{
					type: "music",
					name: "Mysterious",
					url: "https://www.youtube.com/watch?v=SA1ZM5_UFhQ",
					image: require("assets/_img/soundboard/mysterious.webp"),
					hk: true,
					key: "e",
				},
				{
					type: "music",
					name: "Eerie",
					url: "https://www.youtube.com/watch?v=CDWtH8eHeEU",
					image: require("assets/_img/soundboard/eerie_music.webp"),
					hk: true,
					key: "f",
				},
				{
					type: "music",
					name: "Suspense",
					url: "https://www.youtube.com/watch?v=EApZmmYg_oQ",
					image: require("assets/_img/soundboard/suspense.webp"),
					hk: true,
					key: "g",
				},
				// AMBIENCE
				{
					type: "ambience",
					name: "Rain",
					url: "https://www.youtube.com/watch?v=fGRh_hIpDt4",
					image: require("assets/_img/soundboard/rain.webp"),
					hk: true,
					key: "h",
				},
				{
					type: "ambience",
					name: "Snow",
					url: "https://www.youtube.com/watch?v=sGkh1W5cbH4",
					image: require("assets/_img/soundboard/snow.webp"),
					hk: true,
					key: "i",
				},
				{
					type: "ambience",
					name: "Thunder",
					url: "https://www.youtube.com/watch?v=fkFiIhDR_nc",
					image: require("assets/_img/soundboard/thunder.webp"),
					hk: true,
					key: "j",
				},
				{
					type: "ambience",
					name: "Forest by Day",
					url: "https://www.youtube.com/watch?v=xNN7iTA57jM",
					image: require("assets/_img/soundboard/forest_by_day.webp"),
					hk: true,
					key: "k",
				},
				{
					type: "ambience",
					name: "Forest by Night",
					url: "https://www.youtube.com/watch?v=ABCwX_ERUmw",
					image: require("assets/_img/soundboard/forest_by_night.webp"),
					hk: true,
					key: "l",
				},
				{
					type: "ambience",
					name: "Cave",
					url: "https://www.youtube.com/watch?v=kxqJuc1HHbg",
					image: require("assets/_img/soundboard/cave.webp"),
					hk: true,
					key: "m",
				},
				{
					type: "ambience",
					name: "Campfire",
					url: "https://www.youtube.com/watch?v=7KFoj-SOfHs",
					image: require("assets/_img/soundboard/campfire.webp"),
					hk: true,
					key: "n",
				},
				{
					type: "ambience",
					name: "Town by Day",
					url: "https://www.youtube.com/watch?v=WJrqwa6tMQY",
					image: require("assets/_img/soundboard/town_by_day.webp"),
					hk: true,
					key: "o",
				},
				{
					type: "ambience",
					name: "Town by Night",
					url: "https://www.youtube.com/watch?v=N9ghsVSTNuI&t=711s",
					image: require("assets/_img/soundboard/town_by_night.webp"),
					hk: true,
					key: "p",
				},
				{
					type: "ambience",
					name: "Tavern",
					url: "https://www.youtube.com/watch?v=rv3Nl-Od9YU",
					image: require("assets/_img/soundboard/tavern.webp"),
					hk: true,
					key: "q",
				},
				{
					type: "ambience",
					name: "Battlefield",
					url: "https://www.youtube.com/watch?v=VaKVLWZrG-4",
					image: require("assets/_img/soundboard/battlefield.webp"),
					hk: true,
					key: "r",
				},
				{
					type: "ambience",
					name: "Battle",
					url: "https://www.youtube.com/watch?v=Z98ZMt1zc94",
					image: require("assets/_img/soundboard/battle.webp"),
					hk: true,
					key: "s",
				},
				{
					type: "ambience",
					name: "Eerie",
					url: "https://www.youtube.com/watch?v=Jh9E7Cus7JA",
					image: require("assets/_img/soundboard/eerie_ambience.webp"),
					hk: true,
					key: "t",
				},
			],
		};
	},
	computed: {
		...mapGetters(["music", "tier", "soundboard"]),
		board() {
			const links = this.soundboard || [];
			const board = links.concat(this.hk_links);

			return board
				.filter((link) => link.type === this.type)
				.map((item) => ({ ...item, icon: this.getIcon(item.url) }));
		},
		filtered() {
			return this.search
				? this.board.filter((link) => link.name?.toLowerCase().includes(this.search.toLowerCase()))
				: this.board;
		},
	},
	async mounted() {
		await this.get_soundboard();
		this.loading = false;
	},
	methods: {
		...mapActions([
			"play_music",
			"play_ambience",
			"get_soundboard",
			"add_soundboard_link",
			"delete_soundboard_link",
		]),
		getIcon(url, type) {
			switch (true) {
				case urlType(url) === "youtube":
					return "fab fa-youtube";
				case urlType(url) === "spotify":
					return "fab fa-spotify";
				case type === "ambience":
					return "fa fa-volume";
				default:
					return "fa fa-music";
			}
		},
		async addLink() {
			this.add_dialog = false;
			await this.add_soundboard_link(this.add);
			this.add = {
				type: this.type,
				name: null,
				url: null,
				image: null,
			};
		},
		play(sound) {
			if (sound.type === "music") {
				this.play_music(sound.url === this.music?.url ? null : sound);
			} else {
				this.play_ambience(sound);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.soundboard {
	.board {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		gap: 10px;
		padding-bottom: 46px;
		transition: transform 1s;

		&__button {
			width: 80px;
			height: 80px;
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			color: $white;
			text-shadow: 1px 1px 0px $black;
			border-radius: 8px;
			background-size: cover;
			background-position: center;
			font-size: 10px;
			text-align: center;
			background-color: $neutral-8;
			transition: all 0.3s ease-in-out;
			gap: 0;
			padding-top: 10px;

			&-title {
				position: absolute;
				bottom: 0;
				padding: 8px 4px 3px 4px;
				width: 100%;
				background: linear-gradient(
					180deg,
					rgba(215, 215, 215, 0) 0%,
					rgba(0, 0, 0, 0.7511379551820728) 100%
				);
				border-bottom-left-radius: 8px;
				border-bottom-right-radius: 8px;
				z-index: 10;
			}
			&-icon {
				font-size: 20px;
				line-height: 30px;
				opacity: 0.7;
				z-index: 10;
			}
			&-logo {
				width: 14px;
				position: absolute;
				top: -3px;
				right: -5px;
				z-index: 20;
			}
			&-bg {
				overflow: hidden;
				position: absolute;
				border-radius: inherit;
				top: 0;
				bottom: 0;

				img {
					transition: all 0.1s ease-in-out;
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
			&-delete {
				z-index: 20;
				box-shadow: 0px 0px 8px 4px #0000006c;
			}
			&:hover {
				box-shadow: 0px 0px 8px 4px #0000006c;

				.board__button-bg {
					img {
						transform: scale(1.1);
					}
				}
			}
		}
	}
	&__actions {
		position: absolute;
		display: flex;
		gap: 8px;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0 8px 8px 8px;
		width: 100% !important;
		z-index: 40;
		background: $neutral-6;
	}
}
</style>
