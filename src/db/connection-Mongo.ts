import mongoose from 'mongoose';
import express from 'express'
import env from '../config/config-env.ts';

async function connectToDatabase(){
    try{
        await mongoose.connect(env.MONGO_DB);
        console.log('Connected to MongoDB'); 
    }catch(err){
        throw new Error ('Error connecting to MongoDB:')
    }
};

export default connectToDatabase;