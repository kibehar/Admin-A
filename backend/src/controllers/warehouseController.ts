import { Request, Response } from "express";
import Warehouse from "../models/Warehouse";
import Inventory from "../models/Inventory";
import Supplier from "../models/Supplier";

export const createWarehouse = async (req: Request, res: Response) => {
  try {
    const { name, location } = req.body;
    const existingWarehouse = await Warehouse.findOne({ name });
    if (existingWarehouse) {
      return res.status(400).json({ message: "Warehouse already exists" });
    }
    const newWarehouse = new Warehouse({ name, location });
    await newWarehouse.save();
    res.status(201).json({ message: "Warehouse added", warehouse: newWarehouse });
  } catch (error) {
    console.error("Error creating warehouse:", error);
    res.status(500).json({ message: "Error creating warehouse" });
  }
};

export const getAllWarehouses = async (req: Request, res: Response) => {
  try {
    const warehouses = await Warehouse.find();
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching warehouses" });
  }
};


export const getWarehouseDetails = async (req: Request, res: Response) => {
  try {
    const { warehouseId } = req.params;

    const warehouse = await Warehouse.findById(warehouseId).populate({
      path: "products.productId",
      model: "Inventory",
      populate: {
        path: "supplier",
        model: "Supplier",
        select: "firstName lastName", 
      },
    });

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    const detailedProducts = warehouse.products.map((p) => {
      const product: any = p.productId;
      const supplier = product?.supplier;
      const supplierName = supplier
        ? `${supplier.firstName} ${supplier.lastName}`
        : "Unknown";

      return {
        name: product?.name || "Unknown",
        category: product?.category || "Unknown",
        supplier: supplierName, 
        quantity: p.quantity,
      };
    });

    res.status(200).json({ warehouseName: warehouse.name, items: detailedProducts });
  } catch (error) {
    console.error("Error fetching warehouse details:", error);
    res.status(500).json({ message: "Error fetching warehouse details" });
  }
};



export const updateWarehouse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    const updated = await Warehouse.findByIdAndUpdate(id, { name, location }, { new: true });

    if (!updated) return res.status(404).json({ message: "Warehouse not found" });

    res.status(200).json({ message: "Warehouse updated", warehouse: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating warehouse" });
  }
};

export const deleteWarehouse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const warehouse = await Warehouse.findById(id);
    if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });

    for (const product of warehouse.products) {
      const inventoryItem = await Inventory.findById(product.productId);
      if (inventoryItem) {
        inventoryItem.quantity += product.quantity;
        await inventoryItem.save();
      }
    }

    await Warehouse.findByIdAndDelete(id);

    res.status(200).json({ message: "Warehouse deleted, items returned to inventory" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting warehouse" });
  }
};
