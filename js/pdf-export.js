// PDF Export module - uses browser's native print API

const PDFExport = {
    // Theme background and text color configurations
    themes: {
        dark:       { background: '#000000', color: '#ffffff' },
        light:      { background: '#ffffff', color: '#000000' },
        blue:       { background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: '#ffffff' },
        green:      { background: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)', color: '#ffffff' },
        purple:     { background: 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)', color: '#ffffff' },
        red:        { background: 'linear-gradient(135deg, #991b1b 0%, #ef4444 100%)', color: '#ffffff' },
        ocean:      { background: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)', color: '#ffffff' },
        sunset:     { background: 'linear-gradient(135deg, #7c2d12 0%, #f97316 50%, #fbbf24 100%)', color: '#ffffff' },
        monochrome: { background: '#374151', color: '#f9fafb' }
    },

    // CSS font-family values matching themes.css
    fonts: {
        'sans-serif': "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
        'serif':      "Georgia, 'Times New Roman', Times, serif",
        'monospace':  "'Courier New', Courier, monospace"
    },

    /**
     * Determine font size from content length, mirroring renderer.js autoScale logic.
     * Uses vw units so text scales proportionally when printed landscape.
     * @param {number} length - Character count of slide text
     * @returns {string} CSS font-size value
     */
    getFontSize(length) {
        if (length <= 5)   return '20vw';
        if (length <= 10)  return '15vw';
        if (length <= 20)  return '12vw';
        if (length <= 40)  return '10vw';
        if (length <= 60)  return '8vw';
        if (length <= 100) return '6vw';
        return '4vw';
    },

    /**
     * Escape a string for safe insertion into HTML text content.
     * @param {string} text
     * @returns {string}
     */
    escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    /**
     * Build the HTML string for a single slide page.
     * @param {Object} slide - Slide object from SlideParser
     * @param {boolean} isLast - Whether this is the last slide
     * @param {Object} themeConfig - { background, color }
     * @returns {string} HTML markup
     */
    buildSlideHtml(slide, isLast, themeConfig) {
        const fontSize = this.getFontSize(slide.content.length);
        const pageBreak = isLast ? '' : 'page-break-after: always;';
        const classes = [
            'slide-page',
            slide.isTitle     ? 'title-slide'    : '',
            slide.isEmphasis  ? 'emphasis-slide'  : ''
        ].filter(Boolean).join(' ');

        // Preserve newlines within a slide as line breaks
        const contentHtml = this.escapeHtml(slide.content).replace(/\n/g, '<br>');

        return `<div class="${classes}" style="font-size:${fontSize};${pageBreak}">` +
               `<div class="slide-content">${contentHtml}</div>` +
               `</div>`;
    },

    /**
     * Open a new window containing all slides formatted for printing and
     * trigger the browser's print dialog automatically.
     *
     * @param {string} content  - Raw presentation text
     * @param {Object} settings - { theme, font }
     */
    export(content, settings) {
        const slides = SlideParser.parse(content);

        if (!slides || slides.length === 0) {
            alert('No slides to export!');
            return;
        }

        const theme  = (settings && settings.theme)  || 'dark';
        const font   = (settings && settings.font)   || 'sans-serif';
        const themeConfig  = this.themes[theme]  || this.themes.dark;
        const fontFamily   = this.fonts[font]    || this.fonts['sans-serif'];

        const slidesHtml = slides
            .map((slide, idx) => this.buildSlideHtml(slide, idx === slides.length - 1, themeConfig))
            .join('\n');

        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Presentation Export</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

@page { size: landscape; margin: 0; }

body {
    font-family: ${fontFamily};
    background: ${themeConfig.background};
    color: ${themeConfig.color};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}

.slide-page {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${themeConfig.background};
    color: ${themeConfig.color};
    text-align: center;
    padding: 5vw;
    font-weight: bold;
    line-height: 1.2;
    word-wrap: break-word;
}

.slide-content {
    max-width: 90%;
    white-space: pre-wrap;
}

.title-slide .slide-content {
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 0.5vw solid currentColor;
    padding-bottom: 3vw;
}

.emphasis-slide {
    font-style: italic;
}

@media print {
    .slide-page {
        width: 100%;
        height: 100vh;
    }
}
</style>
</head>
<body>
${slidesHtml}
<script>
window.addEventListener('load', function () {
    window.print();
});
<\/script>
</body>
</html>`;

        // Use a Blob URL so we can open with noopener (safer than document.write)
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        const printWindow = window.open(blobUrl, '_blank', 'noopener,noreferrer,width=1280,height=800');

        if (!printWindow) {
            URL.revokeObjectURL(blobUrl);
            alert('Pop-up blocked. Please allow pop-ups for this site to export as PDF.');
            return;
        }

        // Revoke the object URL after a short delay to free memory
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    }
};
