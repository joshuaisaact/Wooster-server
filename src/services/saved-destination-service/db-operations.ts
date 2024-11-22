import { and, desc, eq } from 'drizzle-orm';
import { db, destinations, savedDestinations } from '../../db';
import {
  createDBQueryError,
  createDBNotFoundError,
  isServiceError,
  createServiceError,
} from '../../types/errors';
import { logger } from '../../utils/logger';
import { executeDbOperation } from '@/utils/db-utils';

export const fetchSavedDestinations = (userId: string) =>
  executeDbOperation(
    async () => {
      const savedDestinationsList = await db
        .select({
          id: savedDestinations.id,
          userId: savedDestinations.userId,
          destinationId: savedDestinations.destinationId,
          createdAt: savedDestinations.createdAt,
          notes: savedDestinations.notes,
          isVisited: savedDestinations.isVisited,
          destination: destinations,
        })
        .from(savedDestinations)
        .leftJoin(
          destinations,
          eq(savedDestinations.destinationId, destinations.destinationId),
        )
        .where(eq(savedDestinations.userId, userId))
        .orderBy(desc(savedDestinations.createdAt));

      const flattenedList = savedDestinationsList.map((entry) => ({
        ...entry,
        ...entry.destination,
      }));

      logger.info({ userId }, 'Fetched saved destinations successfully');
      return flattenedList;
    },
    'Error fetching saved destinations',
    { context: { userId } },
  );

export const saveDestinationForUser = async (
  destinationId: number,
  userId: string,
) => {
  try {
    const existingSaved = await findSavedDestinationByUserAndDest(
      userId,
      destinationId,
    );

    if (existingSaved) {
      throw createServiceError(
        'Destination is already saved',
        409,
        'DESTINATION_ALREADY_SAVED',
        { userId, destinationId },
      );
    }

    return await addSavedDestination(userId, destinationId);
  } catch (error) {
    if (isServiceError(error)) {
      throw error;
    }

    logger.error(
      { error, destinationId, userId },
      'Failed to save destination',
    );
    throw createDBQueryError('Failed to save destination', {
      userId,
      destinationId,
      error,
    });
  }
};

export const addSavedDestination = (
  userId: string,
  destinationId: number,
  notes?: string,
  isVisited: boolean = false,
) =>
  executeDbOperation(
    async () => {
      const [savedDestination] = await db
        .insert(savedDestinations)
        .values({
          userId,
          destinationId,
          notes,
          isVisited,
        })
        .returning();

      logger.info(
        { userId, destinationId },
        'Inserted saved destination successfully',
      );
      return savedDestination;
    },
    'Failed to save destination',
    { context: { userId, destinationId } },
  );

export const updateSavedDestination = (
  userId: string,
  destinationId: number,
  updates: {
    notes?: string;
    isVisited?: boolean;
  },
) =>
  executeDbOperation(
    async () => {
      const [updatedDestination] = await db
        .update(savedDestinations)
        .set(updates)
        .where(
          and(
            eq(savedDestinations.userId, userId),
            eq(savedDestinations.destinationId, destinationId),
          ),
        )
        .returning();

      if (!updatedDestination) {
        throw createDBNotFoundError(
          `No saved destination found for user ${userId} and destination ${destinationId}`,
          { userId, destinationId },
        );
      }

      logger.info(
        { userId, destinationId },
        'Updated saved destination successfully',
      );
      return updatedDestination;
    },
    'Error updating saved destination',
    { context: { userId, destinationId } },
  );

export const deleteSavedDestination = (userId: string, destinationId: number) =>
  executeDbOperation(
    async () => {
      const [deletedDestination] = await db
        .delete(savedDestinations)
        .where(
          and(
            eq(savedDestinations.userId, userId),
            eq(savedDestinations.destinationId, destinationId),
          ),
        )
        .returning();

      if (!deletedDestination) {
        throw createDBNotFoundError(
          `No saved destination found for user ${userId} and destination ${destinationId}`,
          { userId, destinationId },
        );
      }

      logger.info(
        { userId, destinationId },
        'Deleted saved destination successfully',
      );
      return deletedDestination;
    },
    'Error deleting saved destination',
    { context: { userId, destinationId } },
  );

export const findSavedDestinationByUserAndDest = (
  userId: string,
  destinationId: number,
) =>
  executeDbOperation(
    async () => {
      const [foundDestination] = await db
        .select()
        .from(savedDestinations)
        .where(
          and(
            eq(savedDestinations.userId, userId),
            eq(savedDestinations.destinationId, destinationId),
          ),
        )
        .limit(1);

      return foundDestination || null;
    },
    'Error finding saved destination',
    {
      context: { userId, destinationId },
    },
  );
