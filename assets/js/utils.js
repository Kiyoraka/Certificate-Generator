// Utility functions

/**
 * Check if file is an image
 * @param {File} file - The file to check
 * @returns {boolean} True if file is an image
 */
export function isImageFile(file) {
    return file.type.match('image.*');
}

/**
 * Check if file is a CSV
 * @param {File} file - The file to check
 * @returns {boolean} True if file is a CSV
 */
export function isCSVFile(file) {
    return file.type === 'text/csv' || file.name.endsWith('.csv');
}

/**
 * Parse CSV content into entry objects.
 * Column order: name, ic, extra1, extra2, ...
 * Missing columns default to empty string. Backward-compatible with
 * 1-column (name only) and 2-column (name + IC) CSVs.
 *
 * @param {string} csvContent - The CSV file content
 * @param {number} extraCount - Number of extra fields currently defined
 * @returns {Array<{name: string, ic: string, extras: string[]}>} Array of entry objects
 */
export function parseCSVEntries(csvContent, extraCount = 0) {
    const lines = csvContent.split(/\r\n|\n/);
    const entries = [];

    for (let i = 0; i < lines.length && entries.length < 100; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cells = line.split(',').map(cell => cell.trim());
        const name = cells[0];
        if (!name) continue;

        const ic = cells[1] || '';
        const extras = [];
        for (let j = 0; j < extraCount; j++) {
            extras.push(cells[2 + j] || '');
        }

        entries.push({ name, ic, extras });
    }

    return entries;
}
