import { Trip } from '@/types/trip-types';
import { generateValidJsonResponse } from '../gemini-client';
import { tripPromptTemplate } from '../prompts/trip';

export const generateTripItinerary = async (
  days: number,
  location: string,
  startDate: string,
  selectedCategories?: string[],
): Promise<Trip> => {
  const prompt = tripPromptTemplate(
    days,
    location,
    startDate,
    selectedCategories,
  );
  return generateValidJsonResponse<Trip>(prompt, 'trip itinerary');
};
