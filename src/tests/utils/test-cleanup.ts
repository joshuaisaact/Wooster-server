import { db } from '@/db'; // Ensure you're importing the Drizzle DB instance
import { destinations } from '@/db'; // Import your destination table schema
import { mockDBDestinations } from '../fixtures/destinations';
import { eq } from 'drizzle-orm';

async function cleanupTestData() {
  console.log('Cleaning up test data...');

  // Using Drizzle's delete method to remove destinations
  const deletionPromises = Object.values(mockDBDestinations).map(
    async (destination) => {
      try {
        console.log('Deleting destination:', destination.destinationName);

        // Delete using Drizzle ORM's delete method (just like in production)
        const deletedDestination = await db
          .delete(destinations)
          .where(eq(destinations.destinationName, destination.destinationName))
          .returning();

        if (deletedDestination.length === 0) {
          console.error(
            'No destination found to delete:',
            destination.destinationName,
          );
        } else {
          console.log('Deleted destination:', destination.destinationName);
        }
      } catch (error) {
        console.error(
          'Error during deletion for destination:',
          destination.destinationName,
          error,
        );
      }
    },
  );

  // Wait for all deletions to finish
  await Promise.all(deletionPromises);

  console.log('Test data cleanup completed.');
}

export default cleanupTestData;
