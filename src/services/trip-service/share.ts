import { db, sharedTrips } from '../../db';
import { executeDbOperation } from '../../utils/db-utils';
import { logger } from '../../utils/logger';

import { randomUUID } from 'crypto';

export const createShareLink = (tripId: number, userId: string) =>
  executeDbOperation(
    async () => {
      const shareCode = randomUUID().slice(0, 10);

      const [sharedTrip] = await db
        .insert(sharedTrips)
        .values({
          tripId,
          userId,
          shareCode,
        })
        .returning({
          id: sharedTrips.id,
          shareCode: sharedTrips.shareCode,
        });

      logger.info(
        { tripId, userId, shareCode },
        'Created share link successfully',
      );
      return sharedTrip;
    },
    'Failed to create share link',
    { context: { tripId, userId } },
  );
