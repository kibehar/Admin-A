import { Router } from "express";
import {
  addSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: Supplier Management APIs
 */

/**
 * @swagger
 * /suppliers/add:
 *   post:
 *     summary: Add a new supplier
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *               streetNumber:
 *                 type: string
 *                 example: "A1"
 *               houseNumber:
 *                 type: string
 *                 example: "12"
 *               contact:
 *                 type: string
 *                 example: "+123456789"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *     responses:
 *       201:
 *         description: Supplier added successfully
 *       500:
 *         description: Error adding supplier
 */
router.post("/add", addSupplier);

/**
 * @swagger
 * /suppliers/list:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: List of all suppliers
 *       404:
 *         description: No suppliers found
 *       500:
 *         description: Error fetching suppliers
 */
router.get("/list", getAllSuppliers);

/**
 * @swagger
 * /suppliers/{id}:
 *   get:
 *     summary: Get a supplier by ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier details
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Error fetching supplier
 */
router.get("/:id", getSupplierById);

/**
 * @swagger
 * /suppliers/update/{id}:
 *   put:
 *     summary: Update a supplier by ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Jane"
 *               lastName:
 *                 type: string
 *                 example: "Smith"
 *               address:
 *                 type: string
 *                 example: "456 Elm St"
 *               streetNumber:
 *                 type: string
 *                 example: "B2"
 *               houseNumber:
 *                 type: string
 *                 example: "34"
 *               contact:
 *                 type: string
 *                 example: "+987654321"
 *               email:
 *                 type: string
 *                 example: "jane@example.com"
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Error updating supplier
 */
router.put("/update/:id", updateSupplier);

/**
 * @swagger
 * /suppliers/delete/{id}:
 *   delete:
 *     summary: Delete a supplier by ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Error deleting supplier
 */
router.delete("/delete/:id", deleteSupplier);

export default router;
