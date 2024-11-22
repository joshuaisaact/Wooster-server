import { Request, Response } from 'express';
import { deleteSavedDestination } from '../../services/saved-destination-service/';
import { createValidationError } from '../../utils/error-handlers';

export const handleDeleteSavedDestination = async (
  req: Request,
  res: Response,
) => {
  const { destinationId } = req.params;
  const userId = req.user!.id;

  if (!destinationId || isNaN(Number(destinationId))) {
    throw createValidationError('Valid destination ID is required');
  }

  await deleteSavedDestination(userId, Number(destinationId));

  return res.status(200).json({
    message: 'Saved destination deleted successfully',
  });
};
