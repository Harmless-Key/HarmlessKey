<template>
	<div class="overview">
		<div class="home__container">
			<div class="deck">
				<hk-card>
					<template #image>
						<img
							class="card-image"
							src="~assets/_img/home/general.png"
							alt="Shieldmaiden general"
						/>
					</template>
					<div slot="header" class="card-header">Combat Tracker</div>
					We track everything in combat you can think of.
					<template slot="footer">
						<a href="#general" class="btn btn-block">Learn More</a>
					</template>
				</hk-card>
				<hk-card>
					<template #image>
						<img
							class="card-image"
							src="~assets/_img/home/builder.png"
							alt="Shieldmaiden encounter builder"
						/>
					</template>
					<div slot="header" class="card-header">Encounter Builder</div>
					Quickly create your encounters with ease.
					<template slot="footer">
						<a href="#builder" class="btn btn-block">Learn More</a>
					</template>
				</hk-card>
				<hk-card>
					<template #image>
						<img
							class="card-image"
							src="~assets/_img/home/share.png"
							alt="Shieldmaiden share initiative"
						/>
					</template>
					<div slot="header" class="card-header">Share Initiative</div>
					On a second screen, or with anyone in the world.
					<template slot="footer">
						<a href="#share" class="btn btn-block">Learn More</a>
					</template>
				</hk-card>
				<hk-card>
					<template #image>
						<img
							class="card-image"
							src="~assets/_img/home/campaign.png"
							alt="Shieldmaiden campaign tracker"
						/>
					</template>
					<div slot="header" class="card-header">Campaign Manager</div>
					Manage more than just your encounters.
					<template slot="footer">
						<a href="#campaign" class="btn btn-block">Learn More</a>
					</template>
				</hk-card>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Overview",
};
</script>

<style lang="scss" scoped>
.overview {
	padding: 100px 0;
	background-color: #111111;

	.deck {
		display: flex;
		justify-content: space-between;
		margin: -10px;

		.hk-card {
			margin: 10px;
			display: flex;
			flex: 1 1 25%;
			margin-bottom: 20px;

			.card-header {
				color: $neutral-1;
			}
			.card-footer {
				padding: 0;
			}
		}
	}
	@media only screen and (max-width: 992px) {
		.deck {
			flex-wrap: wrap;

			.hk-card {
				flex-direction: column;
				flex: 1 1 calc(50% - 20px);
			}
		}
	}
	@media only screen and (max-width: 525px) {
		.deck {
			margin: 0;

			.hk-card {
				margin: 0;
				flex: 1 1 100%;
			}
		}
	}
}
</style>
