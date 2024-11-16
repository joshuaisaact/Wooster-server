import { eq } from 'drizzle-orm';
import { db, destinations } from '../../src/db';
import 'dotenv/config';
import { logger } from '../../src/utils/logger';

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

    logger.info(`Found ${allDestinations.length} destinations to update`);

    for (const destination of allDestinations) {
      const normalizedName = normalizeDestinationName(
        destination.destinationName,
      );

      await db
        .update(destinations)
        .set({ normalizedName })
        .where(eq(destinations.destinationId, destination.destinationId));

      logger.info(
        `Updated "${destination.destinationName}" -> "${normalizedName}"`,
      );
    }

    logger.info('All destinations updated successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error updating destinations:', error);
    process.exit(1);
  }
}

updateExistingDestinations();
