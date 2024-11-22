import { Request, Response } from 'express';
import { deleteTripById } from '../../services/trip-service';
import { deleteItineraryDaysByTripId } from '../../services/itinerary-service';
import { logger } from '../../utils/logger';

export const handleDeleteTrip = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const tripId = Number(req.params.tripId);

  if (isNaN(tripId)) {
    return res.status(400).json({
      error: 'Invalid trip ID',
    });
  }

  try {
    await deleteItineraryDaysByTripId(tripId);

    const rowsDeleted = await deleteTripById(tripId);

    if (rowsDeleted === 0) {
      return res.status(404).json({
        error: 'Trip not found',
      });
    }

    logger.info(
      `Trip with ID ${tripId} and related itinerary deleted successfully`,
    );
    return res.status(200).json({
      message: 'Trip deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting trip:', error);
    return res.status(500).json({
      error: 'Something went wrong',
    });
  }
};
