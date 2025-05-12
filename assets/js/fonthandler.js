// Font handling functions for certificate

/**
 * Handle font file upload
 * @param {Event} event - The file input change event
 */
export function handleFontUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!isFontFile(file)) {
        alert('Please upload a valid font file (ttf, otf, woff, woff2).');
        return;
    }
    
    loadCustomFont.call(this, file);
}

/**
 * Check if file is a valid font file
 * @param {File} file - The file to check
 * @returns {boolean} True if file is a font file
 */
function isFontFile(file) {
    const validFontTypes = ['font/ttf', 'font/otf', 'font/woff', 'font/woff2'];
    const validExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
    
    // Check MIME type if available
    if (validFontTypes.includes(file.type)) {
        return true;
    }
    
    // Check file extension as fallback
    return validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
}

/**
 * Load the custom font into the document
 * @param {File} fontFile - The font file to load
 */
function loadCustomFont(fontFile) {
    // Create a unique font family name
    const fontName = 'custom-certificate-font-' + Date.now();
    
    // Create a URL for the font file
    const fontURL = URL.createObjectURL(fontFile);
    
    // Create a style element for the @font-face rule
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @font-face {
            font-family: '${fontName}';
            src: url('${fontURL}') format('${getFontFormat(fontFile.name)}');
            font-weight: normal;
            font-style: normal;
        }
    `;
    
    // Remove previous custom font if exists
    if (this.customFontStyle) {
        document.head.removeChild(this.customFontStyle);
    }
    
    // Add the style element to the document head
    document.head.appendChild(styleElement);
    
    // Store references
    this.customFontStyle = styleElement;
    this.customFontName = fontName;
    this.customFontURL = fontURL;
    this.customFontFile = fontFile;
    
    // Update the font family in the name position settings
    this.namePosition.fontFamily = fontName;
    
    // Update font display name for UI
    this.customFontDisplayName = fontFile.name;
    
    console.log(`Loaded custom font: ${fontFile.name} as ${fontName}`);
}

/**
 * Get the font format based on file extension
 * @param {string} filename - The font filename
 * @returns {string} The font format
 */
function getFontFormat(filename) {
    const lowerName = filename.toLowerCase();
    
    if (lowerName.endsWith('.ttf')) return 'truetype';
    if (lowerName.endsWith('.otf')) return 'opentype';
    if (lowerName.endsWith('.woff')) return 'woff';
    if (lowerName.endsWith('.woff2')) return 'woff2';
    
    // Default to truetype
    return 'truetype';
}

/**
 * Reset to default font
 */
export function resetToDefaultFont() {
    // Remove custom font style if exists
    if (this.customFontStyle) {
        document.head.removeChild(this.customFontStyle);
        this.customFontStyle = null;
    }
    
    // Reset to default font family
    this.namePosition.fontFamily = 'Times New Roman, serif';
    this.customFontName = null;
    this.customFontURL = null;
    this.customFontFile = null;
    this.customFontDisplayName = null;
}