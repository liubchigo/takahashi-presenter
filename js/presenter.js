// Main presentation controller

document.addEventListener('DOMContentLoaded', async () => {
    // Get DOM elements
    const slideContainer = document.getElementById('currentSlide');
    const progressFill = document.getElementById('progressFill');
    const slideCounter = document.getElementById('slideCounter');
    const timerElement = document.getElementById('timer');
    const percentageElement = document.getElementById('percentage');
    const controlsElement = document.getElementById('controls');
    const helpModal = document.getElementById('helpModal');
    const closeHelpBtn = document.getElementById('closeHelp');
    const overviewMode = document.getElementById('overviewMode');
    const overviewGrid = document.getElementById('overviewGrid');
    const closeOverviewBtn = document.getElementById('closeOverview');
    const exitModal = document.getElementById('exitModal');
    const confirmExitBtn = document.getElementById('confirmExit');
    const cancelExitBtn = document.getElementById('cancelExit');

    // Timer state
    let startTime = Date.now();
    let timerInterval = null;

    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const loadFile = urlParams.get('load');
    
    let content;
    
    // Load content from URL parameter or storage
    if (loadFile) {
        try {
            const response = await fetch(`examples/${loadFile}.txt`);
            if (!response.ok) {
                throw new Error(`Failed to load file: ${loadFile}`);
            }
            content = await response.text();
        } catch (error) {
            console.error('Error loading file:', error);
            alert(`Could not load presentation file: ${loadFile}\nRedirecting to editor...`);
            window.location.href = 'index.html';
            return;
        }
    } else {
        content = StorageManager.getSlideContent();
    }
    
    let settings = StorageManager.getSettings() || { theme: 'dark', font: 'sans-serif', animations: false };

    // Parse slides and extract metadata
    const slides = SlideParser.parse(content);
    const metadata = SlideParser.getMetadata(content);

    // Override settings with metadata if present
    if (metadata.theme) {
        settings.theme = metadata.theme;
    }
    if (metadata.font) {
        settings.font = metadata.font;
    }

    // Apply theme and font
    document.body.classList.add(`theme-${settings.theme}`);
    document.body.classList.add(`font-${settings.font}`);

    if (slides.length === 0) {
        alert('No slides found! Redirecting to editor...');
        window.location.href = 'index.html';
        return;
    }

    // Initialize renderer with animation setting
    SlideRenderer.init(slides, slideContainer, settings.animations === true);
    SlideRenderer.render(0);

    // Update UI
    function updateUI() {
        const info = SlideRenderer.getCurrentInfo();
        
        // Update progress bar
        const progress = (info.current / info.total) * 100;
        progressFill.style.width = `${progress}%`;
        
        // Update slide counter
        slideCounter.textContent = `${info.current} / ${info.total}`;
        
        // Update percentage
        percentageElement.textContent = `${Math.round(progress)}%`;
    }

    // Update timer display
    function updateTimer() {
        const elapsed = Date.now() - startTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        timerElement.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Start timer
    function startTimer() {
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Stop timer
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    // Toggle elements
    let showProgress = true;
    let showCounter = true;
    let showTimer = true;
    let showPercentage = true;

    function toggleProgress() {
        showProgress = !showProgress;
        document.querySelector('.progress-bar').style.display = showProgress ? 'block' : 'none';
    }

    function toggleCounter() {
        showCounter = !showCounter;
        slideCounter.style.display = showCounter ? 'block' : 'none';
    }

    function toggleTimer() {
        showTimer = !showTimer;
        timerElement.style.display = showTimer ? 'block' : 'none';
    }

    function togglePercentage() {
        showPercentage = !showPercentage;
        percentageElement.style.display = showPercentage ? 'block' : 'none';
    }

    function toggleAllControls() {
        const newState = !showProgress;
        showProgress = newState;
        showCounter = newState;
        showTimer = newState;
        showPercentage = newState;
        
        document.querySelector('.progress-bar').style.display = newState ? 'block' : 'none';
        slideCounter.style.display = newState ? 'block' : 'none';
        timerElement.style.display = newState ? 'block' : 'none';
        percentageElement.style.display = newState ? 'block' : 'none';
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error('Failed to enter fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    function toggleHelp() {
        helpModal.classList.toggle('hidden');
    }

    function toggleOverview() {
        overviewMode.classList.toggle('hidden');
        
        if (!overviewMode.classList.contains('hidden')) {
            // Build overview grid
            buildOverviewGrid();
        }
    }

    function toggleAnimations() {
        const enabled = SlideRenderer.toggleAnimations();
        // Optional: show a brief notification
        console.log(`Animations ${enabled ? 'enabled' : 'disabled'}`);
    }

    function buildOverviewGrid() {
        overviewGrid.innerHTML = '';
        
        slides.forEach((slide, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'overview-slide';
            if (index === SlideRenderer.currentSlide) {
                slideDiv.classList.add('active');
            }
            
            const number = document.createElement('div');
            number.className = 'overview-slide-number';
            number.textContent = index + 1;
            
            const content = document.createElement('div');
            content.textContent = slide.content.substring(0, 50) + (slide.content.length > 50 ? '...' : '');
            
            slideDiv.appendChild(number);
            slideDiv.appendChild(content);
            
            slideDiv.addEventListener('click', () => {
                SlideRenderer.render(index);
                updateUI();
                toggleOverview();
            });
            
            overviewGrid.appendChild(slideDiv);
        });
    }

    function exitPresentation() {
        exitModal.classList.remove('hidden');
    }

    async function exportToPDF() {
        try {
            await PDFExporter.exportToPDF(slides, settings, 'presentation.pdf');
            console.log('PDF exported successfully');
        } catch (error) {
            console.error('PDF export error:', error);
            alert('Failed to export PDF: ' + error.message);
        }
    }

    // Initialize navigation
    NavigationController.init({
        onNext: () => {
            SlideRenderer.next();
            updateUI();
        },
        onPrevious: () => {
            SlideRenderer.previous();
            updateUI();
        },
        onFirst: () => {
            SlideRenderer.first();
            updateUI();
        },
        onLast: () => {
            SlideRenderer.last();
            updateUI();
        },
        onExit: exitPresentation,
        onToggleFullscreen: toggleFullscreen,
        onToggleProgress: toggleProgress,
        onToggleCounter: toggleCounter,
        onToggleTimer: toggleTimer,
        onTogglePercentage: togglePercentage,
        onToggleAllControls: toggleAllControls,
        onResetTimer: () => {
            startTime = Date.now();
            updateTimer();
        },
        onToggleHelp: toggleHelp,
        onToggleOverview: toggleOverview,
        onToggleAnimations: toggleAnimations,
        onExportPDF: exportToPDF
    });

    // Close help modal
    closeHelpBtn.addEventListener('click', () => {
        helpModal.classList.add('hidden');
    });

    // Close overview mode
    closeOverviewBtn.addEventListener('click', () => {
        overviewMode.classList.add('hidden');
    });

    // Exit modal handlers
    confirmExitBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    cancelExitBtn.addEventListener('click', () => {
        exitModal.classList.add('hidden');
    });

    // Initial UI update
    updateUI();

    // Start the timer
    startTimer();

    // Auto-enter fullscreen (optional)
    // Uncomment if you want to automatically enter fullscreen
    // toggleFullscreen();
});
