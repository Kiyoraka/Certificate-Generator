// Names management functions

/**
 * Add an empty name field
 */
export function addNameField() {
    if (this.names.length < 100) {
        this.names.push('');
    }
}

/**
 * Remove a name at specific index
 * @param {number} index - The index of the name to remove
 */
export function removeName(index) {
    this.names.splice(index, 1);
    
    // Ensure we always have at least one name for preview
    if (this.names.length === 0) {
        this.names.push('');
    }
}

/**
 * Get valid names (non-empty)
 * @param {Array} names - Array of names to filter
 * @returns {Array} Array of valid names
 */
export function getValidNames(names) {
    return names.filter(name => name.trim() !== '');
}