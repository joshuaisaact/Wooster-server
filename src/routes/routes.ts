import express from 'express';
import getTrips from '../controllers/getTrips';
import getDestinations from '../controllers/getDestinastions';
import getDestinationDetails from '../controllers/getDestinationDetails';
import newDestination from '../controllers/newDestination';
import newTripdb from '../controllers/newTripdb';
import deleteDestination from '../controllers/deleteDestination';
import deleteTrip from '../controllers/deleteTrip';
import register from '../controllers/auth/register';
import login from '../controllers/auth/login';
import logout from '../controllers/auth/logout';
import { authenticate } from '../middleware/authMiddleware';

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

router.post('/destination', newDestination);
router.post('/trip', newTripdb);

export default router;
