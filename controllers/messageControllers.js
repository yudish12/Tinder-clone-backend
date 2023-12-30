import { catchAsync } from "../utils/catchAsync.js";

export const sendMessage = catchAsync((req,res,next)=>{
    const result = validationResult(req);
    
    if (!result.isEmpty()) {
        return res.status(400).json(result)
    }

    const reciever = req.body.recieverId
})
export const getMessages = catchAsync((req,res,next)=>{

})
export const editMessage = catchAsync((req,res,next)=>{

})
export const deleteMessage = catchAsync((req,res,next)=>{

})