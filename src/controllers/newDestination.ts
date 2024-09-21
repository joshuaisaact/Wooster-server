import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
// import { Destination } from '../types/destinationType';
import supabase from '../models/supabaseClient';

interface CreateDestinationRequestBody {
  destination: string;
}

const newDestination = async (
  req: Request<{}, {}, CreateDestinationRequestBody>,
  res: Response,
) => {
  try {
    const { destination } = req.body;

    if (!destination) {
      return res.status(400).json({ error: 'Destination is required' });
    }

    const promptTemplate = process.env.DESTINATION_PROMPT_TEMPLATE;

    if (!promptTemplate) {
      console.error(
        'DESTINATION_PROMPT_TEMPLATE is not set in the environment variables.',
      );
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Ensure the AI API key is set
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in the environment variables.');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const prompt = promptTemplate.replace(/{destination}/g, destination);

    // Initialize Google Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);

    let generatedDestination = result.response.text(); // Get the raw response

    console.log('generated destination', generatedDestination);

    generatedDestination = generatedDestination
      .replace(/^```json|```$/g, '')
      .trim();

    const destinationData = JSON.parse(generatedDestination);
    console.log('destination data', destinationData);
    const { data: insertedDestination, error: insertError } = await supabase
      .from('destinations')
      .insert([destinationData]) // Insert as an array
      .select('*') // Ensure to select all columns
      .single(); // This will return the inserted row

    if (insertError) {
      console.error('Error inserting destination:', insertError);
      return res.status(500).json({ error: 'Failed to insert destination' });
    }

    console.log('Generated Destination:', destinationData); // Log the raw response
    console.log('Inserted Destination:', insertedDestination); // Log the raw response

    return res.status(201).json({
      message: 'Destination created successfully',
      destination: insertedDestination,
    });
  } catch (error) {
    console.error('Error creating new destination:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export default newDestination;
