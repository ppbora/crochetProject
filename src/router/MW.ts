import { Router } from "express";

const router = Router();

router.get('/MW',
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

export default router;