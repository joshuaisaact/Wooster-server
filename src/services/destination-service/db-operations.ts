import { eq } from 'drizzle-orm';
import { db, destinations } from '../../db';
import { NewDestination } from '../../types/destination-type';

export const fetchDestinations = async () => {
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
  console.log('1. Starting findDestinationByName with:', destinationName);

  try {
    const normalizedName = normalizeDestinationName(destinationName);
    console.log('2. Normalized name:', normalizedName);

    const query = db
      .select()
      .from(destinations)
      .where(eq(destinations.normalizedName, normalizedName));
    console.log('3. Query:', query.toSQL()); // Log the SQL query if possible

    const result = await query;
    console.log('4. Database query result:', result);

    if (!result || result.length === 0) {
      console.log('5. No destination found for:', destinationName);
      return null;
    }

    console.log('6. Returning found destination:', result[0]);
    return result[0];
  } catch (error) {
    console.error('7. Error in findDestinationByName:', {
      error,
      destinationName,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error(
      `Error finding destination with name ${destinationName}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
};
