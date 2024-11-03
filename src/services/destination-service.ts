import { and, desc, eq } from 'drizzle-orm';
import { db, savedDestinations } from '../db';
import { destinations } from '../db/tables/destinations';
import { NewDestination } from '../types/destination-type';

export const fetchDestinationsFromDB = async () => {
  try {
    const destinationsData = await db.select().from(destinations);
    return destinationsData;
  } catch (error) {
    throw new Error(
      `Error fetching destinations: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
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
      throw new Error(`Destination with name ${destinationName} not found`);
    }

    return destination;
  } catch (error) {
    throw new Error(
      `Error fetching destination with name ${destinationName}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
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
      throw new Error(`Destination with name ${location} not found`);
    }

    return destination.destinationId;
  } catch (error) {
    throw new Error(
      `Error fetching destination with name ${location}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
};

export const addDestination = async (destinationData: NewDestination) => {
  try {
    const [insertedDestination] = await db
      .insert(destinations)
      .values(destinationData)
      .returning();

    return insertedDestination;
  } catch (error) {
    throw new Error(
      `Failed to insert destination: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
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
      throw new Error(`No destination found with ID ${destinationId}`);
    }

    return deletedDestination;
  } catch (error) {
    throw new Error(
      `Error deleting destination with ID ${destinationId}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
};

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
