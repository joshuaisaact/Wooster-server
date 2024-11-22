import { Request, Response } from 'express';
import { deleteDestinationById } from '../../services/destination-service';
import { logger } from '../../utils/logger';
import { createValidationError } from '@/utils/error-handlers';

export const handleDeleteDestination = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { destinationId } = req.params;
  const destinationIdNumber = Number(destinationId);

  if (isNaN(destinationIdNumber)) {
    throw createValidationError('Invalid destination ID');
  }

  const deletedDestination = await deleteDestinationById(destinationIdNumber);

  logger.info(
    { destinationId: destinationIdNumber },
    'Destination deleted successfully',
  );

  return res.status(200).json({
    message: 'Destination deleted successfully:',
    deletedDestination,
  });
};
