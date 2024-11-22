import { NewDestination } from '@/types/destination-type';
import { generateValidJsonResponse } from '../gemini-client';
import { destinationPromptTemplate } from '../prompts/destination';

export const generateDestinationData = async (
  destinationName: string,
): Promise<NewDestination> => {
  const prompt = destinationPromptTemplate(destinationName);
  return generateValidJsonResponse<NewDestination>(prompt, 'destination data');
};
