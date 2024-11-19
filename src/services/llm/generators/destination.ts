import { generateValidJsonResponse } from '../gemini-client';
import { destinationPromptTemplate } from '../prompts/destination';

export const generateDestinationData = async (
  destinationName: string,
): Promise<string> => {
  const prompt = destinationPromptTemplate(destinationName);
  return generateValidJsonResponse(prompt, 'destination data');
};
