import {User} from '../models/usermodel.js';
import { AppError } from '../utils/AppError.js';
import jwt from 'jsonwebtoken'
import { catchAsync } from '../utils/catchAsync.js';


export const authMiddleware = catchAsync(async(req,res,next)=>{
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return next(
          new AppError('You are not logged in or token provided is wrong', 401)
        );
      }
    
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
      const user = await User.findById(decoded.userid).select('-password');
      if (!user) {
        return next(
          new AppError('User belonging to this token does no longer exist', 401)
        );
    }

    req.user = user;
    next();
    
})