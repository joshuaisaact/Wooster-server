import { Request, Response } from 'express';
import { deleteDestinationById } from '../../services/destination-service';
import { logger } from '../../utils/logger';
import { isServiceError } from '../../types/errors';

export const handleDeleteDestination = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { destinationId } = req.params;

  const destinationIdNumber = Number(destinationId);

  if (isNaN(destinationIdNumber)) {
    const errorMessage = 'Invalid destination ID';
    logger.warn({ destinationId }, errorMessage);
    return res.status(400).json({ error: errorMessage });
  }

  try {
    const deletedDestination = await deleteDestinationById(destinationIdNumber);

    logger.info(
      { destinationId: destinationIdNumber },
      'Destination deleted successfully',
    );
    return res
      .status(200)
      .json({
        message: 'Destination deleted successfully:',
        deletedDestination,
      });
  } catch (error) {
    if (isServiceError(error) && error.code === 'DB_NOT_FOUND') {
      logger.warn(
        { error, destinationId: destinationIdNumber },
        'Destination not found',
      );
      return res.status(404).json({ error: error.message });
    }

    logger.error(
      { error, destinationId: destinationIdNumber },
      'Error deleting destination',
    );
    return res.status(500).json({ error: 'Internal server error' });
  }
};
