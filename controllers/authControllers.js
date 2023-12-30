import { catchAsync } from "../utils/catchAsync.js";
import {User} from '../models/usermodel.js';
import {validationResult } from "express-validator"
import { AppError } from "../utils/AppError.js";
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary'


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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


export const updateUserController = catchAsync(async(req,res,next)=>{
    const {id} = req.user
    // req.body.age = Number(req.body.age)
    console.log(req.body)
    const newDetails = await User.findByIdAndUpdate(id,{...req.body.payload,age:Number(req.body.payload.age)},{new:true});
    return res.status(200).json({
        message:"success",
        data:newDetails
    })
})

export const uploadPhotos = catchAsync(async(req,res,next)=>{
    if(!req.files || req.files.length<2){
        next(new AppError('Please Upload all photos',400))
    }
	const {id} = req.user
	const imageData1 = req.files[0].buffer.toString("base64");
	const imageData2 = req.files[1].buffer.toString("base64");

	const [img1,img2] = await Promise.all([
		cloudinary.uploader.upload("data:image/jpeg;base64,"+imageData1),
		cloudinary.uploader.upload("data:image/jpeg;base64,"+imageData2)
	])

	const data = await User.findByIdAndUpdate(id,{photos:[img1.url,img2.url]},{new:true})
	return res.status(200).json({
		message:"success",
		data:data
	})
})