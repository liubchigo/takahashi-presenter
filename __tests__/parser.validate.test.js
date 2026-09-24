/**
 * Unit tests for SlideParser.validate()
 * Tests the validation logic for presentation content
 * 
 * Following the standard test case template structure:
 * - Test Name
 * - Purpose / Intent
 * - Unit Under Test
 * - Given (Preconditions)
 * - When (Action)
 * - Then (Expected Result)
 * - Assertions
 * - Test Type
 */

const SlideParser = require('../js/parser.js');

describe('SlideParser.validate()', () => {
    /**
     * TEST 1: HAPPY PATH
     * 
     * Test Name: should_return_valid_result_with_no_errors_when_content_contains_valid_slides
     * 
     * Purpose / Intent:
     * Verify that the validate method correctly identifies valid presentation
     * content with multiple slides and returns an appropriate validation result without errors.
     * 
     * Unit Under Test:
     * - Class / Concept: SlideParser
     * - Method / Operation: validate(content)
     * - Layer: Domain
     * - Location: js/parser.js
     * 
     * Test Type: Happy Path
     */
    test('should return valid result with no errors when content contains valid slides', () => {
        // GIVEN (Preconditions):
        // - Object State: SlideParser is in its default state
        // - Inputs: Valid content string with 3 slides separated by blank lines
        // - Mocks / Stubs: None required (pure function)
        const content = "Introduction\n\nKey Points\n\nConclusion";

        // WHEN (Action):
        // Invocation: SlideParser.validate(content)
        const result = SlideParser.validate(content);

        // THEN (Expected Result):
        // - Output Value: result object with specific properties
        // - State Change: None (pure function)
        // - Interaction with Dependencies: N/A
        
        // ASSERTIONS:
        expect(result.isValid).toBe(true);           // result.isValid === true
        expect(result.slideCount).toBe(3);           // result.slideCount === 3
        expect(result.errors).toEqual([]);           // result.errors.length === 0
        expect(result.warnings).toEqual([]);         // result.warnings.length === 0
    });

    /**
     * TEST 2: EDGE CASE
     * 
     * Test Name: should_return_warnings_when_slides_contain_very_long_text_or_words
     * 
     * Purpose / Intent:
     * Verify that the validation method correctly identifies edge cases where
     * slide content may cause display issues (very long text or words) and generates
     * appropriate warnings while still marking the content as valid.
     * 
     * Unit Under Test:
     * - Class / Concept: SlideParser
     * - Method / Operation: validate(content)
     * - Layer: Domain
     * - Location: js/parser.js
     * 
     * Assumptions:
     * - Warnings are advisory and don't prevent content from being valid
     * - Slide 1 is indexed from 1 (not 0) in warning messages
     * - Text length threshold is 100 characters
     * - Word length threshold is 20 characters
     * 
     * Test Type: Edge Case
     */
    test('should return warnings when slides contain very long text or words', () => {
        // GIVEN (Preconditions):
        // - Object State: SlideParser is in its default state
        // - Inputs: Content with two problematic slides:
        //   * Slide 1: Very long text (>100 characters)
        //   * Slide 2: Contains a very long word (>20 characters)
        // - Mocks / Stubs: None required
        const longText = "a ".repeat(51).trim(); // 101 characters with spaces
        const longWord = "b".repeat(21);
        const content = `${longText}\n\n${longWord}`;

        // WHEN (Action):
        // Invocation: SlideParser.validate(content)
        const result = SlideParser.validate(content);

        // THEN (Expected Result):
        // - Output Value: result.isValid equals true (warnings don't invalidate content)
        //   result.slideCount equals 2, result.errors is empty array,
        //   result.warnings is array with 2 warning messages
        // - State Change: None (pure function)
        // - Interaction with Dependencies: N/A
        
        // ASSERTIONS:
        expect(result.isValid).toBe(true);           // result.isValid === true
        expect(result.slideCount).toBe(2);           // result.slideCount === 2
        expect(result.errors).toEqual([]);           // result.errors.length === 0
        expect(result.warnings).toHaveLength(2);     // result.warnings.length === 2
        
        // First warning contains "Slide 1" and "very long"
        expect(result.warnings[0]).toContain('Slide 1');
        expect(result.warnings[0]).toContain('very long');
        
        // Second warning contains "Slide 2" and "very long words"
        expect(result.warnings[1]).toContain('Slide 2');
        expect(result.warnings[1]).toContain('very long words');
    });

    /**
     * TEST 3: GUARD / ERROR CASE
     * 
     * Test Name: should_return_invalid_result_with_errors_when_content_is_empty_or_contains_no_slides
     * 
     * Purpose / Intent:
     * Verify that the validation method correctly enforces the invariant that
     * presentations must contain at least one slide, and returns an invalid result with
     * appropriate error messages when this invariant is violated.
     * 
     * Unit Under Test:
     * - Class / Concept: SlideParser
     * - Method / Operation: validate(content)
     * - Layer: Domain
     * - Location: js/parser.js
     * 
     * Assumptions:
     * - Invariant: A valid presentation MUST have at least one non-empty slide
     * - The parse() method handles null/undefined gracefully by returning an empty array
     * - Empty or whitespace-only content is treated as having zero slides
     * 
     * Notes:
     * - This guard prevents the application from attempting to render an empty presentation
     * - Critical for preventing runtime errors in the presenter UI
     * - Tests the defensive programming approach of the parser
     * 
     * Test Type: Guard / Error Case
     */
    describe('should return invalid result with errors when content is empty or contains no slides', () => {
        // GIVEN (Preconditions):
        // - Object State: SlideParser is in its default state
        // - Inputs: Test multiple invalid inputs (empty string, whitespace, null, undefined)
        // - Mocks / Stubs: None required
        const testCases = [
            { input: "", description: "empty string" },
            { input: "   \n\n   ", description: "whitespace only" },
            { input: null, description: "null" },
            { input: undefined, description: "undefined" }
        ];

        testCases.forEach(({ input, description }) => {
            test(`with ${description}`, () => {
                // WHEN (Action):
                // Invocation: SlideParser.validate(invalid_content)
                const result = SlideParser.validate(input);

                // THEN (Expected Result):
                // - Output Value: result.isValid equals false, result.slideCount equals 0,
                //   result.errors contains exactly one error: "No slides found",
                //   result.warnings is empty array
                // - State Change: None (pure function)
                // - Interaction with Dependencies: N/A
                
                // ASSERTIONS:
                expect(result.isValid).toBe(false);          // result.isValid === false
                expect(result.slideCount).toBe(0);           // result.slideCount === 0
                expect(result.errors).toHaveLength(1);       // result.errors.length === 1
                expect(result.errors[0]).toBe("No slides found");  // result.errors[0] === "No slides found"
                expect(result.warnings).toEqual([]);         // result.warnings.length === 0
            });
        });
    });
});
