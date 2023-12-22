
import {validationResult } from "express-validator"
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { matchRequest } from "../models/matchrequest.js";

export const sendMatchRequest = catchAsync(async(req,res,next)=>{
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json(result)
    }

    const reciever = req.body.recieverId
    const sender = req.user._id
    if(reciever===sender){
        next(new AppError("You can't send match request to yourself",400));
    }
    const data = await matchRequest.create({sender:sender,reciever:reciever})
    return res.status(200).json({
        message:"Liked Successfully",
        data:data
    })
})