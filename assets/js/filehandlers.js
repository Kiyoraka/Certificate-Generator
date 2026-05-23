// File handling functions

import { isImageFile, isCSVFile, parseCSVEntries } from './utils.js';

/**
 * Handle template image upload
 * @param {Event} event - The file input change event
 */
export function handleTemplateUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!isImageFile(file)) {
        alert('Please upload an image file for the certificate template.');
        return;
    }

    this.templateFile = file;
    this.templateURL = URL.createObjectURL(file);
}

/**
 * Trigger CSV file upload dialog
 */
export function importNames() {
    document.getElementById('csv-upload').click();
}

/**
 * Download a sample CSV file that mirrors the current field schema.
 * Columns: name, ic, then one column per defined extra field.
 * Provides 3 example rows so the user can see the format at a glance.
 */
export function downloadSampleCSV() {
    const extraLabels = this.extraFields.map(f => f.label);
    // Fake placeholder rows - sample-only data, no real personal information
    const sampleRows = [
        ['JOHN DOE', '000101-00-0001'],
        ['JANE SMITH', '000202-00-0002'],
        ['ALEX TAN', '000303-00-0003']
    ];

    // Pad each row with empty extras to match the current extraFields count
    const rows = sampleRows.map(row => {
        const padded = [...row];
        for (let i = 0; i < extraLabels.length; i++) {
            padded.push(`Sample ${extraLabels[i]}`);
        }
        return padded.join(',');
    });

    const csv = rows.join('\n') + '\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-names.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Handle CSV file upload for names
 * @param {Event} event - The file input change event
 */
export function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!isCSVFile(file)) {
        alert('Please upload a CSV file.');
        return;
    }

    readCSVFile.call(this, file);
}

/**
 * Read and process CSV file
 * @param {File} file - The CSV file to read
 */
function readCSVFile(file) {
    const reader = new FileReader();
    const vueInstance = this;

    reader.onload = function(e) {
        const csv = e.target.result;
        const entries = parseCSVEntries(csv, vueInstance.extraFields.length);

        if (entries.length > 0) {
            vueInstance.names = entries;
        } else {
            alert('No valid names found in the CSV file.');
        }
    };

    reader.readAsText(file);
}
