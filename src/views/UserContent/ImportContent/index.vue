<template>
	<div v-if="tier.price !== 'Free'" class="d-flex justify-center">
		<hk-card header="Shieldmaiden" class="select">
			<div class="card-body">
				<p>Import a Shieldmaiden export</p>
			</div>
			<div slot="footer">
				<router-link to="/content/import/hk_import" class="btn btn-block">Select</router-link>
			</div>
		</hk-card>
		<hk-card header="Convert Old" class="disabled select">
			<div class="card-body">
				<p>Convert your old exports to new format</p>
			</div>
			<div slot="footer">
				<button class="btn btn-block">Select</button>
			</div>
		</hk-card>
		<hk-card header="External Source" class="disabled select">
			<div class="card-body">
				<p>Import from an external source</p>
			</div>
			<div slot="footer">
				<button class="btn btn-block">Select</button>
			</div>
		</hk-card>
		<hk-card header="Sync Extension" class="disabled select">
			<div class="card-body">
				<p>Import from the HK Content Sync Extension</p>
			</div>
			<div slot="footer">
				<button class="btn btn-block">Select</button>
			</div>
		</hk-card>
	</div>
	<hk-card v-else header="Import content">
		<div class="card-body d-flex flex-col justify-center text-center">
			<h2>With a subscription you can import Shieldmaiden content created by others.</h2>
			<p>
				Content creators can export their entire one shots or campaigns from Shieldmaiden and you
				will be able to import them including all encounters and monsters.
			</p>
			<router-link to="/pricing" class="btn btn-lg mt-2">Get a subscription</router-link>
		</div>
	</hk-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "import-content",
	computed: {
		...mapGetters(["tier"]),
	},
};
</script>

<style lang="scss" scoped>
.hk-card.select {
	max-width: 200px;
	margin: 10px;
	user-select: none;
}
</style>
