import express from 'express';
import getTrips from '../controllers/getTrips';
import newTrip from '../controllers/newTrip';
import getTripsDB from '../controllers/getTripsDB';
import getDestinations from '../controllers/getDestinastions';
import newDestination from '../controllers/newDestination';

const router = express.Router();

router.get('/destinations', getDestinations);
router.get('/trips', getTrips);
router.get('/tripsdb', getTripsDB);

router.post('/newdestination', newDestination);
router.post('/newtrip', newTrip);

export default router;
