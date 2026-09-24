import { describe, it, expect, beforeEach, vi } from 'vitest';
const StorageManager = require('../../js/storage.js');

describe('StorageManager', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    describe('saveSlideContent() / getSlideContent()', () => {
        it('saves and retrieves slide content', () => {
            StorageManager.saveSlideContent('Hello World');
            expect(StorageManager.getSlideContent()).toBe('Hello World');
        });

        it('returns empty string when nothing is saved', () => {
            expect(StorageManager.getSlideContent()).toBe('');
        });

        it('overwrites previously saved content', () => {
            StorageManager.saveSlideContent('First');
            StorageManager.saveSlideContent('Second');
            expect(StorageManager.getSlideContent()).toBe('Second');
        });

        it('saves multi-line content correctly', () => {
            const content = 'Slide 1\n\nSlide 2\n\nSlide 3';
            StorageManager.saveSlideContent(content);
            expect(StorageManager.getSlideContent()).toBe(content);
        });

        it('handles empty string gracefully', () => {
            StorageManager.saveSlideContent('');
            expect(StorageManager.getSlideContent()).toBe('');
        });
    });

    describe('saveSettings() / getSettings()', () => {
        it('saves and retrieves settings object', () => {
            const settings = { theme: 'dark', font: 'serif', animations: true };
            StorageManager.saveSettings(settings);
            expect(StorageManager.getSettings()).toEqual(settings);
        });

        it('returns null when no settings are saved', () => {
            expect(StorageManager.getSettings()).toBeNull();
        });

        it('overwrites previously saved settings', () => {
            StorageManager.saveSettings({ theme: 'light' });
            StorageManager.saveSettings({ theme: 'dark' });
            expect(StorageManager.getSettings()).toEqual({ theme: 'dark' });
        });

        it('saves nested settings correctly', () => {
            const settings = { theme: 'ocean', font: 'monospace', animations: false };
            StorageManager.saveSettings(settings);
            const retrieved = StorageManager.getSettings();
            expect(retrieved.theme).toBe('ocean');
            expect(retrieved.font).toBe('monospace');
            expect(retrieved.animations).toBe(false);
        });
    });

    describe('clearAll()', () => {
        it('clears all stored data', () => {
            StorageManager.saveSlideContent('Some content');
            StorageManager.saveSettings({ theme: 'dark' });
            StorageManager.clearAll();
            expect(StorageManager.getSlideContent()).toBe('');
            expect(StorageManager.getSettings()).toBeNull();
        });

        it('does not throw when storage is already empty', () => {
            expect(() => StorageManager.clearAll()).not.toThrow();
        });
    });

    describe('error handling', () => {
        it('getSlideContent returns empty string when localStorage throws', () => {
            vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
                throw new Error('Storage error');
            });
            expect(StorageManager.getSlideContent()).toBe('');
        });

        it('getSettings returns null when localStorage throws', () => {
            vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
                throw new Error('Storage error');
            });
            expect(StorageManager.getSettings()).toBeNull();
        });

        it('saveSlideContent does not throw when localStorage throws', () => {
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
                throw new Error('Storage quota exceeded');
            });
            expect(() => StorageManager.saveSlideContent('test')).not.toThrow();
        });

        it('saveSettings does not throw when localStorage throws', () => {
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
                throw new Error('Storage quota exceeded');
            });
            expect(() => StorageManager.saveSettings({ theme: 'dark' })).not.toThrow();
        });

        it('clearAll does not throw when localStorage throws', () => {
            vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
                throw new Error('Storage error');
            });
            expect(() => StorageManager.clearAll()).not.toThrow();
        });
    });

    describe('KEYS constants', () => {
        it('has SLIDE_CONTENT key defined', () => {
            expect(StorageManager.KEYS.SLIDE_CONTENT).toBeDefined();
        });

        it('has SETTINGS key defined', () => {
            expect(StorageManager.KEYS.SETTINGS).toBeDefined();
        });

        it('uses correct keys in localStorage', () => {
            StorageManager.saveSlideContent('test');
            expect(localStorage.getItem(StorageManager.KEYS.SLIDE_CONTENT)).toBe('test');
        });
    });
});
