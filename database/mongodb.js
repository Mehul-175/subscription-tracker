/* eslint-disable no-undef */
import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if(!DB_URI){
    throw new Error('DB_URI is not defined');
}

const connectToMongoDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        
        await mongoose.connect(DB_URI);
        console.log('Connected to MongoDB');
        console.log(`Connected to Database in ${NODE_ENV} mode`);
        
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export default connectToMongoDB;