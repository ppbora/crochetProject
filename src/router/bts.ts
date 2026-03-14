import { Router } from "express";
import {createNameValidationSchema, queryValidationSchema} from '../utils/validationSchema';
import { checkSchema, matchedData, validationResult } from "express-validator";
import { name, nameType } from "../utils/constants";
import { resolveIndex } from "../middleware/resolveIndex";
interface CustomRequest extends Request {
  findIndex: number;
}


const router = Router();

//QUERY PARAMETERS = `?key=value&key2=value2
//query('x').y = validation chain to validate if y in x is true
router.get(
    "/bts", 
    checkSchema(queryValidationSchema), 
    (req, res) => {
    //console.log(req["express-validator#contexts"]);
        const result = validationResult(req);

        /*if (!result.isEmpty())
            return res.status(400).send({error: result.array()});*/

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
    })


// POST REQUEST
// You can use the same URL as GET req, bc server can differentiate them by the method used in the request

router.post( '/bts', 
    checkSchema(createNameValidationSchema), 
    (req, res) => {
        const result = validationResult(req)
        console.log(result)

        if(!result.isEmpty()) // if there's any error
            return res.status(400).send({error: result.array()})

        const data = matchedData(req) as Omit<nameType,"id"> //specify type except id
        // ...body = spread operator to copy all properties from body to the new object
        const newUsers = {id: (name.at(-1)?.id ?? 0) + 1, ...data}; // get the last id and add 1 to it
        name.push(newUsers); // add the new user to the name array
        return res.status(201).send(newUsers); //201 = created
    }
);

// route parameters
// :id = dynamic value that can be accessed through req.params.id
router.get('/bts/:id', resolveIndex, (req:CustomRequest, res) => {
    const {findIndex} = req
    const finduser = name[findIndex]
    return res.send(finduser);
});

//PUT REQUEST: Overwrite the entire resource with the new data provided
router.put('/bts/:id', resolveIndex, (req:CustomRequest, res) => {
    const findIndex = req.findIndex!
    const data = matchedData(req) as Omit<nameType,"id">
    
    const id= name[findIndex]?.id;
    if(id==undefined) return res.status(404).send("Not Found")
    name[findIndex] = {id: id, ...data};
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
router.patch('/bts/:id', resolveIndex, (req:CustomRequest, res) => {
    const {findIndex} = req;
    const data = matchedData(req) as {
        id: number
        name: string;
        realname: string;}
    // Update the user data at the found index with the new data from the request body
    name[findIndex] = {...name[findIndex], ...data}; // spread operator to merge existing data with new data
    return res.sendStatus(200);
});

//DELETE REQUEST
router.delete('/bts/:id', resolveIndex, (req:CustomRequest, res) => {
    const {findIndex} = req;
    // Remove the user from the array using splice
    // splice(start, deleteCount element) 
    // splice(start) : deletes all
    name.splice(findIndex,1);
    return res.sendStatus(200);
});
export default router;