import express from 'express';
import getTrips from '../controllers/getTrips';
import newTrip from '../controllers/newTrip';
import getTripsDB from '../controllers/getTripsDB';
import getDestinations from '../controllers/getDestinastions';
import getDestinationDetails from '../controllers/getDestinationDetails';
import newDestination from '../controllers/newDestination';
import newTripdb from '../controllers/newTripdb';
import deleteDestination from '../controllers/deleteDestination';
import deleteTrip from '../controllers/deleteTrip';

const router = express.Router();

router.get('/destinations', getDestinations);
router.get('/destinations/:destinationId', getDestinationDetails); // New route for fetching destination details
router.get('/trips', getTrips);
router.get('/tripsdb', getTripsDB);

router.post('/newdestination', newDestination);
router.post('/newtrip', newTrip);
router.post('/newtripdb', newTripdb);

router.delete('/destinations/:destinationId', deleteDestination);
router.delete('/trips/:tripId', deleteTrip);

export default router;
