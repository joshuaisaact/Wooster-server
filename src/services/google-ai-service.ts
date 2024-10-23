import { GoogleGenerativeAI } from '@google/generative-ai';
import { cleanLLMJsonResponse, validateJSON } from '../utils/llm-utils';

export const generateDestinationData = async (
  prompt: string,
): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Server configuration error: GEMINI_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error('Empty response from LLM');
    }

    const response = cleanLLMJsonResponse(responseText);
    validateJSON(response);
    return response;
  } catch (error) {
    throw new Error(
      `Failed to generate destination data: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

export const generateTripItinerary = async (
  prompt: string,
): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Server configuration error: GEMINI_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error('Empty response from LLM');
    }

    const response = cleanLLMJsonResponse(responseText);
    validateJSON(response);
    return response;
  } catch (error) {
    throw new Error(
      `Failed to generate trip itinerary: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
