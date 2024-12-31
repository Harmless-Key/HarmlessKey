<template>
	<div>
		<hk-card>
			<ContentHeader type="items" />

			<div class="card-body" v-if="!loading_items">
				<p class="neutral-2">These are your custom Items that you can use in your campaigns.</p>
				<template v-if="items.length">
					<q-input
						:dark="$store.getters.theme !== 'light'"
						v-model="search"
						borderless
						filled
						square
						debounce="300"
						clearable
						placeholder="Search"
					>
						<q-icon slot="prepend" name="search" />
					</q-input>

					<q-table
						:data="items"
						:columns="columns"
						row-key="key"
						card-class="bg-none"
						flat
						:dark="$store.getters.theme !== 'light'"
						:loading="loading_items"
						separator="none"
						:pagination="{ rowsPerPage: 15 }"
						:filter="search"
						wrap-cells
					>
						<template v-slot:body-cell="props">
							<q-td
								v-if="props.col.name === 'image'"
								class="avatar"
								:style="props.value ? `background-image: url(${props.value})` : ''"
							>
								<i aria-hidden="true" v-if="!props.value" class="hki-axe" />
							</q-td>

							<q-td v-else-if="props.col.name !== 'actions'" class="truncate-cell">
								<router-link v-if="props.col.name === 'name'" :to="`${$route.path}/${props.key}`">
									{{ props.value }}
								</router-link>
								<template v-else>
									{{ props.value }}
								</template>
							</q-td>

							<q-td v-else>
								<div class="text-right d-flex justify-content-end">
									<router-link class="btn btn-sm bg-neutral-5" :to="`${$route.path}/${props.key}`">
										<i aria-hidden="true" class="fas fa-pencil" />
										<q-tooltip anchor="top middle" self="center middle"> Edit </q-tooltip>
									</router-link>
									<a
										class="btn btn-sm bg-neutral-5 ml-2"
										@click="confirmDelete($event, props.key, props.row)"
									>
										<i aria-hidden="true" class="fas fa-trash-alt" />
										<q-tooltip anchor="top middle" self="center middle"> Delete </q-tooltip>
									</a>
								</div>
							</q-td>
						</template>
						<div slot="no-data" />
					</q-table>
				</template>
				<template> </template>
				<router-link
					v-if="!overencumbered && !items.length"
					to="/content/items/add-item"
					class="btn btn-lg bg-neutral-5"
				>
					<i aria-hidden="true" class="fas fa-plus green mr-1" /> Create your first item
				</router-link>
				<router-link
					v-else-if="tier.price === 'Free'"
					class="btn bg-neutral-8 btn-block"
					to="/pricing"
				>
					Get more item slots
				</router-link>
			</div>
			<hk-loader v-else name="items" />
		</hk-card>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ContentHeader from "src/components/userContent/ContentHeader";

export default {
	name: "Items",
	components: {
		ContentHeader,
	},
	data() {
		return {
			userId: this.$store.getters.user.uid,
			loading_items: true,
			search: "",

			columns: [
				{
					name: "image",
					label: "",
					field: "image",
					align: "left",
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
					name: "actions",
					label: "",
					align: "right",
				},
			],
		};
	},
	computed: {
		...mapGetters(["tier", "overencumbered"]),
		...mapGetters("items", ["items"]),
	},
	async mounted() {
		await this.get_items();
		this.loading_items = false;
	},
	methods: {
		...mapActions("items", ["get_items", "delete_item"]),
		confirmDelete(e, key, item) {
			//Instantly delete when shift is held
			if (e.shiftKey) {
				this.deleteItem(key);
			} else {
				this.$snotify.error(
					"Are you sure you want to delete " +
						item.name +
						"? It will also remove it from the campaign inventories it is linked to.",
					"Delete item",
					{
						timeout: false,
						buttons: [
							{
								text: "Yes",
								action: (toast) => {
									this.deleteItem(key);
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
		deleteItem(key) {
			this.delete_item(key);
		},
	},
};
</script>
