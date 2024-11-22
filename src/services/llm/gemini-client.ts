import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../../utils/logger';

import { cleanLLMJsonResponse, validateJSON } from '../../utils/llm-utils';
import {
  createAIServiceError,
  createValidationError,
} from '../../utils/error-handlers';
import { isAIServiceError } from '../../utils/error-guards';

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

export const generateValidJsonResponse = async <T>(
  prompt: string,
  context: string,
): Promise<T> => {
  const model = createGeminiClient();
  let responseText: string = '';

  try {
    // Add basic timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const result = await model.generateContent(prompt, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    responseText = result.response.text();

    if (!responseText?.trim()) {
      throw createAIServiceError('Empty response from LLM', { prompt });
    }

    // Clean and validate JSON using your existing methods
    const cleanedResponse = cleanLLMJsonResponse(responseText);
    validateJSON(cleanedResponse);

    // Parse the cleaned JSON string into the specified type
    const parsedResponse = JSON.parse(cleanedResponse) as T;

    return parsedResponse;
  } catch (error) {
    // Handle abort/timeout
    if (error instanceof Error && error.name === 'AbortError') {
      throw createAIServiceError(`LLM request timed out for ${context}`, {
        prompt,
      });
    }

    // Handle validation errors with exact message format
    if (error instanceof Error && error.message.includes('Invalid JSON')) {
      throw createValidationError(
        `Invalid JSON response from LLM for ${context}`,
        {
          error: `Invalid JSON response: ${error.message}`,
          rawResponse: responseText,
        },
      );
    }

    // Pass through any AI service errors (like empty response)
    if (isAIServiceError(error)) {
      throw error;
    }

    // Generic AI service error
    throw createAIServiceError(`Failed to generate ${context}`, {
      originalError: error instanceof Error ? error.message : 'Unknown error',
      prompt,
    });
  }
};
