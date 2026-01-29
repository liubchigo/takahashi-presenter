/**
 * Unit tests for SlideParser.validate()
 * Tests the validation logic for presentation content
 */

const SlideParser = require('../js/parser.js');

describe('SlideParser.validate()', () => {
    /**
     * Test 1: Happy Path
     * should_return_valid_result_with_no_errors_when_content_contains_valid_slides
     * 
     * Purpose: Verify that the validate method correctly identifies valid presentation
     * content with multiple slides and returns an appropriate validation result without errors.
     */
    test('should return valid result with no errors when content contains valid slides', () => {
        // Given: Valid content string with 3 slides separated by blank lines
        const content = "Introduction\n\nKey Points\n\nConclusion";

        // When: Validating the content
        const result = SlideParser.validate(content);

        // Then: Result should be valid with correct slide count and no errors/warnings
        expect(result.isValid).toBe(true);
        expect(result.slideCount).toBe(3);
        expect(result.errors).toEqual([]);
        expect(result.warnings).toEqual([]);
    });

    /**
     * Test 2: Edge Case
     * should_return_warnings_when_slides_contain_very_long_text_or_words
     * 
     * Purpose: Verify that the validation method correctly identifies edge cases where
     * slide content may cause display issues (very long text or words) and generates
     * appropriate warnings while still marking the content as valid.
     */
    test('should return warnings when slides contain very long text or words', () => {
        // Given: Content with two problematic slides
        // Slide 1: Very long text (>100 characters) - multiple short words to avoid triggering long word warning
        // Slide 2: Contains a very long word (>20 characters)
        const longText = "a ".repeat(51).trim(); // 101 characters with spaces
        const longWord = "b".repeat(21);
        const content = `${longText}\n\n${longWord}`;

        // When: Validating the content
        const result = SlideParser.validate(content);

        // Then: Result should be valid but contain warnings
        expect(result.isValid).toBe(true);
        expect(result.slideCount).toBe(2);
        expect(result.errors).toEqual([]);
        expect(result.warnings).toHaveLength(2);
        
        // First warning should be about long text on Slide 1
        expect(result.warnings[0]).toContain('Slide 1');
        expect(result.warnings[0]).toContain('very long');
        
        // Second warning should be about long words on Slide 2
        expect(result.warnings[1]).toContain('Slide 2');
        expect(result.warnings[1]).toContain('very long words');
    });

    /**
     * Test 3: Guard / Error Case
     * should_return_invalid_result_with_errors_when_content_is_empty_or_contains_no_slides
     * 
     * Purpose: Verify that the validation method correctly enforces the invariant that
     * presentations must contain at least one slide, and returns an invalid result with
     * appropriate error messages when this invariant is violated.
     */
    describe('should return invalid result with errors when content is empty or contains no slides', () => {
        // Test multiple invalid inputs
        const testCases = [
            { input: "", description: "empty string" },
            { input: "   \n\n   ", description: "whitespace only" },
            { input: null, description: "null" },
            { input: undefined, description: "undefined" }
        ];

        testCases.forEach(({ input, description }) => {
            test(`with ${description}`, () => {
                // When: Validating invalid content
                const result = SlideParser.validate(input);

                // Then: Result should be invalid with appropriate error
                expect(result.isValid).toBe(false);
                expect(result.slideCount).toBe(0);
                expect(result.errors).toHaveLength(1);
                expect(result.errors[0]).toBe("No slides found");
                expect(result.warnings).toEqual([]);
            });
        });
    });
});
