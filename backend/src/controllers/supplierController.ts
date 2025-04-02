import { Request, Response } from "express";
import Supplier from "../models/Supplier";

export const addSupplier = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, address, streetNumber, houseNumber, contact, email } = req.body;

    const newSupplier = new Supplier({
      firstName,
      lastName,
      address,
      streetNumber,
      houseNumber,
      contact,
      email
    });

    await newSupplier.save();
    res.status(201).json({ message: "Supplier added successfully", supplier: newSupplier });
  } catch (error) {
    res.status(500).json({ message: "Error adding supplier" });
  }
};
export const getAllSuppliers = async (req: Request, res: Response) => {
    try {
      const suppliers = await Supplier.find();
      if (!suppliers || suppliers.length === 0) {
        return res.status(404).json({ message: "No suppliers found" });
      }
      res.status(200).json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching suppliers"});
    }
  };
export const getSupplierById = async (req: Request, res: Response) => {
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.status(200).json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Error fetching supplier" });
    }
  };
export const updateSupplier = async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, address, streetNumber, houseNumber, contact, email } = req.body;
      
      const updatedSupplier = await Supplier.findByIdAndUpdate(
        req.params.id, 
        { firstName, lastName, address, streetNumber, houseNumber, contact, email },
        { new: true }
      );
  
      if (!updatedSupplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
  
      res.status(200).json(updatedSupplier);
    } catch (error) {
      res.status(500).json({ message: "Error updating supplier" });
    }
  };
export const deleteSupplier = async (req: Request, res: Response) => {
    try {
      const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
      if (!deletedSupplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting supplier" });
    }
  };
  