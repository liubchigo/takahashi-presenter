import { describe, it, expect, beforeEach, vi } from 'vitest';
const NavigationController = require('../../js/navigation.js');

function makeKey(key, options = {}) {
    return new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...options });
}

function makeClick(clientX, target = document.body) {
    return {
        type: 'click',
        clientX,
        target,
        preventDefault: vi.fn(),
    };
}

describe('NavigationController', () => {
    let callbacks;

    beforeEach(() => {
        // Reset all callbacks
        callbacks = {
            onNext: vi.fn(),
            onPrevious: vi.fn(),
            onFirst: vi.fn(),
            onLast: vi.fn(),
            onExit: vi.fn(),
            onToggleFullscreen: vi.fn(),
            onToggleProgress: vi.fn(),
            onToggleCounter: vi.fn(),
            onToggleTimer: vi.fn(),
            onTogglePercentage: vi.fn(),
            onToggleAllControls: vi.fn(),
            onResetTimer: vi.fn(),
            onToggleHelp: vi.fn(),
            onToggleOverview: vi.fn(),
            onToggleAnimations: vi.fn(),
        };
        Object.assign(NavigationController, callbacks);

        // Clean up any leftover modal elements from previous tests
        ['helpModal', 'overviewMode', 'exitModal'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
    });

    describe('handleKeyPress()', () => {
        it('calls onNext for ArrowRight', () => {
            NavigationController.handleKeyPress(makeKey('ArrowRight'));
            expect(callbacks.onNext).toHaveBeenCalledOnce();
        });

        it('calls onNext for ArrowDown', () => {
            NavigationController.handleKeyPress(makeKey('ArrowDown'));
            expect(callbacks.onNext).toHaveBeenCalledOnce();
        });

        it('calls onNext for Space', () => {
            NavigationController.handleKeyPress(makeKey(' '));
            expect(callbacks.onNext).toHaveBeenCalledOnce();
        });

        it('calls onNext for PageDown', () => {
            NavigationController.handleKeyPress(makeKey('PageDown'));
            expect(callbacks.onNext).toHaveBeenCalledOnce();
        });

        it('calls onPrevious for ArrowLeft', () => {
            NavigationController.handleKeyPress(makeKey('ArrowLeft'));
            expect(callbacks.onPrevious).toHaveBeenCalledOnce();
        });

        it('calls onPrevious for ArrowUp', () => {
            NavigationController.handleKeyPress(makeKey('ArrowUp'));
            expect(callbacks.onPrevious).toHaveBeenCalledOnce();
        });

        it('calls onPrevious for PageUp', () => {
            NavigationController.handleKeyPress(makeKey('PageUp'));
            expect(callbacks.onPrevious).toHaveBeenCalledOnce();
        });

        it('calls onFirst for Home', () => {
            NavigationController.handleKeyPress(makeKey('Home'));
            expect(callbacks.onFirst).toHaveBeenCalledOnce();
        });

        it('calls onLast for End', () => {
            NavigationController.handleKeyPress(makeKey('End'));
            expect(callbacks.onLast).toHaveBeenCalledOnce();
        });

        it('calls onToggleFullscreen for F key', () => {
            NavigationController.handleKeyPress(makeKey('f'));
            expect(callbacks.onToggleFullscreen).toHaveBeenCalledOnce();
        });

        it('calls onToggleFullscreen for uppercase F key', () => {
            NavigationController.handleKeyPress(makeKey('F'));
            expect(callbacks.onToggleFullscreen).toHaveBeenCalledOnce();
        });

        it('calls onToggleProgress for P key', () => {
            NavigationController.handleKeyPress(makeKey('p'));
            expect(callbacks.onToggleProgress).toHaveBeenCalledOnce();
        });

        it('calls onToggleCounter for C key', () => {
            NavigationController.handleKeyPress(makeKey('c'));
            expect(callbacks.onToggleCounter).toHaveBeenCalledOnce();
        });

        it('calls onToggleTimer for T key', () => {
            NavigationController.handleKeyPress(makeKey('t'));
            expect(callbacks.onToggleTimer).toHaveBeenCalledOnce();
        });

        it('calls onTogglePercentage for % key', () => {
            NavigationController.handleKeyPress(makeKey('%'));
            expect(callbacks.onTogglePercentage).toHaveBeenCalledOnce();
        });

        it('calls onToggleAllControls for H key', () => {
            NavigationController.handleKeyPress(makeKey('h'));
            expect(callbacks.onToggleAllControls).toHaveBeenCalledOnce();
        });

        it('calls onResetTimer for R key', () => {
            NavigationController.handleKeyPress(makeKey('r'));
            expect(callbacks.onResetTimer).toHaveBeenCalledOnce();
        });

        it('calls onToggleHelp for ? key', () => {
            NavigationController.handleKeyPress(makeKey('?'));
            expect(callbacks.onToggleHelp).toHaveBeenCalledOnce();
        });

        it('calls onToggleOverview for O key', () => {
            NavigationController.handleKeyPress(makeKey('o'));
            expect(callbacks.onToggleOverview).toHaveBeenCalledOnce();
        });

        it('calls onToggleAnimations for A key', () => {
            NavigationController.handleKeyPress(makeKey('a'));
            expect(callbacks.onToggleAnimations).toHaveBeenCalledOnce();
        });

        it('calls onExit for Escape when no modals are open', () => {
            NavigationController.handleKeyPress(makeKey('Escape'));
            expect(callbacks.onExit).toHaveBeenCalledOnce();
        });

        it('does NOT call onExit when helpModal is open', () => {
            const modal = document.createElement('div');
            modal.id = 'helpModal';
            document.body.appendChild(modal);

            NavigationController.handleKeyPress(makeKey('Escape'));
            expect(callbacks.onExit).not.toHaveBeenCalled();
            modal.remove();
        });

        it('does NOT call onExit when overviewMode is open', () => {
            const modal = document.createElement('div');
            modal.id = 'overviewMode';
            document.body.appendChild(modal);

            NavigationController.handleKeyPress(makeKey('Escape'));
            expect(callbacks.onExit).not.toHaveBeenCalled();
            modal.remove();
        });

        it('does NOT call onExit when exitModal is open', () => {
            const modal = document.createElement('div');
            modal.id = 'exitModal';
            document.body.appendChild(modal);

            NavigationController.handleKeyPress(makeKey('Escape'));
            expect(callbacks.onExit).not.toHaveBeenCalled();
            modal.remove();
        });

        it('calls onExit when modals are present but have hidden class', () => {
            const modal = document.createElement('div');
            modal.id = 'helpModal';
            modal.classList.add('hidden');
            document.body.appendChild(modal);

            NavigationController.handleKeyPress(makeKey('Escape'));
            expect(callbacks.onExit).toHaveBeenCalledOnce();
            modal.remove();
        });

        it('does not crash when callbacks are null', () => {
            NavigationController.onNext = null;
            expect(() => NavigationController.handleKeyPress(makeKey('ArrowRight'))).not.toThrow();
        });
    });

    describe('handleTap()', () => {
        beforeEach(() => {
            // Set a fixed window inner width for predictable testing
            Object.defineProperty(window, 'innerWidth', { value: 900, writable: true });
        });

        it('calls onPrevious when tapping the left third of the screen', () => {
            const event = makeClick(100); // 100 < 300 (left third of 900px)
            NavigationController.handleTap(event);
            expect(callbacks.onPrevious).toHaveBeenCalledOnce();
        });

        it('calls onNext when tapping the right third of the screen', () => {
            const event = makeClick(800); // 800 > 600 (right third of 900px)
            NavigationController.handleTap(event);
            expect(callbacks.onNext).toHaveBeenCalledOnce();
        });

        it('calls neither onNext nor onPrevious when tapping the middle third', () => {
            const event = makeClick(450); // 450 is in the middle third (300-600)
            NavigationController.handleTap(event);
            expect(callbacks.onNext).not.toHaveBeenCalled();
            expect(callbacks.onPrevious).not.toHaveBeenCalled();
        });

        it('does not navigate when helpModal is open', () => {
            const modal = document.createElement('div');
            modal.id = 'helpModal';
            document.body.appendChild(modal);

            NavigationController.handleTap(makeClick(800));
            expect(callbacks.onNext).not.toHaveBeenCalled();
            modal.remove();
        });

        it('does not navigate when overviewMode is open', () => {
            const modal = document.createElement('div');
            modal.id = 'overviewMode';
            document.body.appendChild(modal);

            NavigationController.handleTap(makeClick(800));
            expect(callbacks.onNext).not.toHaveBeenCalled();
            modal.remove();
        });

        it('does not navigate when tapping on a button element', () => {
            const button = document.createElement('button');
            document.body.appendChild(button);

            const event = makeClick(800, button);
            NavigationController.handleTap(event);
            expect(callbacks.onNext).not.toHaveBeenCalled();
            button.remove();
        });

        it('handles touch events with changedTouches', () => {
            const touchEvent = {
                type: 'touchend',
                changedTouches: [{ clientX: 800 }],
                target: document.body,
                preventDefault: vi.fn(),
            };
            NavigationController.handleTap(touchEvent);
            expect(callbacks.onNext).toHaveBeenCalledOnce();
        });
    });
});
