import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const app=express();app.use(cors());app.use(express.json());
app.get('/api/health',(req,res)=>res.json({ok:true,message:'Team Finder API is running'}));
app.get('/api/players',(req,res)=>res.json([{id:1,name:'NightOwl',game:'Valorant',platform:'PC',rank:'Diamond'},{id:2,name:'Zenya',game:'Apex Legends',platform:'PC',rank:'Platinum'}]));
async function start(){const port=process.env.PORT||5000;if(process.env.MONGODB_URI){try{await mongoose.connect(process.env.MONGODB_URI);console.log('MongoDB connected')}catch(e){console.error(e.message)}}else{console.log('MONGODB_URI not set. Running without database.')}app.listen(port,()=>console.log(`Server running on http://localhost:${port}`))}
start();
