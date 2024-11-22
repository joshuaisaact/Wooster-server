import {
  cleanJSON,
  cleanLLMJsonResponse,
  validateJSON,
} from '@/utils/llm-utils';

describe('LLM Utils', () => {
  describe('cleanLLMJsonResponse', () => {
    it('removes markdown code blocks', () => {
      const input = '```json\n{"test": "value"}\n```';
      expect(cleanLLMJsonResponse(input)).toBe('{"test": "value"}');
    });

    it('handles empty or incomplete URLs', () => {
      const input = '{"website": "https://partial';
      expect(cleanLLMJsonResponse(input)).toContain(
        '"website": "https://example.com"',
      );
    });

    it('removes comments and extra whitespace', () => {
      const input = `
        // Comment
        {
          "test": "value"
        }`;
      const cleaned = cleanLLMJsonResponse(input);
      expect(cleaned).toBe('{\n          "test": "value"\n        }');
    });
  });

  describe('validateJSON', () => {
    it('accepts valid JSON', () => {
      expect(() => validateJSON('{"test": "value"}')).not.toThrow();
    });

    it('rejects invalid JSON', () => {
      expect(() => validateJSON('{broken json')).toThrow(
        'Invalid JSON response',
      );
    });

    it('rejects non-object responses', () => {
      expect(() => validateJSON('"just a string"')).toThrow(
        'not a valid JSON object or array',
      );
    });
  });

  describe('cleanJSON', () => {
    it('removes control characters while preserving valid JSON', () => {
      const input = '{"test":\u0000"value"}';
      expect(cleanJSON(input)).toBe('{"test":"value"}');
    });

    it('preserves valid JSON structure', () => {
      const input = '{"test": "value", "number": 123}';
      expect(cleanJSON(input)).toBe(input);
    });
  });
});
