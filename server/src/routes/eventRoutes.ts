import express from 'express';
import {
    listEvents,
    listMyEvents,
    createEvent,
    updateEvent,
    registerForEvent,
    unregisterFromEvent,
    toggleBookmark,
} from '../controllers/eventController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', listEvents);
router.get('/mine', protect, listMyEvents);
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.post('/:id/register', protect, registerForEvent);
router.post('/:id/unregister', protect, unregisterFromEvent);
router.post('/:id/bookmark', protect, toggleBookmark);

export default router;
