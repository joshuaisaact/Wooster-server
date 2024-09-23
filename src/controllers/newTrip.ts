import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenerativeAI } from '@google/generative-ai';
import trips from '../models/trip';
import { DayItinerary, Trip } from '../types/tripTypes';

interface CreateTripRequestBody {
  days: number;
  location: string;
  start_date: string;
}

const newTrip = async (
  req: Request<object, object, CreateTripRequestBody>,
  res: Response,
) => {
  try {
    const { days, location, start_date } = req.body;
    console.log(location);

    // Validate input
    if (!days || !location || !start_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Retrieve prompt template from environment variables
    const promptTemplate = process.env.PROMPT_TEMPLATE || '';

    // Construct the prompt by replacing placeholders
    const prompt = promptTemplate
      .replace(/{days}/g, days.toString())
      .replace(/{location}/g, location)
      .replace(/{start_date}/g, start_date);

    console.log(promptTemplate);
    // Ensure the API key is set
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in the environment variables.');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Initialize Google Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Generate content using the model
    const result = await model.generateContent(prompt);

    // Extract the generated itinerary text
    let itineraryText = result.response.text();
    console.log('Raw Itinerary response text:', itineraryText);

    itineraryText = itineraryText.replace(/^```json|```$/g, '').trim();

    // Parse the itinerary text into DayItinerary array
    let itinerary: DayItinerary[] = [];
    try {
      itinerary = JSON.parse(itineraryText);
    } catch (parseError) {
      console.error('Failed to parse itinerary:', parseError);
      return res.status(500).json({ error: 'Failed to parse itinerary' });
    }

    // Create a new trip object with the itinerary
    const newTrip: Trip = {
      trip_id: uuidv4(),
      destination_name: location,
      num_days: days,
      start_date: start_date,
      itinerary,
    };

    // Add the new trip to the mock trips array
    trips.push(newTrip);

    // Send response
    return res.status(201).json({
      message: 'Trip created successfully',
      trip: newTrip,
    });
  } catch (error) {
    console.error('Error creating new trip:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export default newTrip;
