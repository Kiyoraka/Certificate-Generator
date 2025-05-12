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
 * Parse CSV content to extract names
 * @param {string} csvContent - The CSV file content
 * @returns {Array} Array of names
 */
export function parseCSVNames(csvContent) {
    const lines = csvContent.split(/\r\n|\n/);
    const newNames = [];
    
    for (let i = 0; i < lines.length && newNames.length < 100; i++) {
        const line = lines[i].trim();
        if (line) {
            // If there are commas, take the first column
            const name = line.split(',')[0].trim();
            if (name) {
                newNames.push(name);
            }
        }
    }
    
    return newNames;
}