// Render slides to the DOM

const SlideRenderer = {
    currentSlide: 0,
    slides: [],
    container: null,
    animationsEnabled: true,

    /**
     * Initialize the renderer
     * @param {Array} slides - Array of slide objects
     * @param {HTMLElement} container - Container element
     * @param {boolean} animations - Whether animations are enabled
     */
    init(slides, container, animations = true) {
        this.slides = slides;
        this.container = container;
        this.currentSlide = 0;
        this.animationsEnabled = animations;
    },

    /**
     * Render a specific slide
     * @param {number} index - Slide index
     */
    render(index) {
        if (!this.slides || index < 0 || index >= this.slides.length) {
            return;
        }

        const slide = this.slides[index];
        this.container.textContent = slide.content;
        this.currentSlide = index;

        // Apply special styling for title slides
        if (slide.isTitle) {
            this.container.classList.add('title-slide');
        } else {
            this.container.classList.remove('title-slide');
        }

        // Apply emphasis styling
        if (slide.isEmphasis) {
            this.container.classList.add('emphasis-slide');
        } else {
            this.container.classList.remove('emphasis-slide');
        }

        // Auto-scale text based on content length
        this.autoScale();

        // Trigger animation by removing and re-adding animation class
        if (this.animationsEnabled) {
            this.container.style.animation = 'none';
            setTimeout(() => {
                this.container.style.animation = '';
            }, 10);
        } else {
            this.container.style.animation = 'none';
        }
    },

    /**
     * Auto-scale text to fit the viewport
     */
    autoScale() {
        const text = this.container.textContent;
        const length = text.length;
        
        // Calculate optimal font size based on content length
        // Shorter text = larger font, longer text = smaller font
        let fontSize;
        
        if (length <= 5) {
            fontSize = '20vw';
        } else if (length <= 10) {
            fontSize = '15vw';
        } else if (length <= 20) {
            fontSize = '12vw';
        } else if (length <= 40) {
            fontSize = '10vw';
        } else if (length <= 60) {
            fontSize = '8vw';
        } else if (length <= 100) {
            fontSize = '6vw';
        } else {
            fontSize = '4vw';
        }

        this.container.style.fontSize = fontSize;
    },

    /**
     * Go to next slide
     * @returns {boolean} True if moved, false if at end
     */
    next() {
        if (this.currentSlide < this.slides.length - 1) {
            this.render(this.currentSlide + 1);
            return true;
        }
        return false;
    },

    /**
     * Go to previous slide
     * @returns {boolean} True if moved, false if at beginning
     */
    previous() {
        if (this.currentSlide > 0) {
            this.render(this.currentSlide - 1);
            return true;
        }
        return false;
    },

    /**
     * Go to first slide
     */
    first() {
        this.render(0);
    },

    /**
     * Go to last slide
     */
    last() {
        this.render(this.slides.length - 1);
    },

    /**
     * Get current slide info
     * @returns {Object} Current slide information
     */
    getCurrentInfo() {
        return {
            current: this.currentSlide + 1,
            total: this.slides.length,
            isFirst: this.currentSlide === 0,
            isLast: this.currentSlide === this.slides.length - 1
        };
    },

    /**
     * Toggle animations on/off
     */
    toggleAnimations() {
        this.animationsEnabled = !this.animationsEnabled;
        return this.animationsEnabled;
    }
};
