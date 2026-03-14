import { configDotenv } from 'dotenv';
import express from 'express';
import { Request } from "express";
import { query, validationResult, body, matchedData, checkSchema } from 'express-validator';
import {createNameValidationSchema, queryValidationSchema} from './utils/validationSchema'

interface CustomRequest extends Request {
  findIndex: number;
}

configDotenv({path: './.env'})

const port = process.env['PORT'] || 3000;
const app = express();
app.use(express.json()); // MIDDLEWARE for parsing application/json

// MIDDLEWARE
const loggingMW = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`),
    next()
};

//Use middleware for all after app.use(loggingMW)
/*app.use(loggingMW);*/

const resolveIndex = (req:CustomRequest, res, next) => {
    const {params: {id}} = req;
    const parsedID = parseInt(String(id));
    if (isNaN(parsedID)) return res.status(400).send({ msg: 'Bad Request: Invalid ID' });
    const findIndex = name.findIndex((use)=> use.id === parsedID);
    if (findIndex === -1) return res.sendStatus(404);
    req.findIndex = findIndex;
    next();
}

const name = [{ id: 1, name: "Jin", realname: "Seokjin" },
              { id: 2, name: "Suga", realname: "Min Yoongi" },
              { id: 3, name: "J-Hope", realname: "Jung Hoseok" },
              { id: 4, name: "RM", realname: "Kim Namjoon" },
              { id: 5, name: "Jimin", realname: "Park Jimin" },
              { id: 6, name: "V", realname: "Abhishek" },
              { id: 7, name: "Jungkook", realname: "Jeon Jungkook" }]

// Pass loggingMW as an argument to use the function
app.get('/', loggingMW, (req, res) => {
// '/' is the root path, request and response are the parameters
    res.status(404).send('Hello World');
});

app.get('/MW',
    (req,res,next) => {
        console.log('1\n');
        next();
    },
    (req,res,next) => {
        console.log('2\n');
        next();
    },
    (req,res) => {
        res.status(200).send({msg: 'This is Alien'});
    }
)

//query('x').y = validation chain to validate if y in x is true
app.get(
    '/bts', 
    checkSchema(queryValidationSchema), 
    (req, res) => {
    //console.log(req["express-validator#contexts"]);
        const result = validationResult(req);

        if (!result.isEmpty())
            return res.status(400).send({error: result.array()});

        const data=matchedData(req);
        console.log(data)
        const {
            query:{filter, value}
        } = req;
        // //when filter and value are not provided, return the whole name array
        // if (!filter && !value) return res.send(name);
        if (filter && value) 
            return res.send(
                // check if filter contains the value
                name.filter((members) => String(members[filter as string]).includes(String(value)))
            );
        return res.send(name);
    }
);

// POST REQUEST
// You can use the same URL as GET req, bc server can differentiate them by the method used in the request
app.post(
    '/bts', 
    checkSchema(createNameValidationSchema), 
    (req, res) => {
        const result = validationResult(req)
        console.log(result)

        if(!result.isEmpty()) // if there's any error
            return res.status(400).send({error: result.array()})

        const data = matchedData(req) as {
            name: string;
            realname: string;
        };
        // ...body = spread operator to copy all properties from body to the new object
        const newUsers = {id: (name.at(-1)?.id ?? 0) + 1, ...data}; // get the last id and add 1 to it
        name.push(newUsers); // add the new user to the name array
        return res.status(201).send(newUsers); //201 = created
    }
);

// route parameters
// :id = dynamic value that can be accessed through req.params.id
app.get('/bts/:id', resolveIndex, (req:CustomRequest, res) => {
    const {findIndex} = req
    const finduser = name[findIndex]
    return res.send(finduser);
});

//PUT REQUEST: Overwrite the entire resource with the new data provided
app.put('/bts/:id', resolveIndex, (req:CustomRequest, res) => {
    const {body, findIndex} = req
    name[findIndex] = {id: name[findIndex]?.id, ...body};
    return res.sendStatus(200);
        /*
    const {body, params: {id}} = req;
    
    const parsedID = parseInt(id);
    if (isNaN(parsedID)) return res.status(400).send({ msg: 'Bad Request: Invalid ID' });
    
    // Find the index of the user with the matching id
    const findIndex = name.findIndex(
        (use)=> use.id === parsedID
    );
    if (findIndex === -1) return res.sendStatus(404);
    */
    // Update the user data at the found index with the new data from the request body
});

//PATCH REQUEST: Overwrite partially
app.patch('/bts/:id', resolveIndex, (req:CustomRequest, res) => {
    const {body, findIndex} = req;
    // Update the user data at the found index with the new data from the request body
    name[findIndex] = {...name[findIndex], ...body}; // spread operator to merge existing data with new data
    return res.sendStatus(200);
});

//DELETE REQUEST
app.delete('/bts/:id', resolveIndex, (req:CustomRequest, res) => {
    const {findIndex} = req;
    // Remove the user from the array using splice
    // splice(start, deleteCount element) 
    // splice(start) : deletes all
    name.splice(findIndex,1);
    return res.sendStatus(200);
});

//QUERY PARAMETERS = `?key=value&key2=value2
// 
app.listen(port, () => {
    console.log(`Running on ${port}`);
});