import { desc, eq } from 'drizzle-orm';
import { activities, db, destinations } from '../../db';
import { NewDestination } from '../../types/destination-type';
import {
  createDBQueryError,
  createDBNotFoundError,
  isServiceError,
  createDestinationGenerationError,
} from '../../types/errors';
import { logger } from '../../utils/logger';
import { generateNewDestination } from './destination-generator';

export const fetchDestinations = async () => {
  try {
    const destinationsData = await db.select().from(destinations);
    logger.info('Fetched all destinations successfully');
    return destinationsData;
  } catch (error) {
    logger.error({ error }, 'Error fetching destinations');
    throw createDBQueryError('Error fetching destinations', {
      originalError: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Fetch a single destination by name
export const fetchDestinationDetailsByName = async (
  destinationName: string,
) => {
  try {
    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.destinationName, destinationName));

    if (!destination) {
      const errorMessage = `Destination with name ${destinationName} not found`;
      logger.warn({ destinationName }, errorMessage);
      throw createDBNotFoundError(errorMessage, { destinationName });
    }

    logger.info({ destinationName }, 'Fetched destination details');
    return destination;
  } catch (error) {
    logger.error(
      { error, destinationName },
      'Error fetching destination details',
    );
    throw createDBQueryError(
      `Error fetching destination with name ${destinationName}`,
      {
        originalError: error instanceof Error ? error.message : 'Unknown error',
      },
    );
  }
};

export const fetchDestinationIdByName = async (location: string) => {
  try {
    const [destination] = await db
      .select({ destinationId: destinations.destinationId })
      .from(destinations)
      .where(eq(destinations.destinationName, location));

    if (!destination) {
      const errorMessage = `Destination with name ${location} not found`;
      logger.warn({ location }, errorMessage);
      throw createDBNotFoundError(errorMessage, { location });
    }

    logger.info({ location }, 'Fetched destination ID');
    return destination.destinationId;
  } catch (error) {
    logger.error({ error, location }, 'Error fetching destination ID');
    throw createDBQueryError(
      `Error fetching destination with name ${location}`,
      {
        originalError: error instanceof Error ? error.message : 'Unknown error',
      },
    );
  }
};

export const addDestination = async (destinationData: NewDestination) => {
  try {
    const normalizedName = normalizeDestinationName(
      destinationData.destinationName,
    );

    const [insertedDestination] = await db
      .insert(destinations)
      .values({
        ...destinationData,
        normalizedName,
      })
      .returning();

    logger.info({ destinationData }, 'Inserted destination successfully');
    return insertedDestination;
  } catch (error) {
    logger.error({ error, destinationData }, 'Error inserting destination');
    throw createDBQueryError('Failed to insert destination', {
      originalError: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Delete a destination by ID
export const deleteDestinationById = async (destinationId: number) => {
  try {
    const deletedDestination = await db
      .delete(destinations)
      .where(eq(destinations.destinationId, destinationId))
      .returning();

    if (!deletedDestination || deletedDestination.length === 0) {
      const errorMessage = `No destination found with ID ${destinationId}`;
      logger.warn({ destinationId }, errorMessage);
      throw createDBNotFoundError(errorMessage, { destinationId });
    }

    logger.info({ destinationId }, 'Deleted destination successfully');
    return deletedDestination;
  } catch (error) {
    logger.error({ error, destinationId }, 'Error deleting destination');
    throw createDBQueryError(
      `Error deleting destination with ID ${destinationId}`,
      {
        originalError: error instanceof Error ? error.message : 'Unknown error',
      },
    );
  }
};

export const normalizeDestinationName = (name: string): string => {
  return (
    name
      .trim()
      .toLowerCase()
      // Replace multiple spaces with single space
      .replace(/\s+/g, ' ')
      // Remove special characters except spaces and hyphens
      .replace(/[^a-z0-9\s-]/g, '')
      // Replace spaces with hyphens
      .replace(/\s/g, '-')
  );
};

export const findDestinationByName = async (destinationName: string) => {
  try {
    const normalizedName = normalizeDestinationName(destinationName);

    const [destination] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.normalizedName, normalizedName));

    return destination || null;
  } catch (error) {
    throw new Error(
      `Error finding destination with name ${destinationName}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
};

export const fetchActivitiesByDestinationName = async (
  destinationName: string,
) => {
  try {
    const destination = await fetchDestinationDetailsByName(destinationName);

    const activitiesList = await db
      .select()
      .from(activities)
      .where(eq(activities.locationId, destination.destinationId))
      .orderBy(desc(activities.createdAt));

    logger.info({ destinationName }, 'Fetched activities successfully');
    return activitiesList;
  } catch (error) {
    logger.error({ error, destinationName }, 'Error fetching activities');
    throw createDBQueryError(
      `Error fetching activities for destination ${destinationName}`,
      {
        originalError: error instanceof Error ? error.message : 'Unknown error',
      },
    );
  }
};

export async function getOrCreateDestination(location: string) {
  try {
    const existingDestination = await findDestinationByName(location);

    if (existingDestination) {
      logger.info({ location }, 'Found existing destination');
      return existingDestination;
    }

    logger.info({ location }, 'Creating new destination');
    try {
      const destinationData = await generateNewDestination(location);
      return await addDestination(destinationData);
    } catch (error) {
      throw createDestinationGenerationError(
        'Failed to generate destination data',
        { location, error },
      );
    }
  } catch (error) {
    logger.error({ error, location }, 'Failed to process destination');

    if (isServiceError(error)) {
      throw error;
    }

    throw createDBQueryError('Failed to process destination', {
      location,
      error,
    });
  }
}
