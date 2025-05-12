// File handling functions

import { isImageFile, isCSVFile, parseCSVNames } from './utils.js';

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
        const names = parseCSVNames(csv);
        
        if (names.length > 0) {
            vueInstance.names = names;
        } else {
            alert('No valid names found in the CSV file.');
        }
    };
    
    reader.readAsText(file);
}