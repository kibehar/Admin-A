import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: "Admin";  
}

const AdminSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "Admin" }, 
});

export default mongoose.model<IAdmin>("Admin", AdminSchema);
