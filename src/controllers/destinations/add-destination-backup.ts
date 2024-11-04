import { Request, Response } from 'express';
import { destinationPromptTemplate } from '../../config/destination-prompt-template';
import { generateDestinationData } from '../../services/google-ai-service';
import { addDestination } from '../../services/destination-service';

interface CreateDestinationRequestBody {
  destination: string;
}

export const handleAddDestination = async (
  req: Request<object, object, CreateDestinationRequestBody>,
  res: Response,
) => {
  try {
    const { destination } = req.body;

    if (!destination?.trim()) {
      return res.status(400).json({ error: 'Destination is required' });
    }

    const prompt = destinationPromptTemplate(destination);
    console.log('Generated prompt:', prompt);

    let generatedDestination: string | null | undefined;
    try {
      generatedDestination = await generateDestinationData(prompt);
      console.log('AI Response:', generatedDestination);

      if (generatedDestination === undefined) {
        return res
          .status(500)
          .json({ error: 'Failed to generate destination data' });
      }
    } catch (aiError) {
      console.error('AI Service Error:', aiError);
      return res
        .status(500)
        .json({ error: 'Failed to generate destination data' });
    }

    if (generatedDestination === null) {
      return res
        .status(500)
        .json({ error: 'Failed to parse destination data' });
    }

    let destinationData;
    try {
      destinationData = JSON.parse(generatedDestination);
      console.log('Parsed destination data:', destinationData);

      // Validate required fields
      if (!destinationData || !destinationData.destinationName) {
        console.error('Invalid destination data format:', destinationData);
        return res
          .status(500)
          .json({ error: 'Invalid destination data format' });
      }
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return res
        .status(500)
        .json({ error: 'Failed to parse destination data' });
    }

    try {
      console.log('Attempting to insert destination:', destinationData);
      const insertedDestination = await addDestination(destinationData);
      console.log('Inserted destination:', insertedDestination);

      return res.status(201).json({
        message: 'Destination created successfully',
        destination: insertedDestination || destinationData,
      });
    } catch (dbError) {
      console.error('Database Error:', dbError);

      // Handle known database error types
      if (typeof dbError === 'object' && dbError !== null) {
        // Check for constraint violation
        if ('code' in dbError && dbError.code === '23505') {
          return res.status(409).json({ error: 'Destination already exists' });
        }

        // Check for message property
        if ('message' in dbError && typeof dbError.message === 'string') {
          return res.status(500).json({ error: dbError.message });
        }
      }

      // Handle any other type of error
      return res.status(500).json({ error: 'An unknown error occurred' });
    }
  } catch (error) {
    console.error('Unhandled Error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
