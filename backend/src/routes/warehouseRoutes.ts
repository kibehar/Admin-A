import { Router } from "express";
import { createWarehouse, getAllWarehouses } from "../controllers/warehouseController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Warehouse
 *   description: Warehouse Management APIs
 */

/**
 * @swagger
 * /warehouses/add-warehouse:
 *   post:
 *     summary: Add a new warehouse
 *     tags: [Warehouse]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Main Warehouse"
 *               location:
 *                 type: string
 *                 example: "New York"
 *     responses:
 *       201:
 *         description: Warehouse added successfully
 *       400:
 *         description: Warehouse already exists
 *       500:
 *         description: Server error
 */
router.post("/add-warehouse", createWarehouse);

/**
 * @swagger
 * /warehouses/list:
 *   get:
 *     summary: Get all warehouses
 *     tags: [Warehouse]
 *     responses:
 *       200:
 *         description: List of all warehouses
 *       500:
 *         description: Error fetching warehouses
 */
router.get("/list", getAllWarehouses);

export default router;
