import express from 'express';
import { protect } from '../middleware/auth';
import {
    listCofounders,
    saveCofounder,
    listSavedCofounders,
    upsertMyCofounderProfile,
    getUserPublic,
} from '../controllers/cofounderController';

const router = express.Router();

router.get('/', listCofounders);
router.get('/saved', protect, listSavedCofounders);
router.post('/saved/:userId', protect, saveCofounder);

router.get('/users/:userId', getUserPublic);

router.put('/me', protect, upsertMyCofounderProfile);

export default router;
