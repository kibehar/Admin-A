import mongoose, { Schema, Document } from "mongoose";

export interface IInventory extends Document {
  name: string;
  category: string;
  price: number;
  supplier: string;
  stock: number;
  quantity: number;
  locations: string[];
  warehouses: { warehouseId: mongoose.Types.ObjectId; quantity: number }[];
}

const InventorySchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  supplier: { type: String, required: true },
  stock: { type: Number, default: 0 },
  quantity: { type: Number, required: true },
  locations: { type: [String], default: [] },
  warehouses: [
    {
      warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

export default mongoose.model<IInventory>("Inventory", InventorySchema);
