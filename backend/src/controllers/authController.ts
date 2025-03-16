import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';
import User from '../models/User';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { firstName, lastName, email, username, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Password and confirmation password do not match' });
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_])[A-Za-z\d!@#$%^&*(),.?":{}|<>_]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        error: "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character."
      });
    }

    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ firstName, lastName, email, username, password: hashedPassword });
    await newAdmin.save();

    return res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: "Email/Username and password are required" });
    }

    let user = await Admin.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
    
    if (!user) {
      user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
    }

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username, role: user.role },
      process.env.JWT_SECRET || '#React-Admin_12345',
      { expiresIn: '1h' } 
    );

    return res.status(200).json({
      message: `${user.role} login successful`,
      token,
      user: { id: user._id, email: user.email, username: user.username, role: user.role }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}