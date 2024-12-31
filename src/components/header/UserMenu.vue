<template>
	<div class="user-menu">
		<slot />
		<div v-if="user" class="user">
			<div
				class="img"
				v-if="user.photoURL"
				:style="{ 'background-image': 'url(' + user.photoURL + ')' }"
			/>
			<i aria-hidden="true" v-else class="fas fa-user" />
			<q-popup-proxy
				:dark="$store.getters.theme === 'dark'"
				:offset="[9, 0]"
				anchor="bottom right"
				self="top right"
			>
				<div class="bg-neutral-8">
					<q-list>
						<q-item clickable v-close-popup to="/admin" v-if="userInfo && userInfo.admin">
							<q-item-section avatar
								><i aria-hidden="true" class="fas fa-crown"></i
							></q-item-section>
							<q-item-section>Admin</q-item-section>
						</q-item>
						<q-item
							clickable
							v-close-popup
							to="/contribute"
							v-if="userInfo && (userInfo.admin || userInfo.contribute)"
						>
							<q-item-section avatar
								><i aria-hidden="true" class="fas fa-file-edit"></i
							></q-item-section>
							<q-item-section>Contribute</q-item-section>
						</q-item>
						<q-item clickable v-close-popup to="/profile">
							<q-item-section avatar><i aria-hidden="true" class="fas fa-user"></i></q-item-section>
							<q-item-section>Profile</q-item-section>
						</q-item>
						<q-item clickable v-close-popup to="/pricing">
							<q-item-section avatar
								><i aria-hidden="true" class="fas fa-coins"></i
							></q-item-section>
							<q-item-section>Subscription</q-item-section>
						</q-item>
						<q-item clickable v-close-popup to="/content">
							<q-item-section avatar
								><i aria-hidden="true" class="fas fa-treasure-chest"></i
							></q-item-section>
							<q-item-section>My content</q-item-section>
						</q-item>
						<q-item clickable v-close-popup to="/content/settings">
							<q-item-section avatar><i aria-hidden="true" class="fas fa-cogs"></i></q-item-section>
							<q-item-section>Settings</q-item-section>
						</q-item>

						<q-item
							clickable
							v-close-popup
							@click="setTheme($store.getters.theme === 'dark' ? 'light' : 'dark')"
						>
							<q-item-section avatar
								><i
									aria-hidden="true"
									class="fas"
									:class="$store.getters.theme === 'dark' ? 'fa-sun' : 'fa-moon'"
								></i
							></q-item-section>
							<q-item-section
								>{{ $store.getters.theme === "dark" ? "Light" : "Dark" }} mode</q-item-section
							>
						</q-item>
						<q-separator />
						<q-item clickable v-close-popup @click="signOut()">
							<q-item-section avatar
								><i aria-hidden="true" class="fas fa-sign-out-alt"></i
							></q-item-section>
							<q-item-section>Sign out</q-item-section>
						</q-item>
					</q-list>
				</div>
			</q-popup-proxy>
		</div>
		<button v-else class="btn btn-clear btn-sm bg-neutral-6 user-btn">
			<i class="fas fa-user-circle" />
			<q-popup-proxy
				:dark="$store.getters.theme === 'dark'"
				:offset="[0, 0]"
				anchor="bottom right"
				self="top right"
			>
				<div class="bg-neutral-8">
					<q-list>
						<q-item clickable v-close-popup @click="sign_in_dialog = true">
							<q-item-section avatar
								><i aria-hidden="true" class="fas fa-sign-in"></i
							></q-item-section>
							<q-item-section>Sign in</q-item-section>
						</q-item>
					</q-list>
					<div class="p-2 bg-neutral-6">
						<router-link class="btn bg-accent p-2 px-2 btn-block text-left" to="sign-up">
							<i class="fas fa-user-plus mr-1" aria-hidden="true" />
							Sign up
						</router-link>
					</div>
				</div>
			</q-popup-proxy>
		</button>
		<q-dialog v-model="sign_in_dialog">
			<SignIn @sign-in="handleSignIn" />
		</q-dialog>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import SignIn from "../SignIn.vue";

export default {
	name: "Header",
	components: {
		SignIn,
	},
	props: {
		maintenance: {
			type: [Boolean, String],
			default: false,
		},
	},
	data() {
		return {
			environment: process.env.VUE_APP_ENV_NAME,
			sign_in_dialog: false,
		};
	},
	computed: {
		...mapGetters(["user", "userInfo"]),
	},
	methods: {
		...mapActions(["setTheme", "sign_out"]),
		signOut() {
			if (this.$route.path !== "/") this.$router.replace("/");
			this.sign_out();
		},
		handleSignIn(e) {
			if (e === "success") {
				this.sign_in_dialog = false;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.user-menu {
	font-weight: bold;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 5px;

	a {
		color: $neutral-1;
	}

	.user {
		cursor: pointer;
		font-size: 15px;
		height: 50px;
		display: flex;
		align-items: center;

		.img {
			width: 26px;
			height: 26px;
			border-radius: 50%;
			display: inline-block;
			background-size: cover;
			background-position: center top;
			background-color: $neutral-8;
		}
	}
	.user-btn {
		box-sizing: border-box;
		font-size: 22px;
		padding: 0 8px;
	}
}
</style>
