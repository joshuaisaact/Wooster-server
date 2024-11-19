import { generateValidJsonResponse } from '../gemini-client';
import { tripPromptTemplate } from '../prompts/trip';

export const generateTripItinerary = async (
  days: number,
  location: string,
  startDate: string,
  selectedCategories?: string[],
): Promise<string> => {
  const prompt = tripPromptTemplate(
    days,
    location,
    startDate,
    selectedCategories,
  );
  return generateValidJsonResponse(prompt, 'trip itinerary');
};
