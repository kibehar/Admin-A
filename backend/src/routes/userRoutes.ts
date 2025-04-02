import express from 'express';
import { createUser, updateUser, deleteUser, getAllUsers } from "../controllers/userController";
import authenticateJWT from '../middleware/authMiddleware';
import { getUserProfile, updateUserProfile } from '../controllers/UserProfileController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users/usercreation:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
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
 *               - role
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
 *                 example: john.doe@example.com
 *               username:
 *                 type: string
 *                 example: johndoe123
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Secure@123"
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: User successfully created
 *       400:
 *         description: Bad request (e.g., missing fields or user already exists)
 *       500:
 *         description: Internal server error
 */
router.post("/usercreation", createUser);

/**
 * @swagger
 * /users/update/{userId}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully updated
 *       400:
 *         description: Validation error (e.g., email already in use)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/update/:userId", updateUser);

/**
 * @swagger
 * /users/delete/{userId}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/delete/:userId", deleteUser);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile successfully retrieved
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
router.get('/profile', authenticateJWT, getUserProfile);

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Get all users with pagination and search
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Number of users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for users (name, email, username)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter users by role
 *     responses:
 *       200:
 *         description: List of all users
 *       500:
 *         description: Error fetching users
 */
router.get("/all", getAllUsers);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
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
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile successfully updated
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.put('/profile', authenticateJWT, updateUserProfile);

export default router;
