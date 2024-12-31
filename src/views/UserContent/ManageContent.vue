<template>
	<hk-card header="Manage your content">
		<div class="card-body">
			<template v-if="overencumbered">
				<h3><i aria-hidden="true" class="fas fa-box-full neutral-2" /> You're over encumbered</h3>
				<p>
					You can either delete some of your content, or get a subscription that allows for more.
				</p>
				<router-link to="/pricing" class="btn btn-block btn-lg bg-neutral-9 mt-2">
					<i aria-hidden="true" class="fab fa-patreon patreon-red mr-2" />
					{{ tier.price === "Free" ? "Get" : "Upgrade" }} subscription
				</router-link>
			</template>

			<h3 class="mt-4">Manage your content</h3>
			<Content />
		</div>
	</hk-card>
</template>

<script>
import { mapGetters } from "vuex";
import Content from "src/components/userContent/Content";

export default {
	name: "manage-content",
	components: {
		Content,
	},
	data() {
		return {
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
		...mapGetters(["user", "tier", "content_count", "overencumbered"]),
	},
};
</script>
