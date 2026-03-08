import { configDotenv } from 'dotenv';
import express from 'express';

configDotenv({path: './.env'})

const port = process.env['PORT'] || 3000;
const app = express();

app.listen(port,()=>{
    console.log(`Running on ${port}`);
});