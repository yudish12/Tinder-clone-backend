import { validationResult } from "express-validator";
import { messages } from "../models/messages.js";
import { catchAsync } from "../utils/catchAsync.js";

export const sendMessage = catchAsync(async (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).json(result)
    }

    const reciever = req.body.recieverId
    const { matchId, message } = req.body
    const sender = req.user._id

    const data = await messages.create({ message, matchId, reciever, sender })
    await data.populate('sender')
    console.log(data)
    return res.status(200).json({
        message:"message sent succesfully",
        data:data
    })
})
export const getMessages = catchAsync(async(req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).json(result)
    }
    console.log(req.query)
    const {matchId} = req.query;
    const data = await messages.find({matchId}).populate('sender')
    return res.status(200).json({
        message:"messages fetched successfully",
        data:data
    });
})


export const editMessage = catchAsync(async(req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).json(result)
    }
    console.log(req.query)
    const {message} = req.body;
    const {matchId} = req.query;

    const newMessage = await messages.findByIdAndUpdate(matchId,{message:message},{new:true});

    return res.status(200).json({
        messaage:"message updated succesfully",
        data:newMessage
    })

})


export const deleteMessage = catchAsync(async(req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).json(result)
    }
    
    console.log(req.query)

    const {messageId} = req.query;
    await messages.findByIdAndDelete(messageId);
    return res.status(200).json({
        message:"message deleted sucessfully",
    })
})