/**
 * Unit Tests for SlideParser.extractMetadata
 * 
 * Tests the metadata extraction logic from YAML-like frontmatter in presentation content.
 * This domain logic is critical for correctly parsing user-defined presentation settings
 * (theme, font, etc.) that control the entire presentation behavior.
 */

const SlideParser = require('../parser.js');

describe('SlideParser.extractMetadata', () => {
    /**
     * Test 1: Happy Path
     * 
     * Purpose: Verify that well-formed YAML-like metadata block is correctly parsed
     * into a key-value object and separated from body content. This ensures the
     * standard use case works correctly for users following the documented format.
     */
    describe('should_extract_valid_metadata_when_properly_formatted', () => {
        it('should extract metadata and body correctly from valid formatted content', () => {
            // Given: Valid content with metadata block
            const content = `---
theme: dark
font: sans-serif
---
Slide 1 content`;

            // When: Extract metadata
            const result = SlideParser.extractMetadata(content);

            // Then: Returns object with metadata and body properties
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(Object);
            
            // Metadata should exist and be an object
            expect(result.metadata).toBeDefined();
            expect(result.metadata).toBeInstanceOf(Object);
            
            // Metadata should contain the correct key-value pairs
            expect(result.metadata.theme).toBe('dark');
            expect(result.metadata.font).toBe('sans-serif');
            
            // Body should equal the content without metadata
            expect(result.body).toBe('Slide 1 content');
            
            // Body should not contain the metadata delimiter
            expect(result.body).not.toContain('---');
        });
    });

    /**
     * Test 2: Edge Case
     * 
     * Purpose: Verify that metadata values containing colons (e.g., URLs, time values)
     * are correctly parsed without splitting on internal colons. This is a critical
     * edge case since the parser splits on colons to extract key-value pairs.
     */
    describe('should_handle_colons_in_metadata_values', () => {
        it('should preserve colons within metadata values like URLs and time formats', () => {
            // Given: Content with metadata containing colons in values
            const content = `---
url: https://example.com:8080/path
time: 10:30:45
---
Body content`;

            // When: Extract metadata
            const result = SlideParser.extractMetadata(content);

            // Then: Metadata values should preserve all colons
            expect(result.metadata).toBeDefined();
            
            // URL should be preserved with all colons intact
            expect(result.metadata.url).toBe('https://example.com:8080/path');
            expect(result.metadata.url).toContain('example.com');
            expect(result.metadata.url).toContain(':8080');
            
            // Time format should be preserved
            expect(result.metadata.time).toBe('10:30:45');
            
            // Only these two keys should exist
            expect(Object.keys(result.metadata).length).toBe(2);
            
            // Body should be correctly extracted
            expect(result.body).toBe('Body content');
        });
    });

    /**
     * Test 3: Guard/Error Case
     * 
     * Purpose: Verify that content without metadata delimiters is handled gracefully,
     * returning an empty metadata object and the full content as body. This guards
     * against null/undefined errors and ensures the parser doesn't crash on simple
     * presentation content.
     */
    describe('should_return_empty_metadata_when_no_delimiter_found', () => {
        it('should return empty metadata and full content as body when no delimiters present', () => {
            // Given: Content without metadata delimiters
            const content = `Just slide content
No metadata here`;

            // When: Extract metadata
            const result = SlideParser.extractMetadata(content);

            // Then: Returns object with empty metadata
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(Object);
            
            // Metadata should exist and be an empty object
            expect(result.metadata).toBeDefined();
            expect(result.metadata).toBeInstanceOf(Object);
            expect(Object.keys(result.metadata).length).toBe(0);
            
            // Body should contain the full original content exactly
            expect(result.body).toBe(content);
            expect(result.body).toBe(`Just slide content
No metadata here`);
            
            // No exception should be thrown (test passes if we reach here)
        });
    });
});
