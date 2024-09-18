import express from 'express';
import getTrip from '../controllers/getTrip';

const router = express.Router();

router.get('/trips', getTrip);

export default router;
