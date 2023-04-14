import { firebase, db } from "src/firebase";

const SPELLS_REF = db.ref("spells");
const SEARCH_SPELLS_REF = db.ref("search_spells");

/**
 * Spell Firebase Service
 * CRUD interface implementation for Firebase
 * Updates both 'custom_spells' and 'search_custom_spells' ref on CRUD
 */
export class SpellServices {
	/**
	 * Get all the spells from the search_custom_spells reference
	 *
	 * @param {String} uid ID of active user
	 * @returns All the content of search_custom_spells reference
	 */
	async getSpells(uid) {
		try {
			const spells = await SEARCH_SPELLS_REF.child(`${uid}/results`).once("value", (snapshot) => {
				return snapshot;
			});
			return spells.val();
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Get the number of spells that a user has from the search_custom_spells reference
	 *
	 * @param {String} uid ID of active user
	 * @returns Number of spells of a user
	 */
	async getSpellCount(uid) {
		try {
			const path = `${uid}/metadata/count`;
			let count = await SEARCH_SPELLS_REF.child(path).once("value");
			return count.val();
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Get an entire spell from 'custom_spells' reference
	 *
	 * @param {String} uid ID of active user
	 * @param {String} id ID of the requested spell
	 * @returns An entire spell from the 'custom_spells' reference
	 */
	async getSpell(uid, id) {
		try {
			const spell = await SPELLS_REF.child(uid)
				.child(id)
				.once("value", (snapshot) => {
					return snapshot;
				});
			return spell.val();
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Adds an spell to the 'custom_spells' ref and the 'search_custom_spells' ref.
	 * Also updates the count metadata in 'search_custom_spells'
	 *
	 * @param {String} uid ID of active user
	 * @param {Object} spell Spell to add
	 * @param {Int} new_count Updated number of spells
	 * @param {Object} search_spell Compressed spell
	 * @returns Key of the newly added spell
	 */
	async addSpell(uid, spell, search_spell) {
		try {
			spell.name = spell.name.toLowerCase();
			const newSpell = await SPELLS_REF.child(uid).push(spell);

			spell.created = firebase.database.ServerValue.TIMESTAMP;
			spell.updated = firebase.database.ServerValue.TIMESTAMP;

			// Update search_spells
			SEARCH_SPELLS_REF.child(`${uid}/results/${newSpell.key}`).set(search_spell);

			return newSpell.key;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Updates an existing spell in both 'custom_spells' and 'search_custom_spells' ref
	 *
	 * @param {String} uid ID of active user
	 * @param {String} id ID of spell to edit
	 * @param {Object} spell Edited spell
	 * @param {Object} search_spell Compressed spell
	 */
	async editSpell(uid, id, spell, search_spell) {
		spell.name = spell.name.toLowerCase();
		spell.updated = firebase.database.ServerValue.TIMESTAMP;

		SPELLS_REF.child(uid)
			.child(id)
			.set(spell)
			.then(() => {
				SEARCH_SPELLS_REF.child(`${uid}/results/${id}`).set(search_spell);
			})
			.catch((error) => {
				throw error;
			});
	}

	/**
	 * Deletes an existing spell in both 'custom_spells' and 'search_custom_spells' ref
	 *
	 * @param {String} uid ID of active user
	 * @param {String} id ID of spell to edit
	 */
	async deleteSpell(uid, id) {
		try {
			SPELLS_REF.child(uid).child(id).remove();

			//Update search_custom_spells
			SEARCH_SPELLS_REF.child(`${uid}/results`).child(id).remove();
			return;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Update spell_count in the search table of search_spells
	 *
	 * @param {String} uid User ID
	 * @param {Int} diff Difference to add or subtract from spell count
	 */
	async updateSpellCount(uid, diff) {
		const spell_count_path = `${uid}/metadata/count`;
		let spell_count = await SEARCH_SPELLS_REF.child(spell_count_path).once("value");
		await SEARCH_SPELLS_REF.child(spell_count_path).set(spell_count.val() + diff);
		return spell_count.val() + diff;
	}
}
