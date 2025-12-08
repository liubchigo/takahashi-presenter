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
        this.currentSlide = index;

        // Clear container
        this.container.innerHTML = '';
        
        // Remove all special classes
        this.container.classList.remove('title-slide', 'emphasis-slide', 'image-slide');

        // Handle image slides
        if (slide.isImage) {
            this.renderImageSlide(slide);
        } else {
            // Regular text slide
            this.container.textContent = slide.content;

            // Apply special styling for title slides
            if (slide.isTitle) {
                this.container.classList.add('title-slide');
            }

            // Apply emphasis styling
            if (slide.isEmphasis) {
                this.container.classList.add('emphasis-slide');
            }

            // Auto-scale text based on content length
            this.autoScale();
        }

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
     * Render an image slide
     * @param {Object} slide - Slide object with image data
     */
    renderImageSlide(slide) {
        this.container.classList.add('image-slide');
        
        // Create image wrapper
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'slide-image-wrapper';
        
        // Create image element
        const img = document.createElement('img');
        img.className = 'slide-image';
        img.alt = slide.caption || 'Presentation image';
        
        // Create loading placeholder
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'slide-image-loading';
        loadingDiv.textContent = 'Loading image...';
        imageWrapper.appendChild(loadingDiv);
        
        // Handle image load
        img.onload = () => {
            loadingDiv.style.display = 'none';
            img.style.display = 'block';
        };
        
        // Handle image error
        img.onerror = () => {
            loadingDiv.textContent = '⚠️ Image failed to load';
            loadingDiv.className = 'slide-image-error';
            console.error(`Failed to load image: ${slide.imageUrl}`);
        };
        
        img.src = slide.imageUrl;
        img.style.display = 'none'; // Hide until loaded
        imageWrapper.appendChild(img);
        
        this.container.appendChild(imageWrapper);
        
        // Add caption if present
        if (slide.caption) {
            const caption = document.createElement('div');
            caption.className = 'slide-caption';
            caption.textContent = slide.caption;
            this.container.appendChild(caption);
        }
        
        // Don't auto-scale for image slides
        this.container.style.fontSize = '';
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
