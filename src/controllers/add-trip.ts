import { Request, Response } from 'express';
import { DayItinerary } from '../types/trip-types';
import { addTrip, validateTripInput } from '../services/trip-service';
import { generateTripItinerary } from '../services/google-ai-service';
import { fetchDestinationIdByName } from '../services/destination-service';
import { addItineraryDays } from '../services/itinerary-service';
import { addActivities } from '../services/activity-service';
import { createPrompt } from '../config/trip-prompt-template';

interface CreateTripRequestBody {
  userId: string;
  days: number;
  location: string;
  startDate: string;
}

const handleAddTrip = async (
  req: Request<object, object, CreateTripRequestBody>,
  res: Response,
) => {
  try {
    const { userId, days, location, startDate } = req.body;

    if (!validateTripInput(days, location, startDate)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch destination ID by location name
    let destinationId: number;
    try {
      destinationId = await fetchDestinationIdByName(location);
      if (!destinationId) {
        return res.status(404).json({ error: 'Destination not found' });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
      } else {
        console.error('Unknown error:', error);
        return res.status(500).json({ error: 'An unknown error occurred' });
      }
    }

    const prompt = createPrompt(days, location, startDate);

    // Generate itinerary from Google Generative AI
    let itineraryText: string;
    try {
      itineraryText = await generateTripItinerary(prompt);
    } catch (aiError) {
      console.error(
        'AI Error:',
        aiError instanceof Error ? aiError.message : 'Unknown error',
      );
      return res.status(500).json({
        error: aiError instanceof Error ? aiError.message : 'Unknown error',
      });
    }

    // Parse the generated itinerary text
    let itinerary: DayItinerary[] = [];
    try {
      itinerary = JSON.parse(itineraryText);
    } catch (parseError) {
      console.error('Failed to parse itinerary:', parseError);
      return res.status(500).json({ error: 'Failed to parse itinerary' });
    }

    // Insert the new trip into the database
    let tripId: number;
    try {
      tripId = await addTrip(userId, destinationId, startDate, days);
    } catch (tripError) {
      console.error('Error inserting trip:', tripError);
      return res
        .status(500)
        .json({ error: 'Failed to insert trip into database' });
    }

    // Insert activities
    let activityIds: number[][];
    try {
      activityIds = await addActivities(itinerary, destinationId);
    } catch (activityError) {
      console.error('Error inserting activities:', activityError);
      return res.status(500).json({ error: 'Failed to insert activities' });
    }

    // Insert itinerary days
    try {
      await addItineraryDays(tripId, itinerary, activityIds);
    } catch (itineraryError) {
      console.error('Error inserting itinerary days:', itineraryError);
      return res
        .status(500)
        .json({ error: 'Failed to insert itinerary days into database' });
    }

    // Log trip creation
    console.log('Trip created successfully:', {
      trip_id: tripId,
      destination_name: location,
      num_days: days,
      startDate,
      itinerary,
    });

    return res.status(201).json({
      message: 'Trip created successfully',
      trip: {
        trip_id: tripId,
        destination_name: location,
        num_days: days,
        startDate,
        itinerary,
      },
    });
  } catch (error) {
    console.error('Error creating new trip:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export default handleAddTrip;
