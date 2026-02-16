import express from 'express';
import { register, login, getMe, getProfile, updateProfile, getUsersByRole, searchUsers, switchRole } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { uploadAvatar } from '../controllers/userController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/profile/:id', getProfile);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.get('/users', getUsersByRole);
router.get('/search', searchUsers);
router.put('/switch-role', protect, switchRole);

export default router;
