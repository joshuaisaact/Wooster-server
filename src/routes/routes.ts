import express from 'express';
import getTrips from '../controllers/getTrips';
import getDestinations from '../controllers/getDestinastions';
import getDestinationDetails from '../controllers/getDestinationDetails';
import newDestination from '../controllers/newDestination';
import newTripdb from '../controllers/newTripdb';
import deleteDestination from '../controllers/deleteDestination';
import deleteTrip from '../controllers/deleteTrip';

const router = express.Router();

router.get('/destinations/:destinationId', getDestinationDetails);
router.delete('/destinations/:destinationId', deleteDestination);

router.get('/destinations', getDestinations);

router.delete('/trips/:tripId', deleteTrip);

router.get('/trips', getTrips);

router.post('/destination', newDestination);
router.post('/trip', newTripdb);

export default router;
