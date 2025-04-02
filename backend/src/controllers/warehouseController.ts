import { Request, Response } from "express";
import Warehouse from "../models/Warehouse";

export const createWarehouse = async (req: Request, res: Response) => {
  try {
    const { name, location } = req.body;

    const existingWarehouse = await Warehouse.findOne({ name });
    if (existingWarehouse) {
      return res.status(400).json({ message: "Warehouse already exists" });
    }

    const newWarehouse = new Warehouse({ name, location });
    await newWarehouse.save();

    res.status(201).json({ message: "Warehouse added successfully", warehouse: newWarehouse });
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
