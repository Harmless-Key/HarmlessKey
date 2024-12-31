<template>
	<div>
		<ValidationObserver v-slot="{ handleSubmit, valid }">
			<q-form @submit="handleSubmit(edit)" greedy>
				<hk-card header="Edit campaign" :min-width="300">
					<div class="card-body">
						<ValidationProvider
							rules="required"
							name="Title"
							v-slot="{ errors, invalid, validated }"
						>
							<q-input
								:dark="$store.getters.theme === 'dark'"
								filled
								square
								label="Title *"
								autocomplete="off"
								type="text"
								class="mb-2"
								v-model="editCampaign.name"
								:error="invalid && validated"
								:error-message="errors[0]"
							/>
						</ValidationProvider>

						<q-select
							:dark="$store.getters.theme === 'dark'"
							filled
							square
							label="Advancement"
							emit-value
							map-options
							class="mb-3"
							v-model="editCampaign.advancement"
							:options="advancement_options"
						/>

						<hk-background-select
							v-if="tier && tier.price !== 'Free'"
							v-model="editCampaign.hk_background"
							label="Background"
							:disable="!!editCampaign.background"
							class="mb-3"
						/>
						<div v-else class="mb-3 flex justify-between items-center">
							<span class="my-1">
								With a subscription you have access to our background selector.
								<a
									class="btn btn-sm btn-clear"
									@click="setDrawer({ show: true, type: 'drawers/BackgroundsOverview' })"
								>
									<i class="fas fa-eye" aria-hidden="true" />
								</a>
							</span>
							<router-link class="btn bg-patreon-red" to="/pricing">Get a subscription</router-link>
						</div>

						<div class="background mt-2">
							<div
								class="img pointer"
								v-if="editCampaign.background"
								:style="{ backgroundImage: 'url(\'' + editCampaign.background + '\')' }"
								@click="image = true"
							></div>
							<div class="img" v-else>
								<q-icon name="fas fa-image" />
							</div>
							<div>
								<ValidationProvider
									rules="url"
									name="Background"
									v-slot="{ errors, invalid, validated }"
								>
									<q-input
										:dark="$store.getters.theme === 'dark'"
										filled
										square
										autocomplete="off"
										type="text"
										v-model="editCampaign.background"
										placeholder="Custom background URL"
										:error="invalid && validated"
										:error-message="errors[0]"
										@input="editCampaign.hk_background = null"
									>
										<hk-popover
											slot="append"
											header="Custom background"
											v-if="tier && tier.price !== 'Free'"
										>
											<i class="fas fa-info-circle" aria-hidden="true" />
											<template #content>
												Setting a custom background will overwrite your selected background.
											</template>
										</hk-popover>
									</q-input>
								</ValidationProvider>
							</div>
						</div>

						<div class="mt-3 neutral-2 pointer">
							<span class="btn btn-clear" @click="$set(editCampaign, 'private', null)">
								<span :class="!editCampaign.private ? 'green' : 'neutral-2'">
									<i aria-hidden="true" class="fas fa-eye"></i>
									Public
								</span>
							</span>
							/
							<span class="btn btn-clear mr-2" @click="$set(editCampaign, 'private', true)">
								<span :class="editCampaign.private ? 'red' : 'neutral-2'">
									<i aria-hidden="true" class="fas fa-eye-slash"></i>
									Private
								</span>
							</span>
							<hk-popover header="Private vs Public">
								<i aria-hidden="true" class="fas fa-info-circle blue" />
								<template #content>
									<p>
										You can only share the initiative list with your players if your campaign is set
										to public.
									</p>
									Private campaigns are hidden from your followers.
								</template>
							</hk-popover>
						</div>
					</div>
					<div slot="footer" class="card-footer">
						<q-icon v-if="!valid" name="error" color="red" size="md" class="mr-2">
							<q-tooltip anchor="top middle" self="center middle">
								There are validation errors
							</q-tooltip>
						</q-icon>
						<q-btn class="bg-neutral-5 mr-2" label="Cancel" no-caps v-close-popup />
						<q-btn color="blue" type="submit" no-caps>Save</q-btn>
					</div>
				</hk-card>
			</q-form>
		</ValidationObserver>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
	name: "EditCampaign",
	props: {
		campaign: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			user: this.$store.getters.user,
			advancement_options: [
				{
					value: "experience",
					label: "Experience",
				},
				{
					value: "milestone",
					label: "Milestone",
				},
			],
			editCampaign: { ...this.campaign },
		};
	},
	computed: {
		...mapGetters(["tier"]),
	},
	methods: {
		...mapActions("campaigns", ["update_campaign"]),
		...mapActions(["setDrawer"]),
		async edit() {
			await this.update_campaign({
				uid: this.user.uid,
				id: this.campaign.key,
				campaign: this.editCampaign,
			});
			this.$emit("close");
		},
	},
};
</script>

<style lang="scss" scoped>
.background {
	display: grid;
	grid-template-columns: 56px 1fr;
	grid-column-gap: 10px;
	font-size: 35px;
	text-align: center;

	.img {
		border: solid 1px $neutral-3;
		display: block;
		width: 56px;
		height: 56px;
		background-size: cover;
		background-position: center top;
	}
}
</style>
