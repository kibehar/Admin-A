import { Request, Response } from "express";
import Inventory from "../models/Inventory";
import Warehouse from "../models/Warehouse";
import Sale from "../models/Sale";

export const recordSale = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, price, warehouseId, paymentStatus, customerName,customerPhoneNumber } = req.body;

    const product = await Inventory.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock in the inventory" });
    }

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });

    const warehouseStock = warehouse.products.find(p => p.productId.toString() === productId.toString());
    if (!warehouseStock) {
      return res.status(400).json({ message: "Product not found in the specified warehouse" });
    }

    if (warehouseStock.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock in the warehouse" });
    }

    warehouseStock.quantity -= quantity;
    await warehouse.save();

    product.stock -= quantity;
    await product.save();

    const newSale = new Sale({
      productId,
      warehouseId,
      quantity,
      price,
      paymentStatus,
      saleDate: new Date(),
      customerName: customerName || undefined,
      customerPhoneNumber:customerPhoneNumber,
      snapshot: {
        name: product.name,
        category: product.category,
      },
    });

    await newSale.save();

    res.status(201).json({ message: "Sale recorded successfully", sale: newSale });
  } catch (error) {
    console.error("Error recording sale:", error);
    res.status(500).json({ message: "Error recording sale" });
  }
};



export const getAllSales = async (req: Request, res: Response) => {
  try {
    const sales = await Sale.find().populate("productId warehouseId"); 
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales records" });
  }
};
