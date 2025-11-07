// Handle keyboard navigation and controls

const NavigationController = {
    onNext: null,
    onPrevious: null,
    onFirst: null,
    onLast: null,
    onExit: null,
    onToggleFullscreen: null,
    onToggleProgress: null,
    onToggleCounter: null,
    onToggleTimer: null,
    onTogglePercentage: null,
    onToggleAllControls: null,
    onResetTimer: null,
    onToggleHelp: null,
    onToggleOverview: null,
    onToggleAnimations: null,

    /**
     * Initialize navigation
     * @param {Object} callbacks - Callback functions for navigation events
     */
    init(callbacks) {
        Object.assign(this, callbacks);
        this.attachEventListeners();
    },

    /**
     * Attach keyboard event listeners
     */
    attachEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    },

    /**
     * Handle keyboard press events
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyPress(e) {
        // Don't handle ESC if modal or overview is open
        if (e.key === 'Escape') {
            const helpModal = document.getElementById('helpModal');
            const overviewMode = document.getElementById('overviewMode');
            const exitModal = document.getElementById('exitModal');
            
            // If helpModal, overviewMode, or exitModal is open, ignore ESC
            if ((helpModal && !helpModal.classList.contains('hidden')) ||
                (overviewMode && !overviewMode.classList.contains('hidden')) ||
                (exitModal && !exitModal.classList.contains('hidden'))) {
                e.preventDefault();
                // Do nothing, wait for user to select an option or click close
                return;
            }
            
            // Only exit if no modals are open
            e.preventDefault();
            if (this.onExit) this.onExit();
            return;
        }

        switch(e.key) {
            // Next slide
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
            case 'PageDown':
                e.preventDefault();
                if (this.onNext) this.onNext();
                break;

            // Previous slide
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                if (this.onPrevious) this.onPrevious();
                break;

            // First slide
            case 'Home':
                e.preventDefault();
                if (this.onFirst) this.onFirst();
                break;

            // Last slide
            case 'End':
                e.preventDefault();
                if (this.onLast) this.onLast();
                break;

            // Toggle fullscreen
            case 'f':
            case 'F':
                e.preventDefault();
                if (this.onToggleFullscreen) this.onToggleFullscreen();
                break;

            // Toggle progress bar
            case 'p':
            case 'P':
                e.preventDefault();
                if (this.onToggleProgress) this.onToggleProgress();
                break;

            // Toggle counter
            case 'c':
            case 'C':
                e.preventDefault();
                if (this.onToggleCounter) this.onToggleCounter();
                break;

            // Toggle timer
            case 't':
            case 'T':
                e.preventDefault();
                if (this.onToggleTimer) this.onToggleTimer();
                break;

            // Toggle percentage
            case '%':
                e.preventDefault();
                if (this.onTogglePercentage) this.onTogglePercentage();
                break;

            // Toggle all controls
            case 'h':
            case 'H':
                e.preventDefault();
                if (this.onToggleAllControls) this.onToggleAllControls();
                break;

            // Reset timer
            case 'r':
            case 'R':
                e.preventDefault();
                if (this.onResetTimer) this.onResetTimer();
                break;

            // Toggle help
            case '?':
                e.preventDefault();
                if (this.onToggleHelp) this.onToggleHelp();
                break;

            // Toggle overview
            case 'o':
            case 'O':
                e.preventDefault();
                if (this.onToggleOverview) this.onToggleOverview();
                break;

            // Toggle animations
            case 'a':
            case 'A':
                e.preventDefault();
                if (this.onToggleAnimations) this.onToggleAnimations();
                break;
        }
    },

    /**
     * Handle swipe gestures
     * @param {number} startX - Touch start X position
     * @param {number} endX - Touch end X position
     */
    handleSwipe(startX, endX) {
        const threshold = 50; // Minimum swipe distance
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left - next slide
                if (this.onNext) this.onNext();
            } else {
                // Swipe right - previous slide
                if (this.onPrevious) this.onPrevious();
            }
        }
    }
};
