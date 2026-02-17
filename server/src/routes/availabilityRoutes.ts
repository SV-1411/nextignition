import express from 'express';
import { protect } from '../middleware/auth';
import {
    getMyAvailability,
    setAvailability,
    deleteAvailability,
    getExpertAvailability,
} from '../controllers/availabilityController';

const router = express.Router();

// Expert routes (protected)
router.get('/my-availability', protect, getMyAvailability);
router.post('/availability', protect, setAvailability);
router.delete('/availability/:dayOfWeek', protect, deleteAvailability);

// Public route to view expert availability
router.get('/expert/:expertId', getExpertAvailability);

export default router;
