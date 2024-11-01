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

const router = express.Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);

// Public destination routes
router.get('/destination/:destinationName', handleGetDestinationByName);
router.get('/destinations', handleGetDestinations);

// Protected routes (require authentication)
router.delete(
  '/destinations/:destinationId',
  requireAuth,
  handleDeleteDestination,
);
router.post('/destination', llmLimiter, requireAuth, handleAddDestination);

// Protected trip routes
router.get('/trips', requireAuth, handleGetTrips);
router.post('/trip', llmLimiter, requireAuth, handleAddTrip);
router.delete('/trips/:tripId', requireAuth, deleteTrip);

export default router;
