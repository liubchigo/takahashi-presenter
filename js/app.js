// Main application logic for the editor page

document.addEventListener('DOMContentLoaded', () => {
    const slideInput = document.getElementById('slideInput');
    const startButton = document.getElementById('startPresentation');
    const exampleSelect = document.getElementById('exampleSelect');
    const clearBtn = document.getElementById('clearBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const fileInput = document.getElementById('fileInput');
    const themeSelect = document.getElementById('themeSelect');
    const fontSelect = document.getElementById('fontSelect');
    const animationToggle = document.getElementById('animationToggle');
    const dropZone = document.getElementById('dropZone');
    const dropOverlay = document.getElementById('dropOverlay');

    // Example presentations
    const examples = {
        'liuba-story': 'examples/liuba-story.txt'
    };

    // Load saved content from localStorage
    const savedContent = StorageManager.getSlideContent();
    if (savedContent) {
        slideInput.value = savedContent;
    }

    // Auto-save content
    slideInput.addEventListener('input', () => {
        StorageManager.saveSlideContent(slideInput.value);
        validateContent();
    });

    // Validate content and show feedback
    function validateContent() {
        const content = slideInput.value.trim();
        const feedbackDiv = document.getElementById('validationFeedback');
        
        if (!content) {
            feedbackDiv.innerHTML = '';
            return;
        }

        const validation = SlideParser.validate(content);
        
        if (validation.isValid) {
            feedbackDiv.innerHTML = `
                <div class="feedback-success">
                    ✓ ${validation.slideCount} slide${validation.slideCount !== 1 ? 's' : ''} detected
                </div>
            `;
            
            if (validation.warnings.length > 0) {
                const warningsHtml = validation.warnings
                    .map(w => `<li>${w}</li>`)
                    .join('');
                feedbackDiv.innerHTML += `
                    <div class="feedback-warning">
                        <strong>⚠ Warnings:</strong>
                        <ul>${warningsHtml}</ul>
                    </div>
                `;
            }
        } else {
            const errorsHtml = validation.errors
                .map(e => `<li>${e}</li>`)
                .join('');
            feedbackDiv.innerHTML = `
                <div class="feedback-error">
                    <strong>✗ Errors:</strong>
                    <ul>${errorsHtml}</ul>
                </div>
            `;
        }
    }

    // Initial validation
    if (slideInput.value.trim()) {
        validateContent();
    }

    // Load example presentation
    exampleSelect.addEventListener('change', async (e) => {
        const exampleKey = e.target.value;
        
        if (!exampleKey) return;

        const examplePath = examples[exampleKey];
        
        if (!examplePath) {
            console.error('Example not found:', exampleKey);
            alert('Example not found. Available examples: ' + Object.keys(examples).join(', '));
            e.target.value = '';
            return;
        }

        try {
            const response = await fetch(examplePath);
            if (!response.ok) throw new Error('Failed to load example');
            
            const content = await response.text();
            slideInput.value = content;
            StorageManager.saveSlideContent(content);
            validateContent();
            
            // Reset select
            e.target.value = '';
        } catch (error) {
            console.error('Error loading example:', error);
            alert('Failed to load example. Please try again.');
        }
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
        if (confirm('Clear all content?')) {
            slideInput.value = '';
            StorageManager.saveSlideContent('');
        }
    });

    // File upload
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            loadFile(file);
        }
    });

    // Download presentation
    downloadBtn.addEventListener('click', () => {
        const content = slideInput.value;
        if (!content.trim()) {
            alert('Nothing to download!');
            return;
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'presentation.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Drag and drop functionality
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
        dropOverlay.classList.remove('hidden');
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        dropOverlay.classList.add('hidden');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        dropOverlay.classList.add('hidden');

        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.txt') || file.name.endsWith('.md'))) {
            loadFile(file);
        } else {
            alert('Please drop a .txt or .md file');
        }
    });

    // Helper function to load file
    function loadFile(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            slideInput.value = event.target.result;
            StorageManager.saveSlideContent(event.target.result);
            validateContent();
        };
        reader.readAsText(file);
    }

    // Start presentation
    startButton.addEventListener('click', () => {
        const content = slideInput.value.trim();
        
        if (!content) {
            alert('Please enter some content for your presentation!');
            return;
        }

        // Save settings
        const settings = {
            theme: themeSelect.value,
            font: fontSelect.value,
            animations: animationToggle.checked
        };
        StorageManager.saveSettings(settings);

        // Open presenter window
        window.location.href = 'presenter.html';
    });

    // Load saved settings
    const savedSettings = StorageManager.getSettings();
    if (savedSettings) {
        themeSelect.value = savedSettings.theme || 'dark';
        fontSelect.value = savedSettings.font || 'sans-serif';
        animationToggle.checked = savedSettings.animations === true; // Default to false
    }

    // Update theme preview
    function updateThemePreview() {
        const preview = document.getElementById('themePreview');
        preview.setAttribute('data-theme', themeSelect.value);
        preview.setAttribute('data-font', fontSelect.value);
    }

    // Initial preview update
    updateThemePreview();

    // Update preview on change
    themeSelect.addEventListener('change', updateThemePreview);
    fontSelect.addEventListener('change', updateThemePreview);
});
