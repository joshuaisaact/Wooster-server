import { and, desc, eq } from 'drizzle-orm';
import { db, destinations, savedDestinations } from '../../db';

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

    return savedDestinationsList;
  } catch (error) {
    throw new Error(
      `Error fetching saved destinations: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
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

    return savedDestination;
  } catch (error) {
    throw new Error(
      `Failed to save destination: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
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
      throw new Error(
        `No saved destination found for user ${userId} and destination ${destinationId}`,
      );
    }

    return updatedDestination;
  } catch (error) {
    throw new Error(
      `Error updating saved destination: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
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
      throw new Error(
        `No saved destination found for user ${userId} and destination ${destinationId}`,
      );
    }

    return deletedDestination;
  } catch (error) {
    throw new Error(
      `Error deleting saved destination: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
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
    throw new Error(
      `Error finding saved destination for user ${userId} and destination ${destinationId}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
};
