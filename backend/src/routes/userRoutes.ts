import express from 'express';
import { createUser, updateUser, deleteUser, getAllUsers} from "../controllers/userController";
import authenticateJWT from '../middleware/authMiddleware';
import { getUserProfile, updateUserProfile } from '../controllers/UserProfileController';

const router = express.Router();

router.post("/usercreation", authenticateJWT, createUser);
router.put("/update/:userId", updateUser);  
router.delete("/delete/:userId", deleteUser);
router.get('/profile', authenticateJWT, getUserProfile);
router.get("/all", getAllUsers);
router.put('/profile', authenticateJWT, updateUserProfile);

export default router;
