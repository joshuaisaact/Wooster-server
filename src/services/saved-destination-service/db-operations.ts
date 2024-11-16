import { and, desc, eq } from 'drizzle-orm';
import { db, destinations, savedDestinations } from '../../db';
import { createDBQueryError, createDBNotFoundError } from '../../types/errors';
import { logger } from '../../utils/logger';

export const fetchSavedDestinations = async (userId: string) => {
  try {
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
      ...entry, // Brings in all savedDestinations fields
      ...entry.destination, // Flattens all fields in destination into the root object
    }));

    logger.info({ userId }, 'Fetched saved destinations successfully');
    return flattenedList;
  } catch (error) {
    logger.error({ error, userId }, 'Error fetching saved destinations');
    throw createDBQueryError('Error fetching saved destinations', {
      originalError: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const addSavedDestination = async (
  userId: string,
  destinationId: number,
  notes?: string,
  isVisited: boolean = false,
) => {
  try {
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
  } catch (error) {
    logger.error(
      { error, userId, destinationId },
      'Error inserting saved destination',
    );
    throw createDBQueryError('Failed to save destination', {
      originalError: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateSavedDestination = async (
  userId: string,
  destinationId: number,
  updates: {
    notes?: string;
    isVisited?: boolean;
  },
) => {
  try {
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
      const errorMessage = `No saved destination found for user ${userId} and destination ${destinationId}`;
      logger.warn({ userId, destinationId }, errorMessage);
      throw createDBNotFoundError(errorMessage, { userId, destinationId });
    }

    logger.info(
      { userId, destinationId },
      'Updated saved destination successfully',
    );
    return updatedDestination;
  } catch (error) {
    logger.error(
      { error, userId, destinationId },
      'Error updating saved destination',
    );
    throw createDBQueryError('Error updating saved destination', {
      originalError: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteSavedDestination = async (
  userId: string,
  destinationId: number,
) => {
  try {
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
      const errorMessage = `No saved destination found for user ${userId} and destination ${destinationId}`;
      logger.warn({ userId, destinationId }, errorMessage);
      throw createDBNotFoundError(errorMessage, { userId, destinationId });
    }

    logger.info(
      { userId, destinationId },
      'Deleted saved destination successfully',
    );
    return deletedDestination;
  } catch (error) {
    logger.error(
      { error, userId, destinationId },
      'Error deleting saved destination',
    );
    throw createDBQueryError('Error deleting saved destination', {
      originalError: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const findSavedDestinationByUserAndDest = async (
  userId: string,
  destinationId: number,
) => {
  try {
    const foundDestination = await db
      .select()
      .from(savedDestinations)
      .where(
        and(
          eq(savedDestinations.userId, userId),
          eq(savedDestinations.destinationId, destinationId),
        ),
      )
      .limit(1);

    return foundDestination[0] || null;
  } catch (error) {
    logger.error(
      { error, userId, destinationId },
      'Error finding saved destination',
    );
    throw createDBQueryError(
      `Error finding saved destination for user ${userId} and destination ${destinationId}`,
      {
        originalError: error instanceof Error ? error.message : 'Unknown error',
      },
    );
  }
};
