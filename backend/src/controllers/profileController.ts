import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin"; 

export const getAdminProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const adminId = req.user?.id;
    if (!adminId) return res.status(400).json({ error: "Admin not authenticated" });

    const admin = await Admin.findById(adminId).select("-password"); 
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    return res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateAdminProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const adminId = req.user?.id;
    if (!adminId) return res.status(400).json({ error: "Admin not authenticated" });

    const { firstName, lastName, email, username, newPassword, confirmNewPassword } = req.body;
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    if (newPassword && confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ error: "New password and confirm password do not match" });
      }
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(newPassword, salt);
    }

    admin.firstName = firstName || admin.firstName;
    admin.lastName = lastName || admin.lastName;
    admin.email = email || admin.email;
    admin.username = username || admin.username;
    
    await admin.save();
    const { password, ...updatedInfo } = admin.toObject();

    return res.status(200).json({
      message: "Profile updated successfully",
      updatedInfo,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
