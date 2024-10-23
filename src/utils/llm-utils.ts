export const cleanLLMJsonResponse = (text: string): string => {
  // Remove markdown code blocks with any language specification
  const withoutCodeBlocks = text.replace(
    /```(?:json)?\s*([\s\S]*?)\s*```/g,
    '$1',
  );

  // Remove any potential comments
  const withoutComments = withoutCodeBlocks.replace(
    /\/\*[\s\S]*?\*\/|\/\/.*/g,
    '',
  );

  // Remove any leading/trailing whitespace
  return withoutComments.trim();
};

export const validateJSON = (jsonString: string): void => {
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Response is not a valid JSON object or array');
    }
  } catch (error) {
    throw new Error(
      `Invalid JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
