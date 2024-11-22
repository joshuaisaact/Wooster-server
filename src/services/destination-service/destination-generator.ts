// import { destinationPromptTemplate } from '../../config/destination-prompt-template';
// import { generateDestinationData as generateAIData } from '../google-ai-service';
// import { NewDestination } from '../../types/destination-type';
// import {
//   createDestinationGenerationError,
//   createAIServiceError,
//   createParsingError,
//   isAIServiceError,
// } from '../../types/errors';
// import { logger } from '../../utils/logger';

// export const generateNewDestination = async (
//   destinationName: string,
// ): Promise<NewDestination> => {
//   logger.info({ destinationName }, 'Starting destination generation');

//   try {
//     const prompt = destinationPromptTemplate(destinationName);
//     logger.debug({ prompt }, 'Generated AI prompt');

//     const generatedDestination = await generateAIData(prompt);

//     if (!generatedDestination) {
//       const errorMessage = 'AI service returned no data';
//       logger.warn({ destinationName }, errorMessage);
//       throw createAIServiceError(errorMessage, {
//         destinationName,
//       });
//     }

//     try {
//       const destinationData = JSON.parse(generatedDestination);
//       logger.debug({ destinationData }, 'Parsed AI response successfully');

//       if (!destinationData?.destinationName) {
//         const errorMessage = 'Missing required fields in destination data';
//         logger.error(
//           {
//             receivedData: destinationData,
//             expectedField: 'destinationName',
//             rawResponse: generatedDestination,
//           },
//           errorMessage,
//         );
//         throw createParsingError(errorMessage, {
//           receivedData: destinationData,
//           expectedField: 'destinationName',
//           rawResponse: generatedDestination,
//         });
//       }

//       logger.info({ destinationName }, 'Successfully generated destination');
//       return destinationData;
//     } catch (parseError) {
//       const errorMessage = 'Failed to parse AI response';
//       logger.error(
//         { error: parseError, rawResponse: generatedDestination },
//         errorMessage,
//       );
//       throw createParsingError(errorMessage, {
//         error:
//           parseError instanceof Error
//             ? parseError.message
//             : 'Unknown parse error',
//         rawResponse: generatedDestination,
//       });
//     }
//   } catch (error) {
//     if (isAIServiceError(error)) {
//       logger.warn({ error }, 'AI service error encountered');
//       throw error;
//     }

//     const errorMessage = 'Failed to generate destination data';
//     logger.error({ error, destinationName }, errorMessage);
//     throw createDestinationGenerationError(errorMessage, {
//       originalError: error instanceof Error ? error.message : 'Unknown error',
//       destinationName,
//     });
//   }
// };
