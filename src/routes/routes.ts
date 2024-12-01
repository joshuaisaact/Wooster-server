import express from 'express';
import { requireAuth } from '../middleware/auth-middleware';

import { llmLimiter } from '../middleware/rate-limits';
import {
  handleAddDestination,
  handleGetDestinationByName,
  handleGetDestinations,
  handleDeleteDestination,
} from '../controllers/destinations';
import {
  handleAddSavedDestination,
  handleGetSavedDestinations,
  handleDeleteSavedDestination,
} from '../controllers/saved-destinations';
import {
  handleDeleteTrip,
  handleAddTrip,
  handleGetTrips,
} from '../controllers/trips';
import { handleGetTrip } from '../controllers/trips/get-trip';
import { handleGetDestinationActivities } from '../controllers/destinations/get-destination-activities';
import { handleSearchDestinations } from '../controllers/destinations/search-destinations';
import { handleUpdateTrip } from '../controllers/trips/update-trip';
import { handleCreateShareLink } from '../controllers/trips/share';
import { handleGetSharedTrip } from '../controllers/trips/get-shared-trip';
import { handleReorderActivities } from '../controllers/activities/reorder-activities';

const router = express.Router();

// Public destination routes
router.get('/destinations/search', handleSearchDestinations);
router.get('/destination/:destinationName', handleGetDestinationByName);

// Protected destination routes
router.get('/destinations', requireAuth, handleGetDestinations);
router.get(
  '/destination/:destinationName/activities',
  requireAuth,
  handleGetDestinationActivities,
);

router.post('/destinations', llmLimiter, requireAuth, handleAddDestination);
router.delete(
  '/destinations/:destinationId',
  requireAuth,
  handleDeleteDestination,
);

// Protected saved destination routes
router.get('/saved-destinations', requireAuth, handleGetSavedDestinations);
router.post(
  '/saved-destinations/:destinationId',
  requireAuth,
  handleAddSavedDestination,
);
router.delete(
  '/saved-destinations/:destinationId',
  requireAuth,
  handleDeleteSavedDestination,
);

// Protected trip routes
router.get('/trips', requireAuth, handleGetTrips);
router.get('/trips/:id', requireAuth, handleGetTrip);
router.post('/trips', llmLimiter, requireAuth, handleAddTrip);
router.put('/trips/:tripId', requireAuth, handleUpdateTrip);
router.put(
  '/trips/:tripId/days/:dayNumber/reorder',
  requireAuth,
  handleReorderActivities,
);
router.delete('/trips/:tripId', requireAuth, handleDeleteTrip);

// Share routes
router.post('/trips/:tripId/share', requireAuth, handleCreateShareLink);
router.get('/shared/:shareCode', handleGetSharedTrip);

export default router;
