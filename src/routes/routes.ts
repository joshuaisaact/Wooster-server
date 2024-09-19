import express from 'express';
import getTrips from '../controllers/getTrips';
import newTrip from '../controllers/newTrip';

const router = express.Router();

router.get('/trips', getTrips);
router.post('/newtrip', newTrip);

export default router;
