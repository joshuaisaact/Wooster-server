export const cleanLLMJsonResponse = (text: string): string => {
  // Step 1: Remove markdown code blocks with any language specification
  const withoutCodeBlocks = text.replace(
    /```(?:json)?\s*([\s\S]*?)\s*```/g,
    '$1',
  );

  // Step 2: Remove potential comments
  const withoutComments = withoutCodeBlocks.replace(
    /\/\*[\s\S]*?\*\/|\/\/.*/g,
    '',
  );

  // Step 3: Detect and replace incomplete URLs by adding a placeholder if needed
  const withCompleteUrls = withoutComments.replace(
    /"website":\s*"https:([^",}]*)/g,
    `"website": "https://example.com"`,
  );

  // Step 4: Trim whitespace from start and end
  return withCompleteUrls.trim();
};

export const validateJSON = (jsonString: string): void => {
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Response is not a valid JSON object or array');
    }
  } catch (error) {
    console.error(
      'JSON Validation failed. Invalid JSON string:',
      jsonString.slice(0, 500),
    );
    throw new Error(
      `Invalid JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

export const cleanJSON = (jsonString: string): string => {
  // Remove control characters (ASCII 0 to 31)
  // eslint-disable-next-line no-control-regex
  const cleanedString = jsonString.replace(/[\x00-\x1F]/g, '');

  // Remove non-printable characters
  const printableString = cleanedString.replace(/[^\x20-\x7E]/g, '');

  return printableString;
};
