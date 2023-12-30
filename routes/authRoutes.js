import express from "express";
import { getUserDetails, loginController, signUpController,updateUserController,uploadPhotos } from "../controllers/authControllers.js";
import { body, param } from "express-validator";
import { catchAsync } from "../utils/catchAsync.js";
import jwt from 'jsonwebtoken'
import multer from 'multer'
import { User } from "../models/usermodel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

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

    router.use(authMiddleware)

  router.route('/').get(authMiddleware,
    getUserDetails
  ).patch(authMiddleware,updateUserController)

  router.patch('/upload/photos',upload.array('photos'),uploadPhotos)
  


export default router