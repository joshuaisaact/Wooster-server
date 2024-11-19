import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../../utils/logger';
import {
  createAIServiceError,
  createValidationError,
} from '../../types/errors';
import { cleanLLMJsonResponse, validateJSON } from '../../utils/llm-utils';

export const createGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const errorMessage =
      'Server configuration error: GEMINI_API_KEY is not set';
    logger.error({}, errorMessage);
    throw createAIServiceError(errorMessage);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

export const generateValidJsonResponse = async (
  prompt: string,
  context: string,
): Promise<string> => {
  const model = createGeminiClient();
  let responseText: string = ''; // Initialize responseText variable

  try {
    // Attempt to generate the response
    const result = await model.generateContent(prompt);
    responseText = await result.response.text(); // Capture responseText here

    if (!responseText) {
      const errorMessage = 'Empty response from LLM';
      logger.warn({ prompt }, errorMessage);
      throw createAIServiceError(errorMessage, { prompt });
    }

    // Clean the response and validate it
    const cleanedResponse = cleanLLMJsonResponse(responseText);

    // Perform validation after cleaning the response
    validateJSON(cleanedResponse);

    // Return the valid response if everything passes
    logger.debug({ prompt, response: cleanedResponse }, `Generated ${context}`);
    return cleanedResponse;
  } catch (error) {
    let errorMessage = `Failed to generate ${context}`;

    if (
      error instanceof Error &&
      error.message.includes('Invalid JSON response')
    ) {
      // This is a validation error
      errorMessage = `Invalid JSON response from LLM for ${context}`;
      // Log and throw the validation error with the responseText
      logger.error({ error, rawResponse: responseText }, errorMessage);
      throw createValidationError(errorMessage, {
        error: error.message,
        rawResponse: responseText, // Include responseText here
      });
    }

    // Log and throw a generic AI service error
    logger.error({ error, prompt }, errorMessage);
    throw createAIServiceError(errorMessage, {
      originalError: error instanceof Error ? error.message : 'Unknown error',
      prompt,
    });
  }
};
