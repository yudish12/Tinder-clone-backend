import { catchAsync } from "../utils/catchAsync.js";
import {User} from '../models/usermodel.js';
import {validationResult } from "express-validator"
import { AppError } from "../utils/AppError.js";
import jwt from 'jsonwebtoken';

export const signUpController = catchAsync(async(req,res,next)=>{
    const result = validationResult(req);
    console.log(req.body.location.features)
    const coordinates = req.body.location.features[0].geometry.coordinates
    const address = req.body.location.features[0].properties.place_formatted
    const type = "Point"
    req.body.location = {type,coordinates,address};

    if (!result.isEmpty()) {
        return res.status(400).json(result)
    }

    const user = await User.create(req.body);
    const jwtToken = jwt.sign({userid:user._id,email:user.email,name:user.name},process.env.JWT_SECRET)

    return res.status(200).json({
        message:"success",
        data:{
            token:jwtToken,
            email:user.email,
            name:user.name,
        }
    })

})

export const loginController = catchAsync(async(req,res,next)=>{
    const result = validationResult(req);
    if (!result.isEmpty()) {
        next(new AppError("Please Fill both email and password",403))
    }

    const user = await User.findOne({email:req.body.email});

    if(!user){
        next(new AppError("Incorrect Email or Password",403))
    }
    
    if((await user.matchPasswords(req.body.password))) {
        const jwtToken = jwt.sign({userid:user._id,email:user.email,name:user.name},process.env.JWT_SECRET)
        
        return res.status(200).json({
            message:"success",
            data:{
                token:jwtToken,
                email:user.email,
                name:user.name,
            }
        
       })
    }
    else{
        next(new AppError("Incorrect Email or Password",403))
    }

})


export const getUserDetails = catchAsync(async(req,res,next)=>{
    const {id} = req.user
    const user = await User.findById(id).select("-password")

    if(!user){
        next(new AppError("User Not Found",403))
    }

    return res.status(200).json({
        message:"success",
        data:user
    })


})