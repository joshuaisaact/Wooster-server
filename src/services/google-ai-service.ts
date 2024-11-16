import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  cleanJSON,
  cleanLLMJsonResponse,
  validateJSON,
} from '../utils/llm-utils';
import { createAIServiceError, createValidationError } from '../types/errors';
import { logger } from '../utils/logger';

export const generateDestinationData = async (
  prompt: string,
): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const errorMessage =
      'Server configuration error: GEMINI_API_KEY is not set';
    logger.error({ prompt }, errorMessage);
    throw createAIServiceError(errorMessage);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      const errorMessage = 'Empty response from LLM';
      logger.warn({ prompt }, errorMessage);
      throw createAIServiceError(errorMessage, { prompt });
    }

    const response = cleanLLMJsonResponse(responseText);
    try {
      validateJSON(response);
    } catch (validationError) {
      const errorMessage = 'Invalid JSON response from LLM';
      logger.error(
        { error: validationError, rawResponse: responseText },
        errorMessage,
      );
      throw createValidationError(errorMessage, {
        error:
          validationError instanceof Error
            ? validationError.message
            : 'Unknown validation error',
        rawResponse: responseText,
      });
    }

    logger.debug({ prompt, response }, 'Generated destination data');
    return response;
  } catch (error) {
    const errorMessage = 'Failed to generate destination data';
    logger.error({ error, prompt }, errorMessage);
    throw createAIServiceError(errorMessage, {
      originalError: error instanceof Error ? error.message : 'Unknown error',
      prompt,
    });
  }
};

export const generateTripItinerary = async (
  prompt: string,
): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const errorMessage =
      'Server configuration error: GEMINI_API_KEY is not set';
    logger.error({ prompt }, errorMessage);
    throw createAIServiceError(errorMessage);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      const errorMessage = 'Empty response from LLM';
      logger.warn({ prompt }, errorMessage);
      throw createAIServiceError(errorMessage, { prompt });
    }

    logger.debug({ prompt, responseText }, 'Raw response from LLM');

    const withoutMarkdown = cleanLLMJsonResponse(responseText);
    logger.debug({ withoutMarkdown }, 'Cleaned LLM response');

    const fullyCleaned = cleanJSON(withoutMarkdown);
    logger.debug({ fullyCleaned }, 'Cleaned JSON');

    try {
      validateJSON(fullyCleaned);
    } catch (validationError) {
      const errorMessage = 'Invalid JSON response from LLM';
      logger.error(
        { error: validationError, rawResponse: responseText },
        errorMessage,
      );
      throw createValidationError(errorMessage, {
        error:
          validationError instanceof Error
            ? validationError.message
            : 'Unknown validation error',
        rawResponse: responseText,
      });
    }

    logger.debug({ prompt, fullyCleaned }, 'Generated trip itinerary');
    return fullyCleaned;
  } catch (error) {
    const errorMessage = 'Failed to generate trip itinerary';
    logger.error({ error, prompt }, errorMessage);
    throw createAIServiceError(errorMessage, {
      originalError: error instanceof Error ? error.message : 'Unknown error',
      prompt,
    });
  }
};
