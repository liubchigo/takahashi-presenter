import { describe, it, expect, beforeEach } from 'vitest';
const SlideRenderer = require('../../js/renderer.js');

function makeContainer() {
    const el = document.createElement('div');
    document.body.appendChild(el);
    return el;
}

function makeSlides(contents) {
    return contents.map((content, i) => ({ id: i + 1, content }));
}

describe('SlideRenderer', () => {
    let container;

    beforeEach(() => {
        container = makeContainer();
        // Reset renderer state before each test
        SlideRenderer.currentSlide = 0;
        SlideRenderer.slides = [];
        SlideRenderer.container = null;
        SlideRenderer.animationsEnabled = true;
    });

    describe('init()', () => {
        it('initializes renderer with slides and container', () => {
            const slides = makeSlides(['Hello', 'World']);
            SlideRenderer.init(slides, container, false);
            expect(SlideRenderer.slides).toEqual(slides);
            expect(SlideRenderer.container).toBe(container);
            expect(SlideRenderer.currentSlide).toBe(0);
        });

        it('sets animationsEnabled correctly', () => {
            SlideRenderer.init(makeSlides(['Test']), container, false);
            expect(SlideRenderer.animationsEnabled).toBe(false);
        });

        it('defaults animations to true when not specified', () => {
            SlideRenderer.init(makeSlides(['Test']), container);
            expect(SlideRenderer.animationsEnabled).toBe(true);
        });
    });

    describe('render()', () => {
        it('sets container text to slide content', () => {
            const slides = makeSlides(['Hello World']);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(0);
            expect(container.textContent).toBe('Hello World');
        });

        it('applies title-slide class for title slides', () => {
            const slides = [{ id: 1, content: 'Welcome', isTitle: true }];
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(0);
            expect(container.classList.contains('title-slide')).toBe(true);
        });

        it('removes title-slide class for non-title slides', () => {
            container.classList.add('title-slide');
            const slides = makeSlides(['Normal slide']);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(0);
            expect(container.classList.contains('title-slide')).toBe(false);
        });

        it('applies emphasis-slide class for emphasis slides', () => {
            const slides = [{ id: 1, content: 'Important', isEmphasis: true }];
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(0);
            expect(container.classList.contains('emphasis-slide')).toBe(true);
        });

        it('removes emphasis-slide class for non-emphasis slides', () => {
            container.classList.add('emphasis-slide');
            const slides = makeSlides(['Normal slide']);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(0);
            expect(container.classList.contains('emphasis-slide')).toBe(false);
        });

        it('updates currentSlide to the rendered index', () => {
            const slides = makeSlides(['Slide 1', 'Slide 2', 'Slide 3']);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(2);
            expect(SlideRenderer.currentSlide).toBe(2);
        });

        it('does nothing for out-of-bounds index', () => {
            const slides = makeSlides(['Only slide']);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(5);
            expect(SlideRenderer.currentSlide).toBe(0);
        });

        it('does nothing for negative index', () => {
            const slides = makeSlides(['Only slide']);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(-1);
            expect(SlideRenderer.currentSlide).toBe(0);
        });
    });

    describe('autoScale()', () => {
        it('sets 20vw for text with 5 or fewer characters', () => {
            const slides = makeSlides(['Hi']);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(0);
            expect(container.style.fontSize).toBe('20vw');
        });

        it('sets 15vw for text with 6-10 characters', () => {
            const slides = makeSlides(['Hello!!!!']);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(0);
            expect(container.style.fontSize).toBe('15vw');
        });

        it('sets 12vw for text with 11-20 characters', () => {
            const slides = makeSlides(['Hello World Test!']);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(0);
            expect(container.style.fontSize).toBe('12vw');
        });

        it('sets 10vw for text with 21-40 characters', () => {
            const slides = makeSlides(['A'.repeat(30)]);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(0);
            expect(container.style.fontSize).toBe('10vw');
        });

        it('sets 8vw for text with 41-60 characters', () => {
            const slides = makeSlides(['A'.repeat(50)]);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(0);
            expect(container.style.fontSize).toBe('8vw');
        });

        it('sets 6vw for text with 61-100 characters', () => {
            const slides = makeSlides(['A'.repeat(80)]);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(0);
            expect(container.style.fontSize).toBe('6vw');
        });

        it('sets 4vw for text with more than 100 characters', () => {
            const slides = makeSlides(['A'.repeat(150)]);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(0);
            expect(container.style.fontSize).toBe('4vw');
        });
    });

    describe('next()', () => {
        it('moves to the next slide and returns true', () => {
            const slides = makeSlides(['First', 'Second']);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(0);
            const moved = SlideRenderer.next();
            expect(moved).toBe(true);
            expect(SlideRenderer.currentSlide).toBe(1);
        });

        it('returns false when already on the last slide', () => {
            const slides = makeSlides(['Only slide']);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(0);
            const moved = SlideRenderer.next();
            expect(moved).toBe(false);
            expect(SlideRenderer.currentSlide).toBe(0);
        });
    });

    describe('previous()', () => {
        it('moves to the previous slide and returns true', () => {
            const slides = makeSlides(['First', 'Second']);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(1);
            const moved = SlideRenderer.previous();
            expect(moved).toBe(true);
            expect(SlideRenderer.currentSlide).toBe(0);
        });

        it('returns false when already on the first slide', () => {
            const slides = makeSlides(['Only slide']);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(0);
            const moved = SlideRenderer.previous();
            expect(moved).toBe(false);
            expect(SlideRenderer.currentSlide).toBe(0);
        });
    });

    describe('first()', () => {
        it('navigates to the first slide', () => {
            const slides = makeSlides(['A', 'B', 'C']);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(2);
            SlideRenderer.first();
            expect(SlideRenderer.currentSlide).toBe(0);
        });
    });

    describe('last()', () => {
        it('navigates to the last slide', () => {
            const slides = makeSlides(['A', 'B', 'C']);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(0);
            SlideRenderer.last();
            expect(SlideRenderer.currentSlide).toBe(2);
        });
    });

    describe('getCurrentInfo()', () => {
        it('returns correct info for first slide', () => {
            const slides = makeSlides(['A', 'B', 'C']);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(0);
            const info = SlideRenderer.getCurrentInfo();
            expect(info.current).toBe(1);
            expect(info.total).toBe(3);
            expect(info.isFirst).toBe(true);
            expect(info.isLast).toBe(false);
        });

        it('returns correct info for last slide', () => {
            const slides = makeSlides(['A', 'B', 'C']);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(2);
            const info = SlideRenderer.getCurrentInfo();
            expect(info.current).toBe(3);
            expect(info.total).toBe(3);
            expect(info.isFirst).toBe(false);
            expect(info.isLast).toBe(true);
        });

        it('returns correct info for middle slide', () => {
            const slides = makeSlides(['A', 'B', 'C']);
            SlideRenderer.init(slides, container, false);
            SlideRenderer.render(1);
            const info = SlideRenderer.getCurrentInfo();
            expect(info.current).toBe(2);
            expect(info.isFirst).toBe(false);
            expect(info.isLast).toBe(false);
        });
    });

    describe('toggleAnimations()', () => {
        it('toggles animations from true to false', () => {
            SlideRenderer.animationsEnabled = true;
            const result = SlideRenderer.toggleAnimations();
            expect(result).toBe(false);
            expect(SlideRenderer.animationsEnabled).toBe(false);
        });

        it('toggles animations from false to true', () => {
            SlideRenderer.animationsEnabled = false;
            const result = SlideRenderer.toggleAnimations();
            expect(result).toBe(true);
            expect(SlideRenderer.animationsEnabled).toBe(true);
        });
    });
});
