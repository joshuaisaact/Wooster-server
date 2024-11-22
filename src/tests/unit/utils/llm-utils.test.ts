import { cleanJSON, validateJSON } from '@/utils/llm-utils';

describe('validateJSON', () => {
  it('throws an error for invalid JSON', () => {
    const invalidJson = '{"key": "value",}'; // trailing comma
    expect(() => validateJSON(invalidJson)).toThrow('Invalid JSON response');
  });

  it('does not throw error for valid JSON object', () => {
    const validJson = '{"key": "value"}';
    expect(() => validateJSON(validJson)).not.toThrow();
  });

  it('does not throw error for valid JSON array', () => {
    const validJson = '[{"key": "value"}]';
    expect(() => validateJSON(validJson)).not.toThrow();
  });

  it('throws an error when JSON is not an object or array', () => {
    const invalidJson = '"just a string"';
    expect(() => validateJSON(invalidJson)).toThrow('Invalid JSON response');
  });
});

describe('cleanJSON', () => {
  it('removes control characters (ASCII 0-31)', () => {
    const input = 'Hello\x00World';
    const expectedOutput = 'HelloWorld';
    expect(cleanJSON(input)).toBe(expectedOutput);
  });

  it('removes non-printable characters', () => {
    const input = 'Hello\x7FWorld';
    const expectedOutput = 'HelloWorld';
    expect(cleanJSON(input)).toBe(expectedOutput);
  });

  it('does not modify printable characters', () => {
    const input = 'Hello World!';
    const expectedOutput = 'Hello World!';
    expect(cleanJSON(input)).toBe(expectedOutput);
  });
});
