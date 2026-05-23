// Certificate generation functions
import { getValidNames } from './namesManager.js';

/**
 * Main function to generate certificates for all entries
 */
export function generateCertificates() {
    if (!this.canGenerate) return;

    this.isGenerating = true;

    // Filter out entries without a name
    const validEntries = getValidNames(this.names);

    if (validEntries.length === 0) {
        alert('Please enter at least one name.');
        this.isGenerating = false;
        return;
    }

    preparePrintContainer.call(this);
    loadTemplateAndGenerateCertificates.call(this, validEntries);
}

/**
 * Prepare the print container for certificate generation
 */
function preparePrintContainer() {
    const printContainer = this.$refs.printContainer;
    printContainer.innerHTML = '';
    printContainer.style.display = 'block';
}

/**
 * Load template image and generate certificates
 * @param {Array} validEntries - Array of valid entry objects
 */
function loadTemplateAndGenerateCertificates(validEntries) {
    const templateImg = new Image();
    const vueInstance = this;

    templateImg.onload = function() {
        const isLandscape = templateImg.width > templateImg.height;

        createCertificatesForEntries.call(vueInstance, validEntries);
        const styleElement = setupPrintStyles(isLandscape);
        triggerPrintProcess.call(vueInstance, styleElement);
    };

    templateImg.onerror = function() {
        handleTemplateLoadError.call(vueInstance);
    };

    templateImg.src = this.templateURL;
}

/**
 * Create certificate elements for each entry
 * @param {Array} entries - Array of entry objects
 */
function createCertificatesForEntries(entries) {
    const printContainer = this.$refs.printContainer;

    entries.forEach(entry => {
        const page = createCertificatePage.call(this, entry);
        printContainer.appendChild(page);
    });
}

/**
 * Create a single certificate page with Name + IC + every defined Extra overlay
 * @param {Object} entry - Entry object {name, ic, extras}
 * @returns {HTMLElement} The certificate page element
 */
function createCertificatePage(entry) {
    const page = document.createElement('div');
    page.className = 'certificate-page';

    const certificateContainer = document.createElement('div');
    certificateContainer.className = 'certificate-container';

    const imgElement = document.createElement('img');
    imgElement.src = this.templateURL;
    certificateContainer.appendChild(imgElement);

    // Name overlay - always present (validation guarantees non-empty)
    certificateContainer.appendChild(
        createOverlay(entry.name, this.namePosition, this.fontFamily)
    );

    // IC overlay - skip if empty
    if (entry.ic && entry.ic.trim() !== '') {
        certificateContainer.appendChild(
            createOverlay(entry.ic, this.icPosition, this.fontFamily)
        );
    }

    // Extra overlays - one per defined extraFields entry, skip empties
    this.extraFields.forEach((field, index) => {
        const text = entry.extras[index];
        if (text && text.trim() !== '') {
            certificateContainer.appendChild(
                createOverlay(text, field.position, this.fontFamily)
            );
        }
    });

    page.appendChild(certificateContainer);
    return page;
}

/**
 * Create a single absolutely-positioned text overlay.
 * Generalizes the old createNameElement to work for any text+position.
 * @param {string} text - The text to render
 * @param {Object} position - Position object {x, y, fontSize, color}
 * @param {string} fontFamily - Font family stack
 * @returns {HTMLElement} The overlay element
 */
function createOverlay(text, position, fontFamily) {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.position = 'absolute';
    el.style.left = `${position.x}%`;
    el.style.top = `${position.y}%`;
    el.style.transform = 'translate(-50%, -50%)';
    el.style.fontSize = `${position.fontSize}px`;
    el.style.color = position.color;
    el.style.fontFamily = fontFamily;
    el.style.fontWeight = 'bold';
    el.style.textAlign = 'center';
    el.style.whiteSpace = 'nowrap';
    el.style.zIndex = '10';
    return el;
}

/**
 * Add print styles to document
 * @param {boolean} isLandscape - Whether to use landscape orientation
 * @returns {HTMLElement} The created style element
 */
function setupPrintStyles(isLandscape) {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @page {
            size: ${isLandscape ? 'landscape' : 'portrait'};
            margin: 0;
        }
    `;
    document.head.appendChild(styleElement);
    return styleElement;
}

/**
 * Handle template load error
 */
function handleTemplateLoadError() {
    alert('Error loading template image. Please try uploading again.');
    this.isGenerating = false;
    this.$refs.printContainer.style.display = 'none';
}

/**
 * Trigger printing and cleanup
 * @param {HTMLElement} styleElement - The style element to remove after printing
 */
function triggerPrintProcess(styleElement) {
    const vueInstance = this;

    setTimeout(function() {
        window.print();

        setTimeout(function() {
            vueInstance.$refs.printContainer.style.display = 'none';
            vueInstance.isGenerating = false;
            document.head.removeChild(styleElement);
        }, 1000);
    }, 500);
}
