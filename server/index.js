import express from "express";
import cors from 'cors';
import env from "dotenv";
import authRoutes from './routes/authRoutes.js';
import main from "./utils/DeepSeek.js";
env.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});