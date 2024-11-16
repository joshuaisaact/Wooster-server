import { generateTripItinerary } from '../google-ai-service';
import { createPrompt } from '../../config/trip-prompt-template';
import { addActivities } from '../activity-service';
import {
  createAIServiceError,
  createParsingError,
  createTripGenerationError,
  isAIServiceError,
} from '../../types/errors';
import { logger } from '../../utils/logger';

export const generateTrip = async (
  days: number,
  location: string,
  startDate: string,
  destinationId: number,
) => {
  try {
    const prompt = createPrompt(days, location, startDate);
    logger.info(
      { days, location, startDate, destinationId },
      'Generating trip itinerary',
    );
    logger.debug({ prompt }, 'Generated AI prompt');

    const itineraryText = await generateTripItinerary(prompt);

    if (!itineraryText) {
      const errorMessage = 'AI service returned no data';
      logger.warn({ prompt }, errorMessage);
      throw createAIServiceError(errorMessage, { prompt });
    }

    try {
      const itinerary = JSON.parse(itineraryText);
      logger.debug({ itinerary }, 'Parsed AI response successfully');

      const activityIds = await addActivities(itinerary, destinationId);
      logger.info(
        { days, location, startDate, destinationId },
        'Generated trip itinerary successfully',
      );

      return { itinerary, activityIds };
    } catch (error) {
      const errorMessage = 'Failed to parse generated itinerary';
      logger.error({ error, rawResponse: itineraryText }, errorMessage);
      throw createParsingError(errorMessage, {
        error: error instanceof Error ? error.message : 'Unknown parse error',
        rawResponse: itineraryText,
      });
    }
  } catch (error) {
    if (isAIServiceError(error)) {
      logger.warn({ error }, 'AI service error encountered');
      throw error;
    }

    const errorMessage = 'Failed to generate trip itinerary';
    logger.error(
      { error, days, location, startDate, destinationId },
      errorMessage,
    );
    throw createTripGenerationError(errorMessage, {
      originalError: error instanceof Error ? error.message : 'Unknown error',
      days,
      location,
      startDate,
      destinationId,
    });
  }
};
