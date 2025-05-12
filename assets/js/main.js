// Main application file

// Import module components
import { 
    handleTemplateUpload, 
    importNames, 
    handleCSVUpload 
} from './fileHandlers.js';

import { 
    addNameField, 
    removeName 
} from './namesManager.js';

import { 
    generateCertificates 
} from './certificateGenerator.js';

import {
    handleFontUpload,
    resetToDefaultFont
} from './fonthandler.js';

// Main Vue application
new Vue({
    el: '#app',
    data: {
        // Certificate template
        templateURL: null,
        templateFile: null,
        
        // Names configuration
        names: ['John Doe'], // Default name for preview
        
        // Position and styling for names
        namePosition: {
            x: 50,
            y: 50,
            fontSize: 36,
            color: '#000000',
            fontFamily: 'Times New Roman, serif'
        },
        
        // Custom font information
        customFontStyle: null,
        customFontName: null,
        customFontURL: null,
        customFontFile: null,
        customFontDisplayName: null,
        
        // Flag to indicate if generation is in progress
        isGenerating: false
    },
    
    computed: {
        // Name to display in the preview
        previewName() {
            return this.names[0] || 'Sample Name';
        },
        
        // Check if we can generate certificates
        canGenerate() {
            return this.templateURL && 
                  this.names.length > 0 && 
                  this.names.some(name => name.trim() !== '') &&
                  !this.isGenerating;
        }
    },
    
    methods: {
        // File upload handlers
        handleTemplateUpload(event) {
            handleTemplateUpload.call(this, event);
        },
        
        importNames() {
            importNames.call(this);
        },
        
        handleCSVUpload(event) {
            handleCSVUpload.call(this, event);
        },
        
        // Font handling methods
        handleFontUpload(event) {
            handleFontUpload.call(this, event);
        },
        
        resetToDefaultFont() {
            resetToDefaultFont.call(this);
        },
        
        // Names management
        addNameField() {
            addNameField.call(this);
        },
        
        removeName(index) {
            removeName.call(this, index);
        },
        
        // Certificate generation
        generateCertificates() {
            generateCertificates.call(this);
        }
    }
});