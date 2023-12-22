import express from "express";
import { getUserDetails, loginController, signUpController,updateUserController } from "../controllers/authControllers.js";
import { body, param } from "express-validator";
import { catchAsync } from "../utils/catchAsync.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/usermodel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/check/:token',param('token').notEmpty(),catchAsync(async(req,res,next)=>{
  const {token} = req.params;
  const userid =  jwt.verify(token,process.env.JWT_SECRET).userid;
  const user = await User.findById(userid);

  if(!user)return res.status(401).json(user);

  console.log(user)

  return res.status(200).json(user)

}))

router.post(
    '/signup',
    [
      body('email').notEmpty().isEmail(),
      body('password').notEmpty(),
      body('name').notEmpty(),
      body('age').notEmpty(),
      body('gender').notEmpty(),
      body('preference').notEmpty(),
      body('date_type').notEmpty(),
      body('location').notEmpty()
    ],
    signUpController
  );

router.post(
    '/login',
    [
      body('email').notEmpty().isEmail(),
      body('password').notEmpty(),
    ],
    loginController
  );


  router.route('/').get(authMiddleware,
    getUserDetails
  ).patch(authMiddleware,updateUserController)
  


export default router