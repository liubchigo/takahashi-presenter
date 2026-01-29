// Unit tests for SlideParser.parse()
// Test framework: Node.js built-in test runner

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { SlideParser } = require('../js/parser.js');

/**
 * Test 1: Happy Path - should_return_array_of_slide_objects_when_valid_content_provided
 * 
 * Purpose: Verify that the parser correctly transforms valid multi-slide text content 
 * into an array of structured slide objects with proper IDs, content, and metadata.
 */
test('should return array of slide objects when valid content provided', () => {
    // Given: Valid string with multiple slides separated by blank lines
    const content = `First Slide

Second Slide

Third Slide`;

    // When: Parse the content
    const result = SlideParser.parse(content);

    // Then: Verify the output
    // Check result is an array
    assert.ok(Array.isArray(result), 'Result should be an array');
    
    // Check result length is 3
    assert.strictEqual(result.length, 3, 'Should have 3 slides');
    
    // Check first slide
    assert.strictEqual(result[0].id, 1, 'First slide should have id 1');
    assert.strictEqual(result[0].content, 'First Slide', 'First slide content should match');
    assert.ok(result[0].metadata, 'First slide should have metadata object');
    assert.strictEqual(typeof result[0].metadata, 'object', 'Metadata should be an object');
    
    // Check second slide
    assert.strictEqual(result[1].id, 2, 'Second slide should have id 2');
    assert.strictEqual(result[1].content, 'Second Slide', 'Second slide content should match');
    assert.ok(result[1].metadata, 'Second slide should have metadata object');
    
    // Check third slide
    assert.strictEqual(result[2].id, 3, 'Third slide should have id 3');
    assert.strictEqual(result[2].content, 'Third Slide', 'Third slide content should match');
    assert.ok(result[2].metadata, 'Third slide should have metadata object');
});

/**
 * Test 2: Edge Case - should_return_empty_array_when_content_contains_only_whitespace
 * 
 * Purpose: Verify that the parser gracefully handles edge cases where content consists 
 * entirely of whitespace, blank lines, or separators without actual slide content.
 */
test('should return empty array when content contains only whitespace', () => {
    // Given: String with only whitespace and separators
    const content = `

---


---

`;

    // When: Parse the content
    const result = SlideParser.parse(content);

    // Then: Verify the output
    // Check result is an array
    assert.ok(Array.isArray(result), 'Result should be an array');
    
    // Check result is empty
    assert.strictEqual(result.length, 0, 'Should have 0 slides');
    
    // Check it's an empty array
    assert.deepStrictEqual(result, [], 'Should be an empty array');
});

/**
 * Test 3: Guard/Error - should_return_empty_array_when_content_is_null_or_undefined
 * 
 * Purpose: Verify that the parser enforces input validation guards and handles invalid 
 * input types without throwing exceptions, ensuring defensive programming.
 */
test('should return empty array when content is null or undefined', () => {
    // Test Case A: content = null
    const resultNull = SlideParser.parse(null);
    assert.ok(Array.isArray(resultNull), 'Result should be an array for null input');
    assert.strictEqual(resultNull.length, 0, 'Should have 0 slides for null input');
    
    // Test Case B: content = undefined
    const resultUndefined = SlideParser.parse(undefined);
    assert.ok(Array.isArray(resultUndefined), 'Result should be an array for undefined input');
    assert.strictEqual(resultUndefined.length, 0, 'Should have 0 slides for undefined input');
    
    // Test Case C: content = 123 (non-string type)
    const resultNumber = SlideParser.parse(123);
    assert.ok(Array.isArray(resultNumber), 'Result should be an array for number input');
    assert.strictEqual(resultNumber.length, 0, 'Should have 0 slides for number input');
    
    // Verify no exceptions were thrown (test passes if we reach here)
    assert.ok(true, 'No exceptions should be thrown for invalid inputs');
});
