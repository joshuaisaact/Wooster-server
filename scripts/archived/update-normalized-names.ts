import { eq } from 'drizzle-orm';
import { db, destinations } from '../../src/db';
import 'dotenv/config';

const normalizeDestinationName = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s/g, '-');
};

async function updateExistingDestinations() {
  try {
    const allDestinations = await db.select().from(destinations);

    console.log(`Found ${allDestinations.length} destinations to update`);

    for (const destination of allDestinations) {
      const normalizedName = normalizeDestinationName(
        destination.destinationName,
      );

      await db
        .update(destinations)
        .set({ normalizedName })
        .where(eq(destinations.destinationId, destination.destinationId));

      console.log(
        `Updated "${destination.destinationName}" -> "${normalizedName}"`,
      );
    }

    console.log('All destinations updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating destinations:', error);
    process.exit(1);
  }
}

updateExistingDestinations();
