import {Router} from "express";

const router = Router();

router.use("/api/register", async(req,res)=>{
    const {username, password, gender} = req.body
    try{

    } catch(err){
        res.status(400).send({error: "Error while saving user"})
    }
} );

export default router;