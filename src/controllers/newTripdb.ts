import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import supabase from '../models/supabaseClient'; // Import Supabase client
import { DayItinerary } from '../types/tripTypes';

interface CreateTripRequestBody {
  days: number;
  location: string;
  start_date: string;
}

const newTripdb = async (
  req: Request<object, object, CreateTripRequestBody>,
  res: Response,
) => {
  try {
    const { days, location, start_date } = req.body;

    // Validate input
    if (!days || !location || !start_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Query destinations table to get the destination_id
    const { data: destinationData, error: destinationError } = await supabase
      .from('destinations')
      .select('destination_id')
      .eq('destination_name', location)
      .single(); // Use single() to get one record

    if (destinationError) {
      console.error('Error fetching destination:', destinationError);
      return res.status(500).json({ error: 'Failed to fetch destination' });
    }

    const destinationId = destinationData?.destination_id;

    // If no destination is found, you may want to handle it
    if (!destinationId) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    const promptTemplate = process.env.PROMPT_TEMPLATE || '';
    const prompt = promptTemplate
      .replace(/{days}/g, days.toString())
      .replace(/{location}/g, location)
      .replace(/{start_date}/g, start_date);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);

    let itineraryText = result.response.text();
    console.log(itineraryText);
    itineraryText = itineraryText.replace(/^```json|```$/g, '').trim();

    const itinerary: DayItinerary[] = JSON.parse(itineraryText); // Assuming itinerary is received in JSON format

    // Insert trip data into Supabase and get the trip ID
    const { data: tripData, error: tripError } = await supabase
      .from('trips')
      .insert([
        {
          destination_id: destinationId, // Set appropriate destination_id if available
          start_date,
          num_days: days,
        },
      ])
      .select('trip_id') // Select the generated trip_id
      .single(); // Ensure we get a single record

    if (tripError) {
      console.error('Error inserting trip:', tripError);
      return res
        .status(500)
        .json({ error: 'Failed to insert trip into database' });
    }

    const tripId = tripData.trip_id; // Use the retrieved trip_id

    // Prepare activities and insert them into Supabase
    const activityIds = await Promise.all(
      itinerary.map(async (day) => {
        const activities = day.activities.map((activity) => ({
          activity_name: activity.activity_name,
          latitude: activity.latitude,
          longitude: activity.longitude,
          price: activity.price,
          location: activity.location,
          description: activity.description,
        }));

        // Insert activities and get their IDs
        const { data: activityData, error: activityError } = await supabase
          .from('activities')
          .insert(activities)
          .select('activity_id'); // Select the generated activity_ids

        if (activityError) {
          console.error('Error inserting activities:', activityError);
          throw new Error('Failed to insert activities into database');
        }

        return activityData.map((activity) => activity.activity_id); // Return IDs of inserted activities
      }),
    );

    // Insert itinerary days into Supabase
    for (let i = 0; i < itinerary.length; i++) {
      const dayNumber = i + 1; // Day number is 1-based

      // Loop through activities for the current day
      for (const activityId of activityIds[i]) {
        const { error: itineraryError } = await supabase
          .from('itinerary_days')
          .insert([
            {
              trip_id: tripId,
              day_number: dayNumber,
              activity_id: activityId, // Insert single activity ID
            },
          ]);

        if (itineraryError) {
          console.error('Error inserting itinerary day:', itineraryError);
          return res
            .status(500)
            .json({ error: 'Failed to insert itinerary into database' });
        }
      }
    }

    // Send response
    return res.status(201).json({
      message: 'Trip created successfully',
      trip: {
        destination_name: location,
        num_days: days,
        start_date,
        itinerary,
      },
    });
  } catch (error) {
    console.error('Error creating new trip:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export default newTripdb;
