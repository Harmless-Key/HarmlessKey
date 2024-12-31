<template>
	<q-no-ssr class="content" v-if="tier && userInfo">
		<user-banner />
		<Tutorial v-if="show_tutorial" />
		<div class="row q-col-gutter-md">
			<div class="col-12">
				<hk-card>
					<div slot="header" class="card-header">
						<span>Your Subscription</span>
						<strong>{{ tier.name }}</strong>
					</div>
					<div class="card-body">
						<div v-if="!userInfo.patreon_id">
							<div class="text-center mb-3">
								<PatreonLinkButton class="btn-block btn-lg" />
								<div class="mt-3">
									To access your subscription benefits, you have to link your Patreon account to
									your Shieldmaiden account.
								</div>
							</div>
						</div>
						<!-- HAS A SUBSCRIPTION -->
						<template v-if="userInfo.patreon_id">
							<PaymentDeclined />
							<q-banner class="mb-3 bg-neutral-8" rounded>
								<q-icon slot="avatar" name="fab fa-patreon" class="patreon-red" />
								<template v-if="userInfo.patron">
									<h3 class="mb-1">
										Patreon:
										<strong v-if="userInfo.patron?.expired" class="red"> Expired </strong>
										<strong v-else>
											{{ userInfo.patron.tier }}
										</strong>
									</h3>
									<p v-if="!userInfo.patron?.expired">
										Thank you so much for your support.
										<i aria-hidden="true" class="patreon-red fas fa-heart"></i>
									</p>
								</template>
								<template v-else>
									<h3>No active Patreon subscription</h3>
									<p>
										Our subscriptions are handled by Patreon, to make use of our benefits, please
										get a subscription on our Patreon with your linked Patreon account.
									</p>
								</template>
								<p>
									Linked Patreon account: <strong>{{ userInfo.patreon_email }}</strong>
								</p>

								<div
									v-if="
										userInfo.patron &&
										userInfo.patron?.last_charge_status === 'Declined' &&
										!userInfo.patron.expired
									"
								>
									<h3 class="red">Payment Declined</h3>
									<p>
										Your last payment on Patreon was declined, your subscription will automatically
										be cancelled on <b>{{ makeDate(userInfo.patron?.pledge_end) }}</b
										>.<br />
										Go to
										<a href="https://www.patreon.com" target="_blank" rel="noopener">patreon.com</a>
										to check your payment details.
									</p>
								</div>
								<template slot="action">
									<button class="btn btn-sm bg-neutral-5 mr-2" @click="unlinkPatreon">
										<hk-icon icon="fas fa-unlink" class="mr-1" /> Unlink account
									</button>
									<a
										v-if="userInfo.patron && userInfo.patron.expired"
										href="https://www.patreon.com/join/shieldmaidenapp"
										target="_blank"
										class="btn btn-sm"
										rel="noopener"
									>
										<hk-icon icon="fas fa-redo-alt" class="mr-1" /> Renew
									</a>
									<a
										v-else-if="userInfo.patron"
										href="https://www.patreon.com/join/shieldmaidenapp/checkout?edit=1"
										class="btn btn-sm"
										target="_blank"
										rel="noopener"
									>
										Cancel subscription
									</a>
									<a
										v-else
										href="https://www.patreon.com/join/shieldmaidenapp"
										class="btn btn-sm"
										target="_blank"
										rel="noopener"
									>
										Subscribe
									</a>
								</template>
							</q-banner>
						</template>

						<q-banner class="mb-3 bg-neutral-8" rounded>
							<q-icon slot="avatar" name="fas fa-ticket-alt" />
							<h3 class="mb-1">Voucher subscription</h3>
							<template v-if="voucher">
								<p v-if="voucher.message" class="green">{{ voucher.message }}</p>
								<p>
									Your voucher ends on:
									<span class="red" v-if="voucher.date">{{ makeDate(voucher.date, false) }}</span>
									<i aria-hidden="true" v-else>never</i>.
								</p>
							</template>
							<p v-else>You currently don't have an active voucher</p>
							<q-input
								class="text-uppercase full-width mb-2"
								:dark="$store.getters.theme === 'dark'"
								filled
								square
								v-model="voucher_input_text"
								label="Voucher code"
								v-on:keyup.enter="addVoucher"
							/>
							<button slot="action" class="btn btn-sm" @click="addVoucher">Activate</button>
						</q-banner>

						<!-- TIER -->
						<h2 class="mb-1">Your active Subscription</h2>
						<p>
							Tier: <span class="patreon-red">{{ tier.name }}</span>
						</p>
						<p v-if="tier.name === 'Deity'" class="neutral-2">You have unlimited power.</p>
						<p v-if="tier.name === 'Legacy'" class="neutral-2">
							The legacy tier is for anyone who created an account before the 15th of May 2024
						</p>

						<Tier />
						<router-link
							v-if="tier.price === 'Free'"
							class="btn btn-block bg-patreon-red mt-4"
							to="/pricing"
						>
							Subscribe for more storage
						</router-link>
					</div>
					<!-- VOUCHER -->
				</hk-card>
				<!-- Content -->
				<hk-card header="Your content">
					<div class="card-body">
						<Content />
						<router-link
							v-if="tier.name !== 'Deity'"
							class="btn btn-block bg-neutral-5 mt-3"
							to="/pricing"
						>
							Need more slots?
						</router-link>
					</div>
				</hk-card>
			</div>
		</div>

		<!-- ACTIONS -->
		<hk-card header="Account" class="mb-0">
			<div class="card-body">
				<h2>Sign in methods</h2>
				<q-list class="mb-4">
					<q-item
						v-for="{ key, name, icon } of providers"
						:key="key"
						class="bg-neutral-9 mb-1"
						:class="{ 'neutral-3': !sign_in_methods.includes(key) }"
					>
						<q-item-section avatar><hk-icon :icon="icon" /></q-item-section>
						<q-item-section>
							{{ name }}
							<template v-if="!sign_in_methods.includes(key)">(Not linked)</template>
						</q-item-section>
						<q-item-section
							v-if="!sign_in_methods.includes(key) || sign_in_methods.length > 1"
							avatar
						>
							<button
								class="btn btn-sm bg-neutral-5"
								@click="sign_in_methods.includes(key) ? unlinkMethod(key) : linkMethod(key)"
							>
								<hk-icon :icon="sign_in_methods.includes(key) ? 'fas fa-unlink' : 'fas fa-link'" />
							</button>
						</q-item-section>
					</q-item>
				</q-list>
				<h2>Actions</h2>
				<div v-if="sign_in_methods.includes('password')" class="mb-3">
					<a @click="resetPassword()" class="neutral-2">
						<i aria-hidden="true" class="fas fa-redo-alt blue mr-1" /> Reset Password
					</a>
					<p v-if="resetError" class="red text-center">
						<i aria-hidden="true" class="fas fa-exclamation-triangle" /> {{ resetError }}
					</p>
					<p v-if="resetSuccess" class="green text-center">
						<i aria-hidden="true" class="fas fa-check" /> {{ resetSuccess }}
					</p>
				</div>
				<router-link to="/profile/delete-account" class="neutral-2">
					<i aria-hidden="true" class="fas fa-trash-alt red mr-1" /> Delete account
				</router-link>
			</div>
		</hk-card>
		<q-dialog v-model="password_dialog">
			<div>
				<ValidationObserver v-slot="{ handleSubmit, valid }">
					<q-form @submit="handleSubmit(linkMethod('password'))">
						<hk-card header="Set a password">
							<div class="card-body pb-0">
								<hk-input :value="user.email" readonly class="mb-4" />
								<hk-input
									v-model="password"
									autocomplete="new-password"
									class="mb-2"
									type="password"
									placeholder="Password"
									name="password"
									rules="required"
								/>

								<hk-input
									v-model="confirm_password"
									autocomplete="new-password"
									class="mb-2"
									type="password"
									placeholder="Confirm Password"
									rules="required|confirmed:password"
									name="Confirm Password"
								/>
							</div>
							<div slot="footer" class="card-footer">
								<q-btn no-caps label="Cancel" type="submit" :disabled="!valid" />
								<q-btn no-caps label="Confirm" color="primary" type="submit" :disabled="!valid" />
							</div>
						</hk-card>
					</q-form>
				</ValidationObserver>
			</div>
		</q-dialog>
		<q-dialog v-model="sign_in_dialog">
			<SignIn
				@sign-in="handleSignIn"
				message="This is a sensitive action, please login again first"
			/>
		</q-dialog>
	</q-no-ssr>
