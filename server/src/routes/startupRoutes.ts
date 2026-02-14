import express from 'express';
import { createStartup, getMyStartups, getAllStartups, updateStartup } from '../controllers/startupController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, createStartup);
router.get('/my', protect, getMyStartups);
router.get('/', getAllStartups);
router.put('/:id', protect, updateStartup);

export default router;
