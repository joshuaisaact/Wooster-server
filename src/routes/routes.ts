import express from 'express';
import getTrips from '../controllers/get-trips';
import getDestinations from '../controllers/get-destinations';
import getDestinationDetails from '../controllers/get-destination-details';
import postDestination from '../controllers/post-destination';
import deleteDestination from '../controllers/delete-destination';
import deleteTrip from '../controllers/delete-trip';
import register from '../controllers/auth/register';
import login from '../controllers/auth/login';
import logout from '../controllers/auth/logout';
import { authenticate } from '../middleware/auth-middleware';
import postTrip from '../controllers/post-trip';

const router = express.Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', authenticate, logout);

router.get('/destinations/:destinationId', getDestinationDetails);
router.delete('/destinations/:destinationId', deleteDestination);

router.get('/destinations', getDestinations);

router.delete('/trips/:tripId', deleteTrip);

router.get('/trips', getTrips);

router.post('/destination', postDestination);
router.post('/trip', postTrip);

export default router;
