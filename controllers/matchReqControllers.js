
import {validationResult } from "express-validator"
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { matchRequest } from "../models/matchrequest.js";
import { match } from "../models/matchmodel.js";

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


export const crossedMatchRequest = catchAsync(async(req,res,next)=>{
    const result = validationResult(req);
    
    if(!result.isEmpty()){
        return res.status(400).json(result)
    }

    const reciever = req.body.recieverId
    const sender = req.user._id

    if(reciever===sender){
        next(new AppError("You can't send match request to yourself",400));
    }

    const data = await matchRequest.create({sender:sender,reciever:reciever,status:"rejected"})
    return res.status(200).json({
        message:"Liked Successfully",
        data:data
    })

})

export const getMatchRequest = catchAsync(async(req,res,next)=>{
    const {_id} = req.user;
    // console.log(req.user)
    const data = await matchRequest.find({reciever:_id,status:"pending"}).populate('sender');

    return res.status(200).json({
        message:"showing all requests",
        data:data
    })

})


export const acceptRequest = catchAsync(async(req,res,next)=>{
    const {reqid} = req.params;
    console.log(reqid)
    const data = await matchRequest.findByIdAndUpdate({_id:reqid},{status:"accepted"})

    const newMatch = await match.create(
        {
            users:[
                data.reciever,
                data.sender
            ],
            matchRequest:data._id,
            status:"matched"
        }
    );
    return res.status(200).json({
        message:"matched with the user",
        data:data._id
    })
})


export const rejectRequest = catchAsync(async(req,res,next)=>{
    const {reqid} = req.params;
    await matchRequest.findByIdAndUpdate({_id:reqid},{status:"rejected"})
    
    return res.status(200).json({
        message:"match request rejected",
        data:reqid
    })
})