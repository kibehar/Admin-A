import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes'; 
import userRoutes from "./routes/userRoutes"; 
import dotenv from 'dotenv';
import listEndpoints from "express-list-endpoints";
import cors from 'cors';

dotenv.config(); 
//for connecting wiht frontend 
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,  
}));

app.use('/api/auth', authRoutes); 
app.use("/api/users", userRoutes);
console.log(listEndpoints(app)); 


mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('✅ Database connected'))
  .catch((error) => console.error('❌ Error connecting to MongoDB:', error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
