import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { reorderActivities } from '../../services/activity-service/';

export const handleReorderActivities = async (req: Request, res: Response) => {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const dayNumber = parseInt(req.params.dayNumber, 10);
    const { updates } = req.body;

    // Basic validation
    if (isNaN(tripId) || isNaN(dayNumber)) {
      return res.status(400).json({
        message: 'Invalid trip ID or day number',
      });
    }

    if (!Array.isArray(updates) || updates.length === 0 || updates.length > 3) {
      return res.status(400).json({
        message: 'Updates must be an array of 1-3 activities',
      });
    }

    // Validate each update object
    const isValidUpdate = updates.every(
      (update) =>
        typeof update.activityId === 'number' &&
        typeof update.slotNumber === 'number' &&
        update.slotNumber >= 1 &&
        update.slotNumber <= 3,
    );

    if (!isValidUpdate) {
      return res.status(400).json({
        message:
          'Invalid update format. Each update must have activityId and slotNumber (1-3)',
      });
    }

    // Check for duplicate slots
    const slots = new Set(updates.map((u) => u.slotNumber));
    if (slots.size !== updates.length) {
      return res.status(400).json({
        message: 'Duplicate slot numbers are not allowed',
      });
    }

    const updatedActivities = await reorderActivities(
      tripId,
      dayNumber,
      updates,
    );

    return res.status(200).json({
      message: 'Activities reordered successfully',
      activities: updatedActivities,
    });
  } catch (error) {
    logger.error(error, 'Error reordering activities');

    return res.status(500).json({
      message: 'Error reordering activities',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
