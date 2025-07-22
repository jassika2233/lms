import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './Database/db.js';
import cors from 'cors'
import Razorpay from'razorpay'
dotenv.config();

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});

const app= express();

app.use(express.json());
app.use(cors())

const port= process.env.PORT;

app.get('/',(req,res)=>{
    res.send("Server is working");
});


app.use("/uploads",express.static("uploads"))
//importing userroutes

import userRoutes from './routes/user.js';
import courseRoutes from './routes/course.js';
import adminRoutes from './routes/admin.js';


app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
    connectDb();
});