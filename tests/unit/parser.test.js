import { describe, it, expect } from 'vitest';
const SlideParser = require('../../js/parser.js');

describe('SlideParser', () => {
    describe('parse()', () => {
        it('returns empty array for null input', () => {
            expect(SlideParser.parse(null)).toEqual([]);
        });

        it('returns empty array for empty string', () => {
            expect(SlideParser.parse('')).toEqual([]);
        });

        it('returns empty array for non-string input', () => {
            expect(SlideParser.parse(123)).toEqual([]);
            expect(SlideParser.parse(undefined)).toEqual([]);
        });

        it('parses blank-line separated slides', () => {
            const content = 'First slide\n\nSecond slide\n\nThird slide';
            const slides = SlideParser.parse(content);
            expect(slides).toHaveLength(3);
            expect(slides[0].content).toBe('First slide');
            expect(slides[1].content).toBe('Second slide');
            expect(slides[2].content).toBe('Third slide');
        });

        it('parses --- separated slides', () => {
            const content = 'First slide\n---\nSecond slide\n---\nThird slide';
            const slides = SlideParser.parse(content);
            expect(slides).toHaveLength(3);
            expect(slides[0].content).toBe('First slide');
            expect(slides[1].content).toBe('Second slide');
            expect(slides[2].content).toBe('Third slide');
        });

        it('assigns sequential slide IDs starting from 1', () => {
            const content = 'Slide A\n\nSlide B\n\nSlide C';
            const slides = SlideParser.parse(content);
            expect(slides[0].id).toBe(1);
            expect(slides[1].id).toBe(2);
            expect(slides[2].id).toBe(3);
        });

        it('filters out empty slides from multiple blank lines', () => {
            const content = 'First\n\n\n\nSecond';
            const slides = SlideParser.parse(content);
            expect(slides).toHaveLength(2);
        });

        it('detects title slides with # prefix', () => {
            const content = '# My Title\n\nNormal slide';
            const slides = SlideParser.parse(content);
            expect(slides[0].isTitle).toBe(true);
            expect(slides[0].content).toBe('My Title');
        });

        it('removes # prefix from title slide content', () => {
            const content = '## Heading Title';
            const slides = SlideParser.parse(content);
            expect(slides[0].isTitle).toBe(true);
            expect(slides[0].content).not.toContain('#');
        });

        it('detects emphasis slides with ! prefix', () => {
            const content = '! Important!';
            const slides = SlideParser.parse(content);
            expect(slides[0].isEmphasis).toBe(true);
            expect(slides[0].content).toBe('Important!');
        });

        it('removes ! prefix from emphasis slide content', () => {
            const content = '!! Double emphasis';
            const slides = SlideParser.parse(content);
            expect(slides[0].isEmphasis).toBe(true);
            expect(slides[0].content).toBe('Double emphasis');
        });

        it('normal slides do not have isTitle or isEmphasis', () => {
            const content = 'Just text';
            const slides = SlideParser.parse(content);
            expect(slides[0].isTitle).toBeUndefined();
            expect(slides[0].isEmphasis).toBeUndefined();
        });

        it('parses content with YAML metadata and slides', () => {
            const content = '---\ntheme: dark\nfont: serif\n---\n\nFirst slide\n\nSecond slide';
            const slides = SlideParser.parse(content);
            expect(slides).toHaveLength(2);
            expect(slides[0].metadata.theme).toBe('dark');
            expect(slides[0].metadata.font).toBe('serif');
        });

        it('handles special characters in slide content', () => {
            const content = 'Hello & Goodbye\n\nTest <tag> content\n\n100% done';
            const slides = SlideParser.parse(content);
            expect(slides).toHaveLength(3);
            expect(slides[0].content).toBe('Hello & Goodbye');
            expect(slides[1].content).toBe('Test <tag> content');
            expect(slides[2].content).toBe('100% done');
        });

        it('trims whitespace from slide content', () => {
            const content = '  Hello World  \n\n  Another Slide  ';
            const slides = SlideParser.parse(content);
            expect(slides[0].content).toBe('Hello World');
            expect(slides[1].content).toBe('Another Slide');
        });
    });

    describe('extractMetadata()', () => {
        it('returns empty metadata and full body when no YAML block', () => {
            const content = 'Just some content';
            const { metadata, body } = SlideParser.extractMetadata(content);
            expect(metadata).toEqual({});
            expect(body).toBe('Just some content');
        });

        it('extracts theme from YAML metadata block', () => {
            const content = '---\ntheme: dark\n---\n\nSlide content';
            const { metadata } = SlideParser.extractMetadata(content);
            expect(metadata.theme).toBe('dark');
        });

        it('extracts multiple key-value pairs from YAML block', () => {
            const content = '---\ntheme: blue\nfont: serif\n---\n\nContent';
            const { metadata } = SlideParser.extractMetadata(content);
            expect(metadata.theme).toBe('blue');
            expect(metadata.font).toBe('serif');
        });

        it('removes metadata block from body', () => {
            const content = '---\ntheme: dark\n---\n\nSlide content';
            const { body } = SlideParser.extractMetadata(content);
            expect(body).not.toContain('theme');
            expect(body).toContain('Slide content');
        });

        it('handles values with colons correctly', () => {
            const content = '---\nurl: http://example.com\n---\n\nContent';
            const { metadata } = SlideParser.extractMetadata(content);
            expect(metadata.url).toBe('http://example.com');
        });
    });

    describe('splitSlides()', () => {
        it('splits on double newline', () => {
            const content = 'Slide 1\n\nSlide 2';
            const parts = SlideParser.splitSlides(content);
            expect(parts.length).toBeGreaterThanOrEqual(2);
        });

        it('splits on --- separator', () => {
            const content = 'Slide 1\n---\nSlide 2';
            const parts = SlideParser.splitSlides(content);
            expect(parts.length).toBeGreaterThanOrEqual(2);
        });

        it('normalizes Windows line endings (CRLF)', () => {
            const content = 'Slide 1\r\n\r\nSlide 2';
            const parts = SlideParser.splitSlides(content);
            expect(parts.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('createSlide()', () => {
        it('creates a slide object with correct id', () => {
            const slide = SlideParser.createSlide('Hello', 0, {});
            expect(slide.id).toBe(1);
        });

        it('includes global metadata in slide metadata', () => {
            const globalMeta = { theme: 'dark', font: 'serif' };
            const slide = SlideParser.createSlide('Hello', 0, globalMeta);
            expect(slide.metadata.theme).toBe('dark');
            expect(slide.metadata.font).toBe('serif');
        });

        it('sets isTitle flag for # prefix', () => {
            const slide = SlideParser.createSlide('# Title Slide', 0, {});
            expect(slide.isTitle).toBe(true);
        });

        it('sets fontSize to large for title slides', () => {
            const slide = SlideParser.createSlide('# Title Slide', 0, {});
            expect(slide.metadata.fontSize).toBe('large');
        });

        it('sets isEmphasis flag for ! prefix', () => {
            const slide = SlideParser.createSlide('! Emphasis', 0, {});
            expect(slide.isEmphasis).toBe(true);
        });

        it('does not modify global metadata object', () => {
            const globalMeta = { theme: 'dark' };
            SlideParser.createSlide('# Title', 0, globalMeta);
            expect(globalMeta.fontSize).toBeUndefined();
        });

        it('defaults to empty object when globalMetadata not provided', () => {
            const slide = SlideParser.createSlide('Hello', 0);
            expect(slide.metadata).toEqual({});
        });
    });

    describe('validate()', () => {
        it('returns isValid false and error for empty content', () => {
            const result = SlideParser.validate('');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('No slides found');
            expect(result.slideCount).toBe(0);
        });

        it('returns isValid true for valid content', () => {
            const result = SlideParser.validate('Hello World');
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('returns correct slide count', () => {
            const result = SlideParser.validate('Slide 1\n\nSlide 2\n\nSlide 3');
            expect(result.slideCount).toBe(3);
        });

        it('warns about very long text (>100 chars)', () => {
            const longText = 'A'.repeat(101);
            const result = SlideParser.validate(longText);
            expect(result.warnings.length).toBeGreaterThan(0);
            expect(result.warnings[0]).toContain('very long');
        });

        it('warns about very long words (>20 chars)', () => {
            const longWord = 'A'.repeat(21);
            const result = SlideParser.validate(longWord);
            expect(result.warnings.length).toBeGreaterThan(0);
            expect(result.warnings[0]).toContain('long words');
        });

        it('returns no warnings for normal content', () => {
            const result = SlideParser.validate('Hello World\n\nShort text');
            expect(result.warnings).toHaveLength(0);
        });
    });

    describe('count()', () => {
        it('returns 0 for empty content', () => {
            expect(SlideParser.count('')).toBe(0);
        });

        it('returns correct number of slides', () => {
            expect(SlideParser.count('A\n\nB\n\nC')).toBe(3);
        });
    });

    describe('getMetadata()', () => {
        it('returns empty object when no metadata block', () => {
            const meta = SlideParser.getMetadata('Just content');
            expect(meta).toEqual({});
        });

        it('returns metadata from YAML block', () => {
            const content = '---\ntheme: green\n---\n\nContent';
            const meta = SlideParser.getMetadata(content);
            expect(meta.theme).toBe('green');
        });
    });

    describe('getWarnings()', () => {
        it('returns empty array for slides with short text', () => {
            const slides = [{ content: 'Short' }, { content: 'Also short' }];
            expect(SlideParser.getWarnings(slides)).toHaveLength(0);
        });

        it('warns when slide content exceeds 100 characters', () => {
            const slides = [{ content: 'A'.repeat(101) }];
            const warnings = SlideParser.getWarnings(slides);
            expect(warnings[0]).toContain('Slide 1');
        });

        it('warns when slide has a word longer than 20 characters', () => {
            const slides = [{ content: 'Normal ' + 'X'.repeat(21) }];
            const warnings = SlideParser.getWarnings(slides);
            expect(warnings.some(w => w.includes('long words'))).toBe(true);
        });
    });
});
