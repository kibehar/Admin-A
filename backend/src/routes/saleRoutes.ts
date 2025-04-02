import { Router } from "express";
import { recordSale, getAllSales } from "../controllers/saleController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Sales Management APIs
 */

/**
 * @swagger
 * /sales/record-sale:
 *   post:
 *     summary: Record a new sale
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "60b8b7f9a2e9a024d0c56e3a"
 *               quantity:
 *                 type: number
 *                 example: 5
 *               price:
 *                 type: number
 *                 example: 20.5
 *               warehouseId:
 *                 type: string
 *                 example: "60b8b7f9a2e9a024d0c56e3b"
 *               paymentStatus:
 *                 type: string
 *                 enum: [Paid, Pending]
 *                 example: "Paid"
 *     responses:
 *       201:
 *         description: Sale recorded successfully
 *       400:
 *         description: Not enough stock in inventory or warehouse
 *       404:
 *         description: Product or Warehouse not found
 *       500:
 *         description: Error recording sale
 */
router.post("/record-sale", recordSale);

/**
 * @swagger
 * /sales/list:
 *   get:
 *     summary: Get all sales records
 *     tags: [Sales]
 *     responses:
 *       200:
 *         description: List of all sales records
 *       500:
 *         description: Error fetching sales records
 */
router.get("/list", getAllSales);

export default router;
