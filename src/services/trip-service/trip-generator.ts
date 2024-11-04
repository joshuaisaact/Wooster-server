import { generateTripItinerary } from '../google-ai-service';
import { createPrompt } from '../../config/trip-prompt-template';
import { addActivities } from '../activity-service';
import { isAIError } from '../../utils/error-handlers';

export const generateTrip = async (
  days: number,
  location: string,
  startDate: string,
  destinationId: number,
) => {
  try {
    const prompt = createPrompt(days, location, startDate);
    const itineraryText = await generateTripItinerary(prompt);

    try {
      const itinerary = JSON.parse(itineraryText);
      const activityIds = await addActivities(itinerary, destinationId);

      return { itinerary, activityIds };
    } catch (error) {
      throw {
        operation: 'PARSING' as const,
        message: 'Failed to parse generated itinerary',
        details: error,
      };
    }
  } catch (error) {
    if (isAIError(error)) throw error;

    throw {
      operation: 'TRIP_GENERATION' as const,
      message: 'Failed to generate trip itinerary',
      details: error,
    };
  }
};
