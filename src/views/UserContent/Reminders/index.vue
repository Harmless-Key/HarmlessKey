<template>
	<hk-card v-if="tier">
		<ContentHeader type="reminders" />
		<div class="card-body" v-if="!loading_reminders">
			<p class="neutral-2">
				Reminders create useful notifications during encounters, so you don't forget someone was
				concentrating for instance.
			</p>

			<template v-if="reminders.length">
				<q-table
					:data="reminders"
					:columns="columns"
					row-key="key"
					card-class="bg-none"
					flat
					:dark="$store.getters.theme !== 'light'"
					:loading="loading_reminders"
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
									<router-link class="btn btn-sm bg-neutral-5" :to="`${$route.path}/${props.key}`">
										<i aria-hidden="true" class="fas fa-pencil"></i>
										<q-tooltip anchor="top middle" self="center middle"> Edit </q-tooltip>
									</router-link>
									<button
										class="btn btn-sm bg-neutral-5 ml-2"
										@click="confirmDelete($event, props.key, props.row)"
									>
										<i aria-hidden="true" class="fas fa-trash-alt"></i>
										<q-tooltip anchor="top middle" self="center middle"> Delete </q-tooltip>
									</button>
								</div>
							</q-td>
						</q-tr>
					</template>
					<div slot="no-data" />
				</q-table>
			</template>

			<router-link
				v-if="!reminders.length && !overencumbered"
				class="btn btn-lg bg-neutral-5"
				:to="`${$route.path}/add-reminder`"
			>
				<i aria-hidden="true" class="fas fa-plus green"></i> Create your first reminder
			</router-link>
			<router-link
				v-else-if="tier.price === 'Free'"
				class="btn bg-neutral-8 btn-block"
				to="/pricing"
			>
				Get more reminder slots
			</router-link>
		</div>
		<hk-loader v-else name="reminders" />
	</hk-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ContentHeader from "src/components/userContent/ContentHeader";

export default {
	name: "Reminders",
	components: {
		ContentHeader,
	},
	data() {
		return {
			userId: this.$store.getters.user.uid,
			loading_reminders: true,
			search: "",
			columns: [
				{
					name: "name",
					label: "Name",
					field: "title",
					sortable: true,
					align: "left",
					classes: "truncate-cell",
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
		...mapGetters("reminders", ["reminders"]),
	},
	async mounted() {
		await this.get_reminders();
		this.loading_reminders = false;
	},
	methods: {
		...mapActions("reminders", ["get_reminders", "delete_reminder"]),
		confirmDelete(e, key, reminder) {
			//Instantly delete when shift is held
			if (e.shiftKey) {
				this.deleteReminder(key);
			} else {
				this.$snotify.error(
					"Are you sure you want to delete " + reminder + "?",
					"Delete reminder",
					{
						timeout: false,
						buttons: [
							{
								text: "Yes",
								action: (toast) => {
									this.deleteReminder(key);
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
		deleteReminder(key) {
			this.delete_reminder(key);
		},
	},
};
</script>