</template>

<script>
import { firebase, auth } from "src/firebase";
import { general } from "src/mixins/general.js";
import { mapActions, mapGetters } from "vuex";
import Content from "src/components/userContent/Content";
import Tier from "src/components/userContent/Tier";
import UserBanner from "src/components/userContent/UserBanner";
import Tutorial from "src/components/userContent/Tutorial";
import PatreonLinkButton from "src/components/PatreonLinkButton";
import PaymentDeclined from "src/components/PaymentDeclined.vue";
import SignIn from "src/components/SignIn.vue";

export default {
	name: "Profile",
	components: {
		UserBanner,
		Content,
		Tier,
		Tutorial,
		PatreonLinkButton,
		PaymentDeclined,
		SignIn,
	},
	preFetch({ store, redirect }) {
		if (!store.getters.user) {
			redirect("/sign-in");
		} else if (!store.getters.userInfo) {
			redirect("/set-username");
		}
	},
	mixins: [general],
	data() {
		return {
			error: "",
			resetError: undefined,
			resetSuccess: undefined,
			voucher_input_text: undefined,
			sign_in_dialog: false,
			password_dialog: false,
			password: null,
			confirm_password: null,
			providers: [
				{
					key: "password",
					name: "Email and Password",
					icon: "fas fa-lock",
				},
				{
					key: "google.com",
					name: "Google",
					icon: "fab fa-google",
				},
			],
			sign_in_methods: [],
			content_types: [
				{
					type: "campaigns",
					icon: "fa-dungeon",
				},
				{
					type: "players",
					icon: "fa-user",
				},
				{
					type: "npcs",
					icon: "fa-dragon",
				},
				{
					type: "spells",
					icon: "fa-wand-magic",
				},
				{
					type: "reminders",
					icon: "fa-stopwatch",
				},
				{
					type: "items",
					icon: "fa-staff",
				},
			],
		};
	},
	computed: {
		...mapGetters(["user", "userInfo", "tier", "voucher", "content_count"]),
		show_tutorial() {
			return (
				!this.content_count.campaigns ||
				!this.content_count.players ||
				!this.content_count.encounters
			);
		},
	},
	async mounted() {
		await this.fetchMethods();
	},
	methods: {
		...mapActions(["set_active_voucher", "setUserInfo", "update_userInfo", "checkEncumbrance"]),
		async fetchMethods() {
			auth.fetchSignInMethodsForEmail(this.user.email).then((providers) => {
				this.sign_in_methods = providers;
			});
		},
		resetPassword() {
			var vm = this;
			var emailAddress = this.user.email;

			auth
				.sendPasswordResetEmail(emailAddress)
				.then(function () {
					// Email sent.
					vm.resetSuccess =
						"An email was sent to " + emailAddress + " with a link to reset your password.";
					vm.resetError = undefined;
				})
				.catch(function (error) {
					// An error happened.
					vm.error = error.message;
				});
		},
		async addVoucher() {
			this.set_active_voucher(this.voucher_input_text)
				.then(() => {
					this.$snotify.success(
						`Successfully added ${this.voucher_input_text.toUpperCase()} voucher.`
					);
					this.voucher_input_text = null;
				})
				.catch((error) => {
					this.$snotify.error(error);
				});
		},
		async unlinkPatreon() {
			await this.update_userInfo({
				patreon_id: null,
				patreon_email: null,
			});
			await this.setUserInfo();
			await this.checkEncumbrance();
		},
		showPasswordDialog() {
			this.password_dialog = true;
		},
		async linkMethod(method) {
			const user = firebase.auth().currentUser;
			if (user) {
				if (method === "google.com") {
					const provider = new firebase.auth.GoogleAuthProvider();
					await user
						.linkWithPopup(provider)
						.then(async () => {
							await this.fetchMethods();
						})
						.catch((e) => {
							console.error(e);
							this.sign_in_dialog = true;
						});
				} else if (method === "password") {
					if (!this.password_dialog) {
						this.password_dialog = true;
					} else {
						const credential = firebase.auth.EmailAuthProvider.credential(
							this.user.email,
							this.password
						);
						await user
							.linkWithCredential(credential)
							.then(async () => {
								this.password = null;
								this.confirm_password = null;
								this.password_dialog = false;
								await this.fetchMethods();
							})
							.catch((e) => {
								console.error(e);
								this.sign_in_dialog = true;
							});
					}
				}
			}
		},
		async unlinkMethod(method) {
			const user = firebase.auth().currentUser;
			if (user) {
				await user
					.unlink(method)
					.then(async () => {
						await this.fetchMethods();
					})
					.catch((e) => {
						console.error(e);
						this.sign_in_dialog = true;
					});
			}
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
.content {
	.user {
		display: grid;
		grid-template-columns: 120px 1fr;

		.img {
			width: 100px;
			height: 100px;
			margin-bottom: 20px;
			border-radius: 50%;
			display: block;
			background-size: cover;
			background-position: center top;
		}
		.info {
			span {
				width: 80px;
				display: inline-block;
			}
		}
	}
}
</style>
