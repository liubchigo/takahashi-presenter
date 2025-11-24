// PDF Export functionality for Takahashi Presenter

const PDFExport = {
    /**
     * Export all slides to PDF
     * @param {Array} slides - Array of slide objects
     * @param {Object} settings - Theme and font settings
     */
    exportToPDF(slides, settings = {}) {
        if (!slides || slides.length === 0) {
            alert('No slides to export! Please create some slides first.');
            return;
        }

        // Create a hidden container for all slides
        const printContainer = document.createElement('div');
        printContainer.id = 'pdf-export-container';
        printContainer.className = 'pdf-export-mode';
        
        // Apply theme and font settings
        if (settings.theme) {
            printContainer.classList.add(`theme-${settings.theme}`);
        }
        if (settings.font) {
            printContainer.classList.add(`font-${settings.font}`);
        }

        // Create all slides
        slides.forEach((slide, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'pdf-slide';
            
            if (slide.isTitle) {
                slideDiv.classList.add('title-slide');
            }
            if (slide.isEmphasis) {
                slideDiv.classList.add('emphasis-slide');
            }

            // Add slide content
            const contentDiv = document.createElement('div');
            contentDiv.className = 'pdf-slide-content';
            contentDiv.textContent = slide.content;
            
            // Auto-scale text for PDF
            this.autoScaleForPDF(contentDiv, slide.content);
            
            slideDiv.appendChild(contentDiv);

            // Add slide number footer
            const footer = document.createElement('div');
            footer.className = 'pdf-slide-footer';
            footer.textContent = `${index + 1} / ${slides.length}`;
            slideDiv.appendChild(footer);

            printContainer.appendChild(slideDiv);
        });

        // Add to document
        document.body.appendChild(printContainer);

        // Trigger print dialog
        setTimeout(() => {
            window.print();
            
            // Clean up after print dialog is closed
            const cleanupContainer = () => {
                if (document.body.contains(printContainer)) {
                    document.body.removeChild(printContainer);
                }
            };
            
            // Use afterprint event for reliable cleanup
            window.addEventListener('afterprint', cleanupContainer, { once: true });
            
            // Fallback timeout in case afterprint doesn't fire
            setTimeout(cleanupContainer, 5000);
        }, 100);
    },

    /**
     * Auto-scale text for PDF output
     * @param {HTMLElement} element - Element to scale
     * @param {string} text - Text content
     */
    autoScaleForPDF(element, text) {
        const length = text.length;
        let fontSize;
        
        // Calculate font size based on content length
        if (length <= 5) {
            fontSize = '120pt';
        } else if (length <= 10) {
            fontSize = '96pt';
        } else if (length <= 20) {
            fontSize = '72pt';
        } else if (length <= 40) {
            fontSize = '60pt';
        } else if (length <= 60) {
            fontSize = '48pt';
        } else if (length <= 100) {
            fontSize = '36pt';
        } else {
            fontSize = '24pt';
        }

        element.style.fontSize = fontSize;
    },

    /**
     * Export from editor page
     */
    exportFromEditor() {
        const slideInput = document.getElementById('slideInput');
        const content = slideInput?.value.trim();
        
        if (!content) {
            alert('Please enter some content for your presentation first!');
            return;
        }

        // Get settings
        const themeSelect = document.getElementById('themeSelect');
        const fontSelect = document.getElementById('fontSelect');
        
        const settings = {
            theme: themeSelect?.value || 'dark',
            font: fontSelect?.value || 'sans-serif'
        };

        // Parse slides
        const slides = SlideParser.parse(content);
        
        if (slides.length === 0) {
            alert('No valid slides found! Make sure slides are separated by blank lines or --- markers.');
            return;
        }

        // Export to PDF
        this.exportToPDF(slides, settings);
    },

    /**
     * Export from presenter page
     */
    exportFromPresenter() {
        // Get slides from the renderer
        if (!SlideRenderer || !SlideRenderer.slides || SlideRenderer.slides.length === 0) {
            alert('No slides to export! Please create some slides first.');
            return;
        }

        // Get current theme and font from body classes
        const bodyClasses = document.body.classList;
        const settings = {
            theme: 'dark',
            font: 'sans-serif'
        };

        // Extract theme from classes
        bodyClasses.forEach(className => {
            if (className.startsWith('theme-')) {
                settings.theme = className.replace('theme-', '');
            }
            if (className.startsWith('font-')) {
                settings.font = className.replace('font-', '');
            }
        });

        // Export to PDF
        this.exportToPDF(SlideRenderer.slides, settings);
    }
};
