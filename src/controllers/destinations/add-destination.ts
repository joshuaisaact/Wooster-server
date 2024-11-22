import { Request, Response } from 'express';
import { getOrCreateDestination } from '../../services/destination-service';
import { saveDestinationForUser } from '../../services/saved-destination-service';

import { createValidationError } from '@/utils/error-handlers';

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
};
