import { Request, Response } from 'express';
import { destinationPromptTemplate } from '../config/destination-prompt-template';
import { generateDestinationData } from '../services/google-ai-service';
import { addDestination } from '../services/destination-service';

interface CreateDestinationRequestBody {
  destination: string;
}

const handleAddDestination = async (
  req: Request<object, object, CreateDestinationRequestBody>,
  res: Response,
) => {
  try {
    const { destination } = req.body;

    if (!destination) {
      return res.status(400).json({ error: 'Destination is required' });
    }
    console.log('Destination:', destination);

    const prompt = destinationPromptTemplate(destination);

    console.log('Prompt:', prompt);

    let generatedDestination: string;
    try {
      generatedDestination = await generateDestinationData(prompt);
    } catch (aiError) {
      console.error(
        'AI Error:',
        aiError instanceof Error ? aiError.message : 'Unknown error',
      );
      return res
        .status(500)
        .json({ error: 'Failed to generate destination data' });
    }

    console.log('generated destination:', generatedDestination);

    let destinationData;
    try {
      destinationData = JSON.parse(generatedDestination);
    } catch (parseError) {
      console.error('Failed to parse destination data:', parseError);
      return res
        .status(500)
        .json({ error: 'Failed to parse destination data' });
    }

    let insertedDestination;
    try {
      insertedDestination = await addDestination(destinationData);
    } catch (dbError) {
      if (dbError instanceof Error) {
        console.error('Database Error:', dbError.message);
        return res.status(500).json({ error: dbError.message });
      } else {
        console.error('Unknown Database Error:', dbError);
        return res.status(500).json({ error: 'An unknown error occurred' });
      }
    }

    console.log('Inserted Destination:', insertedDestination);

    return res.status(201).json({
      message: 'Destination created successfully',
      destination: insertedDestination,
    });
  } catch (error) {
    console.error('Error creating new destination:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export default handleAddDestination;
