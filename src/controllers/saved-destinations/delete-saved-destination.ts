import { Request, Response } from 'express';
import { deleteSavedDestination } from '../../services/saved-destination-service/';

export const handleDeleteSavedDestination = async (
  req: Request,
  res: Response,
) => {
  const { destinationId } = req.params;
  const userId = req.user!.id;

  try {
    if (!destinationId || isNaN(Number(destinationId))) {
      return res
        .status(400)
        .json({ error: 'Valid destination ID is required' });
    }

    await deleteSavedDestination(userId, Number(destinationId));

    return res.status(200).json({
      message: 'Saved destination deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting saved destination:', error);

    // Check for not found error
    if (
      error instanceof Error &&
      error.message.includes('No saved destination found')
    ) {
      return res.status(404).json({ error: 'Saved destination not found' });
    }

    return res
      .status(500)
      .json({ error: 'Failed to delete saved destination' });
  }
};
