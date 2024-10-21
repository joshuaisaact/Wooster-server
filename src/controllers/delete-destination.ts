import { Request, Response } from 'express';
import { deleteDestinationById } from '../services/destination-service';

const deleteDestination = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { destinationId } = req.params;

  try {
    const deletedDestination = await deleteDestinationById(destinationId);

    if (!deletedDestination || deletedDestination.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    console.log('Destination deleted successfully');
    return res
      .status(200)
      .json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('Error deleting destination:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export default deleteDestination;
