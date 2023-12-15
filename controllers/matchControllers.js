import { catchAsync } from "../utils/catchAsync.js";
import jwt from 'jsonwebtoken';
import {validationResult } from "express-validator"
import { AppError } from "../utils/AppError.js";

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
    console.log(reciever,sender)
})
