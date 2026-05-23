// Names management functions

/**
 * Add an empty name entry. Extras array length matches current extraFields.
 */
export function addNameField() {
    if (this.names.length < 100) {
        const extras = new Array(this.extraFields.length).fill('');
        this.names.push({ name: '', ic: '', extras });
    }
}

/**
 * Remove a name entry at specific index
 * @param {number} index - The index of the entry to remove
 */
export function removeName(index) {
    this.names.splice(index, 1);

    // Ensure we always have at least one entry for preview
    if (this.names.length === 0) {
        const extras = new Array(this.extraFields.length).fill('');
        this.names.push({ name: '', ic: '', extras });
    }
}

/**
 * Get valid entries (non-empty name)
 * @param {Array} names - Array of entries to filter
 * @returns {Array} Array of valid entries
 */
export function getValidNames(names) {
    return names.filter(entry => entry.name && entry.name.trim() !== '');
}
