// Main application file

// Import module components
import {
    handleTemplateUpload,
    importNames,
    handleCSVUpload
} from './filehandlers.js';

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

        // Names configuration - each entry: { name, ic, extras: [string, ...] }
        names: [{ name: 'John Doe', ic: '', extras: [] }],

        // Position and styling for the Name overlay
        namePosition: {
            x: 50,
            y: 50,
            fontSize: 36,
            color: '#000000'
        },

        // Position and styling for the IC overlay
        icPosition: {
            x: 50,
            y: 60,
            fontSize: 24,
            color: '#000000'
        },

        // Extensible extra field definitions
        // Each entry: { label: 'Date', position: { x, y, fontSize, color } }
        extraFields: [],

        // Shared font family across all overlays (Name + IC + every Extra)
        fontFamily: 'Times New Roman, serif',

        // Which position tab is currently active: 'name' | 'ic' | 'extra-0' | 'extra-1' | ...
        activeTab: 'name',

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
        // First entry used for live preview
        previewEntry() {
            return this.names[0] || { name: 'Sample Name', ic: '', extras: [] };
        },

        // Proxy that maps activeTab to the matching position object.
        // The position sliders v-model into this proxy so a single set of
        // sliders drives whichever overlay is being edited.
        currentPosition: {
            get() {
                if (this.activeTab === 'name') return this.namePosition;
                if (this.activeTab === 'ic') return this.icPosition;
                if (this.activeTab.startsWith('extra-')) {
                    const index = parseInt(this.activeTab.slice(6), 10);
                    const field = this.extraFields[index];
                    return field ? field.position : this.namePosition;
                }
                return this.namePosition;
            }
        },

        // Label of the currently active tab (used when editing extra-tab labels)
        currentTabLabel() {
            if (this.activeTab === 'name') return 'Name';
            if (this.activeTab === 'ic') return 'IC';
            if (this.activeTab.startsWith('extra-')) {
                const index = parseInt(this.activeTab.slice(6), 10);
                const field = this.extraFields[index];
                return field ? field.label : '';
            }
            return '';
        },

        // Check if we can generate certificates
        canGenerate() {
            return this.templateURL &&
                  this.names.length > 0 &&
                  this.names.some(entry => entry.name && entry.name.trim() !== '') &&
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

        // Tab switching
        selectTab(tabId) {
            this.activeTab = tabId;
        },

        // Add a new extra field definition and grow every entry's extras array
        addExtraField() {
            const defaultLabel = `Extra ${this.extraFields.length + 1}`;
            this.extraFields.push({
                label: defaultLabel,
                position: {
                    x: 50,
                    y: 70 + (this.extraFields.length * 10),
                    fontSize: 20,
                    color: '#000000'
                }
            });
            // Grow every entry's extras array to match
            this.names.forEach(entry => {
                entry.extras.push('');
            });
            // Switch to the new tab
            this.activeTab = `extra-${this.extraFields.length - 1}`;
        },

        // Remove an extra field at index, shrink every entry's extras array
        removeExtraField(index) {
            this.extraFields.splice(index, 1);
            this.names.forEach(entry => {
                entry.extras.splice(index, 1);
            });
            // If the removed tab was active, fall back to Name
            if (this.activeTab === `extra-${index}` ||
                (this.activeTab.startsWith('extra-') &&
                 parseInt(this.activeTab.slice(6), 10) >= this.extraFields.length)) {
                this.activeTab = 'name';
            }
        },

        // Update an extra field's label (called when user edits the label input)
        updateExtraLabel(index, newLabel) {
            if (this.extraFields[index]) {
                this.extraFields[index].label = newLabel;
            }
        },

        // Certificate generation
        generateCertificates() {
            generateCertificates.call(this);
        }
    }
});
