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

const router = express.Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);

// Public destination routes
router.get('/destination/:destinationName', handleGetDestinationByName);
router.get('/destinations', handleGetDestinations);

// Protected destination routes
router.post('/destinations', llmLimiter, requireAuth, handleAddDestination);
router.delete(
  '/destinations/:destinationId',
  requireAuth,
  handleDeleteDestination,
);

// Protected saved destination routes
router.get('/saved-destinations', requireAuth, handleGetSavedDestinations);
router.post('/saved-destinations', requireAuth, handleAddSavedDestination);
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
