import { Request, Response } from "express";
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

    inventoryItem.stock += order.quantity;
    inventoryItem.quantity += order.quantity;
    await inventoryItem.save();

    order.status = "Completed";
    await order.save();

    res.status(200).json({ message: "Order completed, inventory updated", order, inventoryItem });
  } catch (error) {
    res.status(500).json({ message: "Error completing purchase order" });
  }
};

export const reorderStock = async (_req: Request, res: Response) => {
  try {
    const lowStockProducts = await Inventory.find({ stock: { $lt: LOW_STOCK_THRESHOLD } });

    if (!lowStockProducts.length) {
      return res.status(200).json({ message: "No products need to be reordered." });
    }

    const orders = [];

    for (const product of lowStockProducts) {
      const supplier = await Supplier.findOne();
      if (!supplier) return res.status(500).json({ message: "No suppliers available." });

      const quantityToOrder = 50 - product.stock;

      const order = new PurchaseOrder({
        productId: product._id,
        supplierId: supplier._id,
        quantity: quantityToOrder,
        status: "Pending",
        expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      await order.save();
      orders.push(order);
    }

    res.status(201).json({ message: "Reorder requests placed", orders });
  } catch (error) {
    res.status(500).json({ message: "Error placing reorder requests" });
  }
};

export const getLowStockItems = async (_req: Request, res: Response) => {
  try {
    const lowStockItems = await Inventory.find({ stock: { $lt: LOW_STOCK_THRESHOLD } });
    res.json(lowStockItems);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching low-stock items", error: error.message || error });
  }
};

export const getInventory = async (_req: Request, res: Response) => {
  try {
    const inventory = await Inventory.find().sort({ createdAt: -1 }); // ✅ sort newest first
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventorys" });
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
    const { name, category, quantity, supplier, price } = req.body;

    if (!name || !category || !supplier || quantity === undefined || price === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newItem = new Inventory({
      name,
      category,
      quantity,
      stock: quantity,
      supplier,
      price,
    });

    await newItem.save();

    res.status(201).json({ message: "Item added", item: newItem });
  } catch (error) {
    console.error("Add Inventory Error:", error);
    res.status(500).json({ message: "Error adding inventory" });
  }
};


export const assignToWarehouse = async (req: Request, res: Response) => {
  try {
    const { inventoryId, warehouseId, quantity } = req.body;

    const inventory = await Inventory.findById(inventoryId);
    if (!inventory) return res.status(404).json({ message: "Inventory item not found" });

    if (inventory.quantity < quantity) {
      return res.status(400).json({ message: "Not enough available quantity in store" });
    }

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });

    const existingProduct = warehouse.products.find(
      (product) => product.productId.toString() === inventoryId.toString()
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      warehouse.products.push({ productId: inventoryId, quantity });
    }

    inventory.quantity -= quantity; // Decrease store quantity only (stock remains total)
    await inventory.save();
    await warehouse.save();

    res.status(200).json({ message: "Inventory assigned to warehouse", warehouse });
  } catch (error) {
    res.status(500).json({ message: "Error assigning to warehouse" });
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
    const { name, category, quantity, supplier, price } = req.body;

    const item = await Inventory.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    const quantityDifference = quantity - item.quantity;

    item.name = name;
    item.category = category;
    item.quantity = quantity;
    item.supplier = supplier;
    item.price = price ?? item.price; 
    item.stock += quantityDifference; 

    await item.save();

    res.status(200).json({ message: "Inventory updated", item });
  } catch (error) {
    console.error("Update Inventory Error:", error);
    res.status(500).json({ message: "Error updating inventory" });
  }
};

