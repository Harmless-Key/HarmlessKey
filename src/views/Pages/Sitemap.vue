<template>
	<div class="content">
		<h1>Sitemap</h1>
		<ul>
			<li><router-link to="/">Home</router-link></li>
			<li><router-link to="/demo">Demo</router-link></li>
			<li><router-link to="/about-us">About Us</router-link></li>
			<li><router-link to="/pricing">Patreon</router-link></li>
			<li><router-link to="/sign-up">Sign Up</router-link></li>
			<li><router-link to="/sign-in">Sign In</router-link></li>
			<li><router-link to="/documentation">Documentation</router-link></li>
			<li><router-link to="/support">Support</router-link></li>
			<li><router-link to="/feedback">Feedback</router-link></li>
			<li><router-link to="/changelog">Changelog</router-link></li>
			<li><router-link to="/privacy-policy">Privacy Policy</router-link></li>
			<li>
				<router-link to="/compendium">Compendium</router-link>
				<ul>
					<li><router-link to="/compendium/conditions">Conditions</router-link></li>
					<li><router-link to="/compendium/monsters">Monsters</router-link></li>
					<li><router-link to="/compendium/spells">Spells</router-link></li>
					<li><router-link to="/compendium/items">Items</router-link></li>
				</ul>
			</li>
			<li>
				<router-link to="/tools">Tools</router-link>
				<ul>
					<li><router-link to="/tools/combat-tracker">Combat Tracker</router-link></li>
					<li>
						<router-link to="/tools/encounter-builder">Encounter Builder</router-link>
						<ul>
							<li>
								<router-link to="/tools/encounter-builder/build-encounter"
									>Build Encounter</router-link
								>
							</li>
						</ul>
					</li>
					<li>
						<router-link to="/tools/monster-creator">Monster Creator</router-link>
						<ul>
							<li>
								<router-link to="/tools/monster-creator/create-monster">Create Monster</router-link>
							</li>
						</ul>
					</li>
					<li><router-link to="/tools/spell-creator">Spell Creator</router-link></li>
					<li><router-link to="/tools/character-builder">Character Builder</router-link></li>
				</ul>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: "Sitemap",
};
</script>
