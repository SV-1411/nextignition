import express from 'express';
import { register, login, getMe, getProfile, updateProfile, getUsersByRole, searchUsers, switchRole } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/profile/:id', getProfile);
router.put('/profile', protect, updateProfile);
router.get('/users', getUsersByRole);
router.get('/search', searchUsers);
router.put('/switch-role', protect, switchRole);

export default router;
