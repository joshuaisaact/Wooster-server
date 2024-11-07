import express from 'express';
import register from '../controllers/auth/register';
import login from '../controllers/auth/login';
import logout from '../controllers/auth/logout';
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

const router = express.Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);

// Public destination routes
router.get('/destinations/search', handleSearchDestinations);
router.get('/destination/:destinationName', handleGetDestinationByName);
router.get('/destinations', requireAuth, handleGetDestinations);

// Protected destination routes
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
router.delete('/trips/:tripId', requireAuth, handleDeleteTrip);

export default router;
