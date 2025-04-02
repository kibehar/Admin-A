import { Request, Response } from "express";
import mongoose from "mongoose";
import Inventory from "../models/Inventory";
import Warehouse from "../models/Warehouse";
import PurchaseOrder from "../models/PurchaseOrder";
import Supplier from "../models/Supplier";

const LOW_STOCK_THRESHOLD = 80;
export const createPurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { productId, supplierId, quantity } = req.body;

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    const order = new PurchaseOrder({
      productId,
      supplierId,
      quantity,
      status: "Pending",
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await order.save();
    res.status(201).json({ message: "Purchase order created", order });
  } catch (error) {
    res.status(500).json({ message: "Error creating purchase order" });
  }
};
export const completePurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await PurchaseOrder.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Pending") {
      return res.status(400).json({ message: "Order is not pending" });
    }

    const inventoryItem = await Inventory.findById(order.productId);
    if (!inventoryItem) return res.status(404).json({ message: "Inventory item not found" });

    // Update stock
    inventoryItem.stock += order.quantity;
    await inventoryItem.save();

    // Mark order as completed
    order.status = "Completed";
    await order.save();

    res.status(200).json({ message: "Order completed, inventory updated", order, inventoryItem });
  } catch (error) {
    res.status(500).json({ message: "Error completing purchase order" });
  }
};

export const reorderStock = async (req: Request, res: Response) => {
  try {
    const lowStockProducts = await Inventory.find({ stock: { $lt: LOW_STOCK_THRESHOLD } });

    if (lowStockProducts.length === 0) {
      return res.status(200).json({ message: "No products need to be reordered." });
    }

    const orders = [];

    for (const product of lowStockProducts) {
      // Find a supplier for this product (for now, just get the first supplier)
      const supplier = await Supplier.findOne();
      if (!supplier) {
        return res.status(500).json({ message: "No suppliers available to reorder from." });
      }

      const quantityToOrder = 50 - product.stock; // Reorder up to 50 units

      // Create a purchase order
      const order = new PurchaseOrder({
        productId: product._id,
        supplierId: supplier._id,
        quantity: quantityToOrder,
        status: "Pending",
        expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      });

      await order.save();
      orders.push(order);
    }

    res.status(201).json({ message: "Reorder requests placed", orders });
  } catch (error) {
    res.status(500).json({ message: "Error placing reorder requests" });
  }
};


export const getLowStockItems = async (req: Request, res: Response) => {
  try {
    console.log("🔍 Fetching low-stock items...");

    // Check if database connection is active
    console.log("📡 Checking MongoDB connection...");
    console.log("Mongoose connection state:", mongoose.connection.readyState); 

    // Fetch low-stock items
    const lowStockItems = await Inventory.find({ stock: { $lt: 80 } });

    console.log("✅ Query result:", lowStockItems);

    if (!lowStockItems || lowStockItems.length === 0) {
      console.log("⚠️ No low-stock items found.");
      return res.status(200).json({ message: "No low-stock items found" });
    }

    res.json(lowStockItems);
  } catch (error: any) {
    console.error("❌ Error in getLowStockItems:", error);
    res.status(500).json({ message: "Error fetching low-stock items", error: error.message || error });
  }
};

export const getInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory" });
  }
};

export const getInventoryById = async (req: Request, res: Response) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item" });
  }
};

export const addInventory = async (req: Request, res: Response) => {
  try {
    const { name, category, quantity, price, supplier, stock, locations } = req.body;
    
    const newItem = new Inventory({ 
      name, 
      category, 
      quantity,
      price, 
      supplier, 
      stock: stock || 0, 
      locations 
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Error adding item" });
  }
};

export const assignToWarehouse = async (req: Request, res: Response) => {
  try {
    const { inventoryId, warehouseId, quantity } = req.body;

    const inventory = await Inventory.findById(inventoryId);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    // Ensure the products array exists
    if (!warehouse.products) {
      warehouse.products = [];
    }

    // Check if the product already exists in the warehouse
    const existingProduct = warehouse.products.find(
      (product) => product.productId.toString() === inventoryId.toString()
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      warehouse.products.push({ productId: inventoryId, quantity });
    }

    await warehouse.save();

    res.status(200).json({ message: "Inventory assigned to warehouse successfully", warehouse });
  } catch (error) {
    res.status(500).json({ message: "Error assigning to warehouse" });
  }
};


export const updateStock = async (req: Request, res: Response) => {
  try {
    const { inventoryId, quantity } = req.body;

    const inventory = await Inventory.findById(inventoryId);
    if (!inventory) return res.status(404).json({ message: "Inventory item not found" });

    inventory.stock += quantity;
    await inventory.save();

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Error updating stock" });
  }
};

export const deleteInventory = async (req: Request, res: Response) => {
  try {
    const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item" });
  }
};

export const updateInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, price, supplier, locations } = req.body;

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      { name, category, quantity, price, supplier, locations },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating inventory" });
  }
};
