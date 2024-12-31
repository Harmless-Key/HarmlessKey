<template>
	<div class="pricing">
		<div class="home__container">
			<div class="row q-col-gutter-xl items-center">
				<div class="col-12 col-md-6">
					<div class="head">
						<h2>Pricing</h2>
						<div class="text">
							<p class="mb-4">
								All of our core features are available for <strong>free</strong>, forever. For DMs
								running larger campaigns and/or wanting some extra functionality, there's paid tiers
								offering extra storage & quality of life features.
							</p>
							<p>
								Your support helps us keep the app afloat and spend more time improving it. Thank
								you!<br />
								<router-link to="/pricing" class="learn-more">Learn more</router-link>
							</p>
						</div>
						<router-link to="/sign-up" class="btn btn-lg bg-accent">
							Create Free Account
						</router-link>
					</div>
				</div>
				<div class="col-12 col-md-6">
					<iframe
						src="https://www.youtube.com/embed/-Z9i4WR5vtA?si=xYYrDRykRgjMUy8T"
						title="Shieldmaiden Subscriptions"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerpolicy="strict-origin-when-cross-origin"
						allowfullscreen
						class="interview"
					></iframe>
				</div>
			</div>

			<!-- <Tiers class="mb-4" /> -->
		</div>
	</div>
</template>

<script>
export default {
	name: "Pricing",
};
</script>

<style lang="scss" scoped>
.pricing {
	.interview {
		width: 100%;
		border-radius: $border-radius;
		aspect-ratio: 16/9;
		justify-self: flex-end;
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
