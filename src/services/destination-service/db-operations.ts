import { desc, eq } from 'drizzle-orm';
import { activities, db, destinations } from '../../db';
import { NewDestination } from '../../types/destination-type';
import {
  createDBQueryError,
  createDBNotFoundError,
  isServiceError,
  createDestinationGenerationError,
  createServiceError,
} from '../../types/errors';
import { logger } from '../../utils/logger';
import { generateDestinationData } from '../llm/generators/destination';
import { normalizeDestinationName } from './utils';
import { executeDbOperation } from '@/utils/db-utils';

export const fetchDestinations = () =>
  executeDbOperation(async () => {
    const destinationsData = await db.select().from(destinations);
    logger.info('Fetched all destinations successfully');
    return destinationsData;
  }, 'Error fetching destinations');

export const fetchDestinationDetailsByName = (destinationName: string) =>
  executeDbOperation(
    async () => {
      const [destination] = await db
        .select()
        .from(destinations)
        .where(eq(destinations.destinationName, destinationName));

      if (!destination) {
        throw createDBNotFoundError(
          `Destination ${destinationName} not found`,
          { destinationName },
        );
      }

      return destination;
    },
    'Error fetching destination details',
    {
      context: { destinationName },
    },
  );

export const addDestination = (destinationData: NewDestination) =>
  executeDbOperation(
    async () => {
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
    },
    'Failed to insert destination',
    { context: { destinationData } },
  );

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

export const fetchActivitiesByDestinationName = (destinationName: string) =>
  executeDbOperation(
    async () => {
      const destination = await fetchDestinationDetailsByName(destinationName);

      const activitiesList = await db
        .select()
        .from(activities)
        .where(eq(activities.locationId, destination.destinationId))
        .orderBy(desc(activities.createdAt));

      logger.info({ destinationName }, 'Fetched activities successfully');
      return activitiesList;
    },
    'Error fetching activities',
    { context: { destinationName } },
  );

export async function getOrCreateDestination(location: string) {
  try {
    try {
      const existingDestination = await fetchDestinationDetailsByName(location);
      logger.info({ location }, 'Found existing destination');
      return existingDestination;
    } catch (error) {
      if (!isServiceError(error) || error.code !== 'DB_NOT_FOUND') {
        throw error;
      }
    }

    logger.info({ location }, 'Creating new destination');
    const destinationData = await generateDestinationData(location);
    return await addDestination(destinationData);
  } catch (error) {
    // Handle specific creation errors
    if (error instanceof Error && 'code' in error && error.code === '23505') {
      throw createServiceError(
        'Destination already exists',
        409,
        'DESTINATION_EXISTS',
        { location },
      );
    }

    if (!isServiceError(error)) {
      throw createDestinationGenerationError(
        'Failed to generate destination data',
        { location, error },
      );
    }

    throw error;
  }
}
