import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'; 
import User from '../models/User'; 

export const getUserProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id; 
    if (!userId) {
      return res.status(400).json({ error: 'User not authenticated' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userInfo } = user.toObject();

    return res.status(200).json(userInfo);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
export const updateUserProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.id; 
  
      if (!userId) {
        return res.status(400).json({ error: 'User not authenticated' });
      }
  
      const { firstName, lastName, email, username, newPassword, confirmNewPassword } = req.body;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (newPassword || confirmNewPassword) {
        if (!newPassword || !confirmNewPassword) {
          return res.status(400).json({ error: 'Both newPassword and confirmNewPassword are required' });
        }
        if (newPassword !== confirmNewPassword) {
          return res.status(400).json({ error: 'New password and confirm password do not match' });
        }
  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
      }
  
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.username = username || user.username;
  
      await user.save();
  
      const { password, ...updatedInfo } = user.toObject();
  
      return res.status(200).json({
        message: 'Profile updated successfully',
        passwordMessage: newPassword ? 'Password updated successfully' : 'Password unchanged',
        updatedInfo
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  