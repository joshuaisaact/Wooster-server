import { ServiceError } from '../../utils/error-handlers';
import { destinationPromptTemplate } from '../../config/destination-prompt-template';
import { generateDestinationData as generateAIData } from '../google-ai-service';
import { NewDestination } from '../../types/destination-type';

export const generateNewDestination = async (
  destinationName: string,
): Promise<NewDestination> => {
  try {
    const prompt = destinationPromptTemplate(destinationName);
    console.log('Generated prompt:', prompt);

    const generatedDestination = await generateAIData(prompt);
    console.log('AI Response:', generatedDestination);

    if (!generatedDestination) {
      throw new ServiceError('Failed to generate destination data', 500);
    }

    const destinationData = JSON.parse(generatedDestination);
    if (!destinationData?.destinationName) {
      throw new ServiceError('Invalid destination data format', 500);
    }

    return destinationData;
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError('Failed to generate destination data', 500);
  }
};
