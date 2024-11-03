import express from 'express';
import handleGetDestinationByName from '../controllers/get-destination-by-name';
import deleteTrip from '../controllers/delete-trip';
import register from '../controllers/auth/register';
import login from '../controllers/auth/login';
import logout from '../controllers/auth/logout';
import { requireAuth } from '../middleware/auth-middleware';
import handleGetDestinations from '../controllers/get-all-destinations';
import handleAddDestination from '../controllers/add-destination';
import handleDeleteDestination from '../controllers/delete-destination';
import handleGetTrips from '../controllers/get-all-trips';
import handleAddTrip from '../controllers/add-trip';
import { llmLimiter } from '../middleware/rate-limits';
import { handleGetSavedDestinations } from '../controllers/get-saved-destination';
import { handleDeleteSavedDestination } from '../controllers/delete-saved-destination';
import { handleAddSavedDestination } from '../controllers/add-saved-destination';

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
router.post('/trips', llmLimiter, requireAuth, handleAddTrip); // Changed to plural
router.delete('/trips/:tripId', requireAuth, deleteTrip);

export default router;
