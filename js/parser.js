// Parse text input into slides

const SlideParser = {
    /**
     * Parse text content into an array of slides
     * Supports multiple input formats:
     * - Blank lines separate slides
     * - --- separates slides
     * - # for title slides
     * - Metadata block at the start
     * 
     * @param {string} content - Raw text content
     * @returns {Array} Array of slide objects
     */
    parse(content) {
        if (!content || typeof content !== 'string') {
            return [];
        }

        // Extract metadata if present
        const { metadata, body } = this.extractMetadata(content);

        // Split slides by various separators
        let slideTexts = this.splitSlides(body);

        // Create slide objects
        const slides = slideTexts
            .map(text => text.trim())
            .filter(text => text.length > 0)
            .map((text, index) => this.createSlide(text, index, metadata));

        return slides;
    },

    /**
     * Extract YAML-like metadata from the beginning of content
     * Format:
     * ---
     * theme: dark
     * font: sans-serif
     * ---
     * 
     * @param {string} content - Raw text content
     * @returns {Object} { metadata, body }
     */
    extractMetadata(content) {
        const metadataRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
        const match = content.match(metadataRegex);

        if (!match) {
            return { metadata: {}, body: content };
        }

        const metadataText = match[1];
        const body = content.replace(metadataRegex, '');

        // Parse simple key: value pairs
        const metadata = {};
        metadataText.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                const value = valueParts.join(':').trim();
                metadata[key.trim()] = value;
            }
        });

        return { metadata, body };
    },

    /**
     * Split content into individual slides
     * Supports:
     * - Double newline (blank line)
     * - --- separator
     * - Multiple blank lines
     * 
     * @param {string} content - Content without metadata
     * @returns {Array} Array of slide text
     */
    splitSlides(content) {
        // First, normalize line endings
        content = content.replace(/\r\n/g, '\n');

        // Split by --- or blank lines
        // Replace --- with a unique marker
        content = content.replace(/\n---+\n/g, '\n___SLIDE_BREAK___\n');

        // Split by the marker or double newlines
        let slides = content.split(/___SLIDE_BREAK___|\n\s*\n/);

        return slides;
    },

    /**
     * Create a slide object with metadata
     * @param {string} text - Slide text content
     * @param {number} index - Slide index
     * @param {Object} globalMetadata - Global metadata from file header
     * @returns {Object} Slide object
     */
    createSlide(text, index, globalMetadata = {}) {
        const slide = {
            id: index + 1,
            content: text,
            metadata: { ...globalMetadata }
        };

        // Check for title indicator (#)
        if (text.startsWith('#')) {
            slide.isTitle = true;
            slide.content = text.replace(/^#+\s*/, '');
            slide.metadata.fontSize = 'large';
        }

        // Check for emphasis indicators
        if (text.startsWith('!')) {
            slide.isEmphasis = true;
            slide.content = text.replace(/^!+\s*/, '');
            slide.metadata.emphasis = true;
        }

        return slide;
    },

    /**
     * Get the number of slides
     * @param {string} content - Raw text content
     * @returns {number} Number of slides
     */
    count(content) {
        return this.parse(content).length;
    },

    /**
     * Validate content
     * @param {string} content - Raw text content
     * @returns {Object} Validation result
     */
    validate(content) {
        const slides = this.parse(content);
        
        return {
            isValid: slides.length > 0,
            slideCount: slides.length,
            errors: slides.length === 0 ? ['No slides found'] : [],
            warnings: this.getWarnings(slides)
        };
    },

    /**
     * Get warnings about the presentation
     * @param {Array} slides - Array of slide objects
     * @returns {Array} Array of warning messages
     */
    getWarnings(slides) {
        const warnings = [];

        slides.forEach((slide, index) => {
            // Check for very long text
            if (slide.content.length > 100) {
                warnings.push(`Slide ${index + 1}: Text is very long (${slide.content.length} chars). Consider splitting it.`);
            }

            // Check for very long words
            const words = slide.content.split(/\s+/);
            const longWords = words.filter(word => word.length > 20);
            if (longWords.length > 0) {
                warnings.push(`Slide ${index + 1}: Contains very long words that may not fit on screen.`);
            }
        });

        return warnings;
    },

    /**
     * Get metadata from parsed content
     * @param {string} content - Raw text content
     * @returns {Object} Metadata object
     */
    getMetadata(content) {
        const { metadata } = this.extractMetadata(content);
        return metadata;
    }
};
