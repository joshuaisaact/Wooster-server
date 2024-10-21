import { GoogleGenerativeAI } from '@google/generative-ai';

export const generateDestinationData = async (
  prompt: string,
): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Server configuration error: GEMINI_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent(prompt);

  // Clean the response (remove ```json blocks if needed)
  return result.response
    .text()
    .replace(/^```json|```$/g, '')
    .trim();
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
  const result = await model.generateContent(prompt);

  return result.response
    .text()
    .replace(/^```json|```$/g, '')
    .trim();
};
