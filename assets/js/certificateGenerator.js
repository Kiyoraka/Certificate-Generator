// Certificate generation functions
import { getValidNames } from './namesManager.js';

/**
 * Main function to generate certificates for all names
 */
export function generateCertificates() {
    if (!this.canGenerate) return;
    
    this.isGenerating = true;
    
    // Filter out empty names
    const validNames = getValidNames(this.names);
    
    if (validNames.length === 0) {
        alert('Please enter at least one name.');
        this.isGenerating = false;
        return;
    }
    
    preparePrintContainer.call(this);
    loadTemplateAndGenerateCertificates.call(this, validNames);
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
 * @param {Array} validNames - Array of valid names
 */
function loadTemplateAndGenerateCertificates(validNames) {
    const templateImg = new Image();
    const vueInstance = this;
    
    templateImg.onload = function() {
        // Detect image orientation
        const isLandscape = templateImg.width > templateImg.height;
        
        createCertificatesForNames.call(vueInstance, validNames);
        const styleElement = setupPrintStyles(isLandscape); // Pass orientation
        triggerPrintProcess.call(vueInstance, styleElement);
    };
    
    templateImg.onerror = function() {
        handleTemplateLoadError.call(vueInstance);
    };
    
    templateImg.src = this.templateURL;
}

/**
 * Create certificate elements for each name
 * @param {Array} names - Array of names
 */
function createCertificatesForNames(names) {
    const printContainer = this.$refs.printContainer;
    
    names.forEach(name => {
        const page = createCertificatePage.call(this, name);
        printContainer.appendChild(page);
    });
}

/**
 * Create a single certificate page
 * @param {string} name - The name to display on the certificate
 * @returns {HTMLElement} The certificate page element
 */
function createCertificatePage(name) {
    // Create certificate page
    const page = document.createElement('div');
    page.className = 'certificate-page';
    
    // Create certificate container
    const certificateContainer = document.createElement('div');
    certificateContainer.className = 'certificate-container';
    
    // Add template image
    const imgElement = document.createElement('img');
    imgElement.src = this.templateURL;
    certificateContainer.appendChild(imgElement);
    
    // Add name overlay
    const nameElement = createNameElement.call(this, name);
    certificateContainer.appendChild(nameElement);
    
    page.appendChild(certificateContainer);
    return page;
}

/**
 * Create name overlay element
 * @param {string} name - The name text
 * @returns {HTMLElement} The name element
 */
function createNameElement(name) {
    const nameElement = document.createElement('div');
    nameElement.textContent = name;
    nameElement.style.position = 'absolute';
    nameElement.style.left = `${this.namePosition.x}%`;
    nameElement.style.top = `${this.namePosition.y}%`;
    nameElement.style.transform = 'translate(-50%, -50%)';
    nameElement.style.fontSize = `${this.namePosition.fontSize}px`;
    nameElement.style.color = this.namePosition.color;
    nameElement.style.fontFamily = this.namePosition.fontFamily;
    nameElement.style.fontWeight = 'bold';
    nameElement.style.textAlign = 'center';
    nameElement.style.whiteSpace = 'nowrap';
    nameElement.style.zIndex = '10';
    
    return nameElement;
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
    
    // Wait a bit to ensure all content is rendered properly
    setTimeout(function() {
        // Trigger print dialog
        window.print();
        
        // Hide print container after printing and remove extra style
        setTimeout(function() {
            vueInstance.$refs.printContainer.style.display = 'none';
            vueInstance.isGenerating = false;
            document.head.removeChild(styleElement);
        }, 1000);
    }, 500);
}