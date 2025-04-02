import { Router } from 'express';
import { signup, login } from '../controllers/authController';
import { updateAdminProfile, getAdminProfile } from '../controllers/profileController';  
import authenticateJWT from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 *  /auth/signup:
 *   post:
 *     summary: Admin Signup
 *     description: Registers a new admin account.
 *     tags:
 *       - Admin Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - username
 *               - password
 *               - confirmPassword
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               username:
 *                 type: string
 *                 example: admin123
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Secure@123"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "Secure@123"
 *     responses:
 *       201:
 *         description: Admin registered successfully.
 *       400:
 *         description: Validation error (e.g., passwords don't match, username exists).
 *       500:
 *         description: Internal server error.
 */
router.post('/signup', signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Admin Login
 *     description: Logs in an admin using email or username and returns a JWT token.
 *     tags:
 *       - Admin Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailOrUsername
 *               - password
 *             properties:
 *               emailOrUsername:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Secure@123"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin login successful"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60d0fe4f5311236168a109ca"
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                     username:
 *                       type: string
 *                       example: admin123
 *                     role:
 *                       type: string
 *                       example: admin
 *       400:
 *         description: Invalid credentials.
 *       500:
 *         description: Internal server error.
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get Admin Profile
 *     description: Retrieves the profile of the logged-in admin.
 *     tags:
 *       - Admin Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *                 firstName:
 *                   type: string
 *                   example: John
 *                 lastName:
 *                   type: string
 *                   example: Doe
 *                 email:
 *                   type: string
 *                   example: admin@example.com
 *                 username:
 *                   type: string
 *                   example: admin123
 *       400:
 *         description: Admin not authenticated.
 *       404:
 *         description: Admin not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/profile', authenticateJWT, getAdminProfile);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Update Admin Profile
 *     description: Updates the profile details of the logged-in admin.
 *     tags:
 *       - Admin Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               username:
 *                 type: string
 *                 example: admin123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewSecure@123"
 *               confirmNewPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewSecure@123"
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Validation error (e.g., passwords don't match).
 *       404:
 *         description: Admin not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/profile', authenticateJWT, updateAdminProfile);

export default router;
