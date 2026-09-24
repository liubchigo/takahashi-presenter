// PDF Export functionality for Takahashi Presenter

const PDFExporter = {
    /**
     * Export slides to PDF
     * @param {Array} slides - Array of slide objects from parser
     * @param {Object} settings - Theme and font settings
     * @param {string} filename - Name for the PDF file
     */
    async exportToPDF(slides, settings = {}, filename = 'presentation.pdf') {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            throw new Error('jsPDF library not loaded');
        }

        const { jsPDF } = window.jspdf;
        
        // Create PDF in landscape mode (16:9 ratio)
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [297, 167] // 16:9 aspect ratio (A4 width x calculated height)
        });

        // Get theme colors
        const theme = settings.theme || 'dark';
        const colors = this.getThemeColors(theme);
        
        // Set font
        const fontFamily = this.mapFontFamily(settings.font || 'sans-serif');

        // Process each slide
        for (let i = 0; i < slides.length; i++) {
            if (i > 0) {
                pdf.addPage();
            }

            const slide = slides[i];
            
            // Set background color
            pdf.setFillColor(colors.background.r, colors.background.g, colors.background.b);
            pdf.rect(0, 0, 297, 167, 'F');
            
            // Set text color
            pdf.setTextColor(colors.text.r, colors.text.g, colors.text.b);
            
            // Calculate font size based on text length (similar to renderer.js)
            const fontSize = this.calculateFontSize(slide.content);
            pdf.setFontSize(fontSize);
            
            // Set font style for title slides
            if (slide.isTitle) {
                pdf.setFont(fontFamily, 'bold');
            } else {
                pdf.setFont(fontFamily, 'normal');
            }
            
            // Center text on page
            const text = slide.content;
            const pageWidth = 297;
            const pageHeight = 167;
            
            // Split text into lines for better wrapping
            const maxWidth = pageWidth * 0.9; // 90% of page width
            const lines = pdf.splitTextToSize(text, maxWidth);
            
            // Calculate vertical position to center text
            const lineHeight = fontSize * 0.4; // Line height factor
            const totalHeight = lines.length * lineHeight;
            const startY = (pageHeight - totalHeight) / 2 + lineHeight;
            
            // Draw each line centered
            lines.forEach((line, index) => {
                const textWidth = pdf.getTextWidth(line);
                const x = (pageWidth - textWidth) / 2;
                const y = startY + (index * lineHeight);
                pdf.text(line, x, y);
            });
        }

        // Save the PDF
        pdf.save(filename);
        
        return true;
    },

    /**
     * Calculate appropriate font size based on text length
     * @param {string} text - Slide text content
     * @returns {number} Font size in points
     */
    calculateFontSize(text) {
        const length = text.length;
        
        if (length <= 5) {
            return 120;
        } else if (length <= 10) {
            return 90;
        } else if (length <= 20) {
            return 70;
        } else if (length <= 40) {
            return 50;
        } else if (length <= 60) {
            return 40;
        } else if (length <= 100) {
            return 30;
        } else {
            return 20;
        }
    },

    /**
     * Get RGB color values for a theme
     * @param {string} theme - Theme name
     * @returns {Object} Colors object with background and text RGB values
     */
    getThemeColors(theme) {
        const themes = {
            dark: {
                background: { r: 18, g: 18, b: 18 },
                text: { r: 255, g: 255, b: 255 }
            },
            light: {
                background: { r: 255, g: 255, b: 255 },
                text: { r: 18, g: 18, b: 18 }
            },
            blue: {
                background: { r: 30, g: 50, b: 100 },
                text: { r: 255, g: 255, b: 255 }
            },
            green: {
                background: { r: 20, g: 60, b: 40 },
                text: { r: 255, g: 255, b: 255 }
            },
            purple: {
                background: { r: 60, g: 30, b: 80 },
                text: { r: 255, g: 255, b: 255 }
            },
            red: {
                background: { r: 100, g: 20, b: 30 },
                text: { r: 255, g: 255, b: 255 }
            },
            ocean: {
                background: { r: 15, g: 76, b: 117 },
                text: { r: 255, g: 255, b: 255 }
            },
            sunset: {
                background: { r: 150, g: 50, b: 30 },
                text: { r: 255, g: 255, b: 255 }
            },
            monochrome: {
                background: { r: 0, g: 0, b: 0 },
                text: { r: 255, g: 255, b: 255 }
            }
        };

        return themes[theme] || themes.dark;
    },

    /**
     * Map font family to jsPDF font names
     * @param {string} font - Font family name
     * @returns {string} jsPDF font name
     */
    mapFontFamily(font) {
        const fontMap = {
            'sans-serif': 'helvetica',
            'serif': 'times',
            'monospace': 'courier'
        };

        return fontMap[font] || 'helvetica';
    }
};
