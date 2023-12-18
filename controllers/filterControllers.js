import { validationResult } from "express-validator";
import { User } from "../models/usermodel.js";
import { catchAsync } from "../utils/catchAsync.js";


export const applyFilter = catchAsync(async(req,res,next)=>{
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).json(result)
    }
    
    const newres = await User.findByIdAndUpdate(req.user.id,{filters:req.body.filters},{new:true})

    return res.status(200).json({
        message:"success",
        data:newres
    })
})