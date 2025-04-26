import { Router } from "express";
import {
  getInventory,
  getInventoryById,
  addInventory,
  assignToWarehouse,
  deleteInventory,
  updateInventory,
  getLowStockItems,
  reorderStock,
  createPurchaseOrder,
  completePurchaseOrder,
} from "../controllers/inventoryController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory Management APIs
 */

/**
 * @swagger
 * /inventory/list:
 *   get:
 *     summary: Get all inventory items
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: List of all inventory items
 */
router.get("/list", getInventory);

/**
 * @swagger
 * /inventory/{id}:
 *   get:
 *     summary: Get inventory item by ID
 *     tags: [Inventory]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory item retrieved
 *       404:
 *         description: Item not found
 */
router.get("/:id", getInventoryById);

/**
 * @swagger
 * /inventory/add-item:
 *   post:
 *     summary: Add a new inventory item
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *               supplier:
 *                 type: string
 *               stock:
 *                 type: integer
 *               locations:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Inventory item added
 */
router.post("/add-item", addInventory);

/**
 * @swagger
 * /inventory/update-item/{id}:
 *   put:
 *     summary: Update inventory item by ID
 *     tags: [Inventory]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
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
 *               category:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *               supplier:
 *                 type: string
 *               locations:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Inventory item updated
 *       404:
 *         description: Item not found
 */
router.put("/update-item/:id", updateInventory);

/**
 * @swagger
 * /inventory/delete/{id}:
 *   delete:
 *     summary: Delete an inventory item by ID
 *     tags: [Inventory]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found
 */
router.delete("/delete/:id", deleteInventory);

/**
 * @swagger
 * /inventory/assign-to-warehouse:
 *   put:
 *     summary: Assign inventory to a warehouse
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inventoryId:
 *                 type: string
 *               warehouseId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Inventory assigned to warehouse successfully
 *       404:
 *         description: Item or warehouse not found
 */
router.put("/assign-to-warehouse", assignToWarehouse);

/**
 * @swagger
 * /inventory/low-stock:
 *   get:
 *     summary: Get low stock items
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Low stock items retrieved
 */
router.get("/low-stock", getLowStockItems);

/**
 * @swagger
 * /inventory/reorder-stock:
 *   post:
 *     summary: Reorder stock for low-stock items
 *     tags: [Inventory]
 *     responses:
 *       201:
 *         description: Stock reorder placed
 */
router.post("/reorder-stock", reorderStock);

/**
 * @swagger
 * /inventory/create-order:
 *   post:
 *     summary: Create a purchase order
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               supplierId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Purchase order created
 *       404:
 *         description: Supplier not found
 */
router.post("/create-order", createPurchaseOrder);

/**
 * @swagger
 * /inventory/complete-order/{orderId}:
 *   put:
 *     summary: Mark an order as completed
 *     tags: [Inventory]
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order completed successfully
 *       404:
 *         description: Order or inventory item not found
 */
router.put("/complete-order/:orderId", completePurchaseOrder);

export default router;
