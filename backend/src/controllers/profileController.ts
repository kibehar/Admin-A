import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'; 
import Admin from '../models/Admin'; 

export const getAdminProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const adminId = req.user?.id; 

    if (!adminId) {
      return res.status(400).json({ error: "Admin not authenticated" });
    }

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const { password, ...adminInfo } = admin.toObject();

    return res.status(200).json(adminInfo);
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateAdminProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const adminId = req.user?.id; // Get admin ID from JWT token
    console.log("Admin ID from JWT:", adminId); // Add this line

    if (!adminId) {
      return res.status(400).json({ error: 'Admin not authenticated' });
    }

    const { firstName, lastName, email, username, newPassword, confirmNewPassword } = req.body;
    console.log("Request body:", req.body); // Add this line to check if body is correctly coming in

    // Find the admin in the database
    const admin = await Admin.findById(adminId);
    console.log("Admin found in DB:", admin); // Add this line

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Check if password fields exist and match
    if (newPassword || confirmNewPassword) {
      if (!newPassword || !confirmNewPassword) {
        return res.status(400).json({ error: 'Both newPassword and confirmNewPassword are required' });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ error: 'New password and confirm password do not match' });
      }

      // Hash the new password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      admin.password = hashedPassword;
    }

    // Update other fields
    admin.firstName = firstName || admin.firstName;
    admin.lastName = lastName || admin.lastName;
    admin.email = email || admin.email;
    admin.username = username || admin.username;

    // Save the updated admin info
    await admin.save();

    // Exclude password field from response
    const { password, ...updatedInfo } = admin.toObject();

    return res.status(200).json({
      message: 'Profile updated successfully',
      passwordMessage: newPassword ? 'Password updated successfully' : 'Password unchanged',
      updatedInfo
    });
  } catch (error) {
    console.error('Error updating profile:', error); // Improved error logging
    return res.status(500).json({ error: 'Internal server error' });
  }
};
