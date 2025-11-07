// LocalStorage management

const StorageManager = {
    KEYS: {
        SLIDE_CONTENT: 'takahashi_slides',
        SETTINGS: 'takahashi_settings',
        RECENT: 'takahashi_recent'
    },

    // Save slide content
    saveSlideContent(content) {
        try {
            localStorage.setItem(this.KEYS.SLIDE_CONTENT, content);
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    },

    // Get slide content
    getSlideContent() {
        try {
            return localStorage.getItem(this.KEYS.SLIDE_CONTENT) || '';
        } catch (e) {
            console.error('Failed to read from localStorage:', e);
            return '';
        }
    },

    // Save settings (theme, font, etc.)
    saveSettings(settings) {
        try {
            localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    },

    // Get settings
    getSettings() {
        try {
            const settings = localStorage.getItem(this.KEYS.SETTINGS);
            return settings ? JSON.parse(settings) : null;
        } catch (e) {
            console.error('Failed to read settings:', e);
            return null;
        }
    },

    // Clear all data
    clearAll() {
        try {
            Object.values(this.KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
        } catch (e) {
            console.error('Failed to clear localStorage:', e);
        }
    }
};
