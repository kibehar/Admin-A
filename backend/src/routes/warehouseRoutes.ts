import { Router } from "express";
import {
  createWarehouse,
  getAllWarehouses,
  getWarehouseDetails,
  updateWarehouse,
  deleteWarehouse,
} from "../controllers/warehouseController";

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
 *             required:
 *               - name
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Warehouse added successfully
 */
router.post("/add-warehouse", createWarehouse);

/**
 * @swagger
 * /warehouses/list:
 *   get:
 *     summary: List all warehouses
 *     tags: [Warehouse]
 *     responses:
 *       200:
 *         description: List of warehouses
 */
router.get("/list", getAllWarehouses);

/**
 * @swagger
 * /warehouses/details/{warehouseId}:
 *   get:
 *     summary: Get warehouse item details
 *     tags: [Warehouse]
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         description: ID of the warehouse
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Warehouse details
 */
router.get("/details/:warehouseId", getWarehouseDetails);

/**
 * @swagger
 * /warehouses/update/{id}:
 *   put:
 *     summary: Update warehouse name and location
 *     tags: [Warehouse]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Warehouse ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Warehouse updated
 */
router.put("/update/:id", updateWarehouse);

/**
 * @swagger
 * /warehouses/delete/{id}:
 *   delete:
 *     summary: Delete a warehouse and return items to inventory
 *     tags: [Warehouse]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Warehouse ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Warehouse deleted
 */
router.delete("/delete/:id", deleteWarehouse);

export default router;
