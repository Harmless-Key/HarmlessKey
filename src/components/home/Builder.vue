<template>
	<div class="builder">
		<div class="home__container">
			<div class="row q-col-gutter-xl items-center">
				<div class="col-12 col-md-5">
					<div class="head">
						<h2>Encounter Builder</h2>
						<h3>Quickly build exciting encounters</h3>
						<p class="text">
							Our encounter builder is easy to use and lets you use your own custom monsters. We
							instantly calculate the difficulty for you.<br />
							<router-link to="/tools/encounter-builder" class="learn-more">Learn more</router-link>
						</p>
						<router-link to="/encounter-builder" class="btn btn-lg bg-accent">
							Try Encounter Builder
						</router-link>
					</div>
				</div>
				<div class="col-12 col-md-7">
					<img src="~assets/_img/encounter-builder-shieldmaiden.webp" alt="Encounter Builder" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Content",
};
</script>

<style lang="scss" scoped>
.builder {
	img {
		width: 100%;
		object-fit: cover;
		border-radius: $border-radius;
		aspect-ratio: 16/9;
	}
}
@media only screen and (max-width: 1023px) {
	::v-deep {
		.row {
			flex-direction: column-reverse;
		}
	}
}
@media only screen and (max-width: $sm-breakpoint) {
	.btn {
		width: 100%;
		display: block;
	}
}
</style>
