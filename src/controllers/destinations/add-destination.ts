import { Request, Response } from 'express';

import { getOrCreateDestination } from '../../services/destination-service';
import { saveDestinationForUser } from '../../services/saved-destination-service';
import { logger } from '../../utils/logger';
import { createValidationError, isServiceError } from '../../types/errors';

interface CreateDestinationRequestBody {
  destination: string;
}

interface CreateDestinationRequestBody {
  destination: string;
}

export const handleAddDestination = async (
  req: Request<object, object, CreateDestinationRequestBody>,
  res: Response,
) => {
  try {
    const { destination } = req.body;
    const userId = req.user!.id;

    if (!destination?.trim()) {
      throw createValidationError('Destination is required');
    }

    const destinationRecord = await getOrCreateDestination(destination);
    const savedDestination = await saveDestinationForUser(
      destinationRecord.destinationId,
      userId,
    );

    return res.status(201).json({
      message: 'Destination saved successfully',
      destination: {
        ...destinationRecord,
        saved: savedDestination,
      },
    });
  } catch (error) {
    type ErrorDetail = {
      isServiceError: boolean;
      message: string;
      stack?: string;
      code?: string;
      name?: string;
      details?: unknown;
      fullError: string;
    };

    const errorDetails: ErrorDetail = {
      isServiceError: isServiceError(error),
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      code:
        error instanceof Error && 'code' in error
          ? (error as { code?: string }).code
          : undefined,
      name: error instanceof Error ? error.name : undefined,
      details:
        error instanceof Error && 'details' in error
          ? (error as { details?: unknown }).details
          : undefined,
      fullError: JSON.stringify(error, null, 2),
    };

    console.error('Full error details:', errorDetails);

    if (isServiceError(error)) {
      return res.status(error.status).json({
        error: error.message,
        code: error.code,
        details: error.details,
      });
    }

    logger.error({ error }, 'Unexpected error in handleAddDestination');
    console.error('Error in POST /api/destinations:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred',
      code: 'DB_QUERY_FAILED',
    });
  }
};
