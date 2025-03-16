import { Router } from 'express';
import { signup, login } from '../controllers/authController';
import { updateAdminProfile , getAdminProfile } from '../controllers/profileController';  
import authenticateJWT from '../middleware/authMiddleware';

const router = Router();

router.post('/signup', signup);

router.post('/login', login);

router.get('/profile', authenticateJWT, getAdminProfile);

router.put('/profile', authenticateJWT, updateAdminProfile);



export default router;
