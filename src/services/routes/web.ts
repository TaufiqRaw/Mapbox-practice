import {Router} from 'express';
import catchAsync from '../../util/catchAsync';
const router = Router();

router.get("/",catchAsync((req,res)=>{
    res.render("index")
}))

export default router;