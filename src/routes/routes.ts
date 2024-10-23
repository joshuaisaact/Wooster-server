import express from 'express';
import handleGetDestinationByName from '../controllers/get-destination-by-name';
import deleteTrip from '../controllers/delete-trip';
import register from '../controllers/auth/register';
import login from '../controllers/auth/login';
import logout from '../controllers/auth/logout';
import { authenticate } from '../middleware/auth-middleware';
import postTrip from '../controllers/post-trip';
import handleGetDestinations from '../controllers/get-all-destinations';
import handleAddDestination from '../controllers/add-destination';
import handleDeleteDestination from '../controllers/delete-destination';
import handleGetTrips from '../controllers/get-all-trips';

const router = express.Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', authenticate, logout);

router.get('/destinations/:destinationName', handleGetDestinationByName);
router.delete('/destinations/:destinationId', handleDeleteDestination);

router.get('/destinations', handleGetDestinations);

router.delete('/trips/:tripId', deleteTrip);

router.get('/trips', handleGetTrips);

router.post('/destination', handleAddDestination);
router.post('/trip', postTrip);

export default router;
