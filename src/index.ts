import { configDotenv } from 'dotenv';
import express from 'express';
import routerIndex from './router/index';

configDotenv({path: './.env'})

const port = process.env['PORT'] || 3000;
const app = express();

app.use(express.json()); // MIDDLEWARE for parsing application/json
app.use(routerIndex);

//Use middleware for all after app.use(loggingMW)
/*app.use(loggingMW);*/


app.get('/', (req, res) => {
// '/' is the root path, request and response are the parameters
    res.status(404).send('Hello World');
});


app.listen(port, () => {
    console.log(`Running on ${port}`);
});